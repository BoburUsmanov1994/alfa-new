import axios from "axios";
import { EIMZOClient as client } from "./e-imzo-client";
import { get } from "lodash";
import { request } from "../api";


const CAPIWS = window.CAPIWS;

export default class EIMZO {
    _loadedKey = null;
    get loadedKey() {
        return this._loadedKey;
    }
    set loadedKey(value) {
        this._loadedKey = value;
    }
    apiKeys = [
        'null', 'E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D',
        'localhost', '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
        '127.0.0.1', 'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
        'alfainvest.uz', '3B5DE1FCDBB9D85A3B9F332CB86B3C93C878BAC1902EE5A6A00C6E48F54482CF9E1958130B1AB8D53BC557210F75BFB802DDA2A56145FBA298FC4A482A5E337C',
        // 'pr1.alfainvest.uz', '3B5DE1FCDBB9D85A3B9F332CB86B3C93C878BAC1902EE5A6A00C6E48F54482CF9E1958130B1AB8D53BC557210F75BFB802DDA2A56145FBA298FC4A482A5E337C'
    ];
    async checkVersion() {
        return new Promise((resolve, reject) => {
            client.checkVersion(
                function (major, minor) {
                    resolve({ major, minor });
                },
                function (error, message) {
                    reject(error, message);
                }
            );
        });
    }

    async installApiKeys() {
        return new Promise((resolve, reject) => {
            client.installApiKeys(resolve, reject);
        });
    }

    async listAllUserKeys() {
        return new Promise((resolve, reject) => {
            client.listAllUserKeys(
                function (cert, index) {
                    return "cert-" + cert.serialNumber + "-" + index;
                },
                function (index, cert) {
                    return cert;
                },
                function (items, firstId) {
                    resolve(items, firstId);
                },
                function (error, reason) {
                    reject(error, reason);
                }
            );
        });
    }

    async loadKey(cert) {
        return new Promise((resolve, reject) => {
            client.loadKey(
                cert,
                (id) => {
                    this._loadedKey = cert;
                    resolve({ cert, id });
                },
                reject
            );
        });
    }

    async getCertificateChain(loadKeyId) {
        return new Promise((resolve, reject) => {
            CAPIWS.callFunction(
                {
                    plugin: "x509",
                    name: "get_certificate_chain",
                    arguments: [loadKeyId],
                },
                (event, data) => {
                    if (data.success) {
                        resolve(data.certificates);
                    } else {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject("Failed");
                    }
                },
                reject
            );
        });
    }

    async getMainCertificate(loadKeyId) {
        const result = await this.getCertificateChain(loadKeyId);

        if (Array.isArray(result) && result.length > 0) {
            return result[0];
        }
        return null;
    }

    async getCertInfo(cert) {
        return new Promise((resolve, reject) => {
            CAPIWS.callFunction(
                { name: "get_certificate_info", arguments: [cert] },
                (event, data) => {
                    if (data.success) {
                        resolve(data.certificate_info);
                    } else {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject("Failed");
                    }
                },
                reject
            );
        });
    }

    async signPkcs7(cert, content) {
        const loadKeyResult = await this.loadKey(cert);

        return new Promise((resolve, reject) => {
            CAPIWS.callFunction(
                {
                    name: "create_pkcs7",
                    plugin: "pkcs7",
                    arguments: [window.Base64.encode(content), loadKeyResult.id, "no"],
                },
                (event, data) => {
                    if (data.success) {
                        resolve(data);
                    } else {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject("Failed");
                    }
                },
                reject
            );
        });
    }


    async createNewPkcs7(cert, content) {

        const challenge = await request.get("api/eimzo/challenge").then(res => res);

        const response = get(challenge,"data");

        let sessiosResultId = sessionStorage.getItem(cert.serialNumber)

        let storedTime = sessionStorage.getItem(`${cert.serialNumber}_time`);
        const now = new Date().getTime();

        if (sessiosResultId && storedTime) {
            const elapsedHours = (now - storedTime) / (1000 * 60 * 60);
            if (elapsedHours >= 6) {
                sessionStorage.removeItem(cert.serialNumber);
                sessionStorage.removeItem(`${cert.serialNumber}_time`);
                sessiosResultId = null;
            }
        }
        if(!sessiosResultId){
            const {id} = await this.loadKey(cert);
            sessiosResultId = id
            sessionStorage.setItem(cert.serialNumber,id)
            sessionStorage.setItem(`${cert.serialNumber}_time`, now.toString());
        }
        return new Promise((resolve, reject) => {

            CAPIWS.callFunction(
                {
                    name: 'create_pkcs7',
                    plugin: 'pkcs7',
                    arguments: [window.Base64.encode(content), sessiosResultId, 'no']
                },
                (event, data) => {
                    if (data.success) {
                        resolve(data)
                    } else {

                        reject('Failed')
                    }
                },
                reject
            );
        });
    }
    async createPkcs7(id, content, timestamper) {
        return new Promise((resolve, reject) => {
            client.createPkcs7(
                id,
                content,
                timestamper,
                (/* string */ pkcs7) => {
                    resolve(pkcs7);
                },
                reject
            );
        });
    }

    async getTimestampToken(signature) {
        return new Promise((resolve, reject) => {
            CAPIWS.callFunction(
                {
                    name: "get_timestamp_token_request_for_signature",
                    arguments: [signature],
                },
                function (event, data) {
                    if (data.success) {
                        resolve(data.timestamp_request_64);
                    } else {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject("Failed");
                    }
                },
                reject
            );
        });
    }

    addApiKey(domain, key) {
        if (!this.apiKeys.includes(domain)) {
            this.apiKeys.push(domain, key);
        }
    }

    async install() {
        await this.checkVersion();

        client.API_KEYS = this.apiKeys;

        await this.installApiKeys();
    }
}
