import dayjs from "dayjs";
import { find, get, includes, isEqual, isNil, setWith } from "lodash";
import React, { useState } from "react";
import { Trash2 } from "react-feather";
import { Col, Row } from "react-grid-system";
import { useTranslation } from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import { toast } from "react-toastify";
import Flex from "../../../components/flex";
import { OverlayLoader } from "../../../components/loader";
import Panel from "../../../components/panel";
import Search from "../../../components/search";
import Section from "../../../components/section";
import Table from "../../../components/table";
import Button from "../../../components/ui/button";
import Title from "../../../components/ui/title";
import { PERSON_TYPE } from "../../../constants";
import { KEYS } from "../../../constants/key";
import { URLS } from "../../../constants/url";
import Field from "../../../containers/form/field";
import Form from "../../../containers/form/form";
import {useGetAllQuery, useGetOneQuery, usePutQuery} from "../../../hooks/api";
import { useSettingsStore } from "../../../store";
import { getSelectOptionsListFromData } from "../../../utils";

const AgentsUpdateContainer = () => {
    const {id} = useParams()
    const [tarif, setTarif] = useState({});
    const [tariffList, setTariffList] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [personType, setPersonType] = useState(null);
    const [region, setregion] = useState(null);
    const [productGroupId, setProductGroupId] = useState(null);
    const [productSubGroupId, setProductSubGroupId] = useState(null);
    const [productId, setProductId] = useState(null);
    let {data: agent, isLoading, isError} = useGetOneQuery({id, key: KEYS.agents, url: `${URLS.agents}/show`})
    const {mutate: updateRequest, isLoading: updateIsLoading} = usePutQuery({listKeyId: KEYS.agents})
    const setPersonTypeForSelect = (val, name) => {
        if (isEqual(name, "typeofpersons")) {
            setPersonType(val);
        }
        if (isEqual(name, "organization.region")) {
            setregion(val);
        }
        if (isEqual(name, "person.region")) {
            setregion(val);
        }
    };

    const product = useSettingsStore((state) => get(state, "product", {}));
    let { data: branches } = useGetAllQuery({
        key: KEYS.branches,
        url: `${URLS.branches}/list`,
    });
    branches = getSelectOptionsListFromData(
        get(branches, `data.data`, []),
        "_id",
        "branchName"
    );

    let { data: citizenshipList } = useGetAllQuery({
        key: KEYS.residentType,
        url: `${URLS.residentType}`,
    });
    citizenshipList = getSelectOptionsListFromData(
        get(citizenshipList, `data.data`, []),
        "_id",
        "name"
    );

    let { data: documentTypeList } = useGetAllQuery({
        key: KEYS.documentType,
        url: `${URLS.documentType}/list`,
    });
    documentTypeList = getSelectOptionsListFromData(
        get(documentTypeList, `data.data`, []),
        "_id",
        "name"
    );

    let { data: regions } = useGetAllQuery({
        key: KEYS.regions,
        url: `${URLS.regions}/list`,
    });
    regions = getSelectOptionsListFromData(
        get(regions, `data.data`, []),
        "_id",
        "name"
    );

    let { data: agentTypes } = useGetAllQuery({
        key: KEYS.typeofagent,
        url: `${URLS.typeofagent}/list`,
    });
    agentTypes = getSelectOptionsListFromData(
        get(agentTypes, `data.data`, []),
        "_id",
        "name"
    );

    let { data: genders } = useGetAllQuery({
        key: KEYS.genders,
        url: `${URLS.genders}/list`,
    });
    genders = getSelectOptionsListFromData(
        get(genders, `data.data`, []),
        "_id",
        "name"
    );

    let { data: employeeList } = useGetAllQuery({
        key: KEYS.employee,
        url: `${URLS.employee}/list`,
    });
    employeeList = getSelectOptionsListFromData(
        get(employeeList, `data.data`, []),
        "_id",
        "fullname"
    );

    let { data: districts } = useGetAllQuery({
        key: KEYS.districtsByRegion,
        url: `${URLS.districts}/list`,
        params: {
            params: {
                region,
            },
        },
        enabled: !!region,
    });
    districts = getSelectOptionsListFromData(
        get(districts, `data.data`, []),
        "_id",
        "name"
    );

    let {data: groups} = useGetAllQuery({key: KEYS.groupsofproducts, url: `${URLS.groupsofproducts}/list`})
    groups = getSelectOptionsListFromData(get(groups, `data.data`, []), '_id', 'name')

    let {data: subGroups} = useGetAllQuery({
        key: [KEYS.subgroupsofproductsFilter, productGroupId],
        url: URLS.subgroupsofproductsFilter,
        params: {
            params: {
                group: productGroupId
            }
        },
        enabled: !!productGroupId
    })
    subGroups = getSelectOptionsListFromData(get(subGroups, `data.data`, []), '_id', 'name')
    let {data: productsList} = useGetAllQuery({
        key: [KEYS.productsfilter, productSubGroupId],
        url: URLS.products,
        params: {
            params: {
                subGroup: productSubGroupId
            }
        },
        enabled: !!productSubGroupId
    })

    let products = getSelectOptionsListFromData(
        get(productsList, `data.data`, []),
        "_id",
        ["name"]
    );

    let { data: classes } = useGetAllQuery({
        key: KEYS.classes,
        url: `${URLS.insuranceClass}/list`,
    });
    const classOptions = getSelectOptionsListFromData(
        get(classes, `data.data`, []),
        "_id",
        "name"
    );

    const setFieldValue = (value, name = "") => {
        if (
            includes(
                [
                    "tariff[0].product",
                    "tariff[0].allowAgreement",
                    "tariff[0].limitOfAgreement",
                ],
                name
            )
        ) {
            setTarif((prev) => ({ ...prev, [name]: value }));
        }

        if (includes(name, "tariff[0].tariffPerClass")) {
            setTarif({ ...setWith(tarif, name, value) });
        }
    };

    const findItem = (list = [], id = null) => {
        return find(list, (l) => isEqual(get(l, "_id"), id));
    };

    const addTariff = () => {
        let result = [];
        let { ...rest } = tarif;
        if (!isNil(get(tarif, "tariff[0].product"))) {
            const res = tariffList.filter(
                (t) =>
                    !isEqual(get(t, "tariff[0].product"), get(rest, "tariff[0].product"))
            );
            result = [...res, rest];
            setTariffList(result);
            setTarif({
                ...tarif,
                tariffPerClass: get(tarif, "tariff.tariffPerClass", []).map(
                    ({ class: classes, min, max }) => ({
                        classes,
                        min: 0,
                        max: 0,
                    })
                ),
            });
        } else {
            toast.warn("Select all fields");
        }
    };

    const removeTariffFromList = (i) => {
        setTariffList((prev) => prev.filter((f, j) => !isEqual(i, j)));
    };



    const create = ({ data }) => {
        updateRequest(
            {
                url:`${ URLS.agents}/${id}`,
                attributes: {
                    ...data,
                    agreementdate: dayjs(get(data, "agreementdate")),
                },
            },
            {
                onSuccess: () => {
                    navigate("/agents/insurance-agents");
                },
                onError: () => {},
            }
        );
    };
    if(isLoading){
        return <OverlayLoader />
    }

    return (
        <>
            {/*{isLoading && <OverlayLoader />}*/}
            <Panel>
                <Row>
                    <Col xs={12}>
                        <Search />
                    </Col>
                </Row>
            </Panel>
            <Section>
                <Row className={"mb-25"}>
                    <Col xs={12}>
                        <Title>{t("Update agent")}</Title>
                    </Col>
                </Row>
                <Form
                    getValueFromField={(val, name) => {
                        setPersonTypeForSelect(val, name);
                        setFieldValue(val, name);
                    }}
                    footer={<Button>Save</Button>}
                    formRequest={(values) => create(values)}
                >
                    <Row>
                        <Col xs={4}>
                            <Field
                                defaultValue={get(agent,'data.branch')}
                                name={"branch"}
                                type={"select"}
                                label={"Branch"}
                                options={branches}
                                params={{ required: true }}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                name={"inn"}
                                defaultValue={get(agent,'data.inn')}
                                type={"input-mask"}
                                label={"INN"}
                                property={{ mask: "999999999", maskChar: "_", }}
                                params={{ pattern: /^[0-9]*$/ }}
                            />
                        </Col>

                        <Col xs={4}>
                            <Field
                                defaultValue={get(agent,'data.agreementnumber')}
                                name={"agreementnumber"}
                                type={"input"}
                                label={"agreementnumber"}
                                params={{ required: true }}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                defaultValue={get(agent,'data.agreementdate')}
                                name={"agreementdate"}
                                dateFormat={"MM/DD/YYYY"}
                                type={"datepicker"}
                                label={"agreementdate"}
                                params={{ required: true }}
                            />
                        </Col>

                        <Col xs={4}>
                            <Field
                                defaultValue={get(agent,'data.typeofagent')}
                                params={{ required: true }}
                                name={"typeofagent"}
                                type={"select"}
                                label={"Agent type"}
                                options={agentTypes}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                defaultValue={get(agent,'data.isbeneficiary')}
                                label={"isbeneficiary"}
                                type={"switch"}
                                name={"isbeneficiary"}
                                params={{ required: true }}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                defaultValue={get(agent,'data.isfixedpolicyholder')}
                                label={"isfixedpolicyholder"}
                                type={"switch"}
                                name={"isfixedpolicyholder"}
                                params={{ required: true }}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                name={"typeofpersons"}
                                type={"select"}
                                label={"Person type"}
                                defaultValue={get(agent,'data.person') ? PERSON_TYPE.person : PERSON_TYPE.organization}
                                options={[
                                    {
                                        value: PERSON_TYPE.person,
                                        label: t(PERSON_TYPE.person),
                                    },
                                    {
                                        value: PERSON_TYPE.organization,
                                        label: t(PERSON_TYPE.organization),
                                    },
                                ]}
                                params={{ required: true }}
                            />
                        </Col>
                        {isEqual(personType, PERSON_TYPE.person) && (
                            <>
                                <Col xs={4}>
                                    <Field name={"person.photo"} type={"input"} label={"Photo"} />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.name')}
                                        name={"person.name"}
                                        type={"input"}
                                        label={"name"}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.secondname')}
                                        name={"person.secondname"}
                                        type={"input"}
                                        label={"secondname"}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        name={"person.middlename"}
                                        type={"input"}
                                        label={"middlename"}
                                        defaultValue={get(agent,'data.person.middlename')}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.gender')}
                                        name={"person.gender"}
                                        type={"select"}
                                        label={"Gender"}
                                        options={genders}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.dateofbirth')}
                                        name={"person.dateofbirth"}
                                        dateFormat={"MM/DD/YYYY"}
                                        type={"datepicker"}
                                        label={"dateofbirth"}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.citizenship')}
                                        name={"person.citizenship"}
                                        type={"select"}
                                        options={citizenshipList}
                                        label={"Citizenship"}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.typeofdocument')}
                                        name={"person.typeofdocument"}
                                        type={"select"}
                                        options={documentTypeList}
                                        label={"typeofdocument"}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.passportSeries')}
                                        name={"person.passportSeries"}
                                        type={"input-mask"}
                                        label={"Passport seria"}
                                        property={{ mask: "aa", maskChar: "_" }}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.passportNumber')}
                                        name={"person.passportNumber"}
                                        type={"input-mask"}
                                        label={"Passport number"}
                                        property={{ mask: "9999999", maskChar: "_" }}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.pin')}
                                        name={"person.pin"}
                                        type={"input-mask"}
                                        label={"PINFL"}
                                        property={{ mask: "99999999999999", maskChar: "_" }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.passportissuancedate')}
                                        name={"person.passportissuancedate"}
                                        dateFormat={"MM/DD/YYYY"}
                                        type={"datepicker"}
                                        label={"passportissuancedate"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.passportissuedby')}
                                        name={"person.passportissuedby"}
                                        type={"input"}
                                        label={"passportissuedby"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.region')}
                                        name={"person.region"}
                                        type={"select"}
                                        label={"Region"}
                                        options={regions}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.district')}
                                        name={"person.district"}
                                        type={"select"}
                                        label={"District"}
                                        options={districts}
                                        params={{ required: true }}
                                    />
                                </Col>

                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.address')}
                                        name={"person.address"}
                                        type={"input"}
                                        label={"address"}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.postcode')}
                                        name={"person.postcode"}
                                        type={"input"}
                                        label={"postcode"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.telephonenumber')}
                                        name={"person.telephonenumber"}
                                        type={"input"}
                                        label={"telephonenumber"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.emailforcontact')}
                                        name={"person.emailforcontact"}
                                        type={"input"}
                                        label={"emailforcontact"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.personalaccount')}
                                        name={"person.personalaccount"}
                                        type={"input"}
                                        label={"personalaccount"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.transitaccount')}
                                        name={"person.transitaccount"}
                                        type={"input"}
                                        label={"transitaccount"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field    defaultValue={get(agent,'data.person.mfo')} name={"person.mfo"} type={"input"} label={"mfo"} />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.nameofbank')}
                                        name={"person.nameofbank"}
                                        type={"input"}
                                        label={"nameofbank"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.person.numberofcard')}
                                        name={"person.numberofcard"}
                                        type={"input"}
                                        label={"numberofcard"}
                                    />
                                </Col>
                            </>
                        )}
                        {isEqual(personType, PERSON_TYPE.organization) && (
                            <>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.nameoforganization')}
                                        name={"organization.nameoforganization"}
                                        type={"input"}
                                        label={"nameoforganization"}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.oked')}
                                        name={"organization.oked"}
                                        type={"input"}
                                        label={"oked"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.mfo')}
                                        name={"organization.mfo"}
                                        type={"input"}
                                        label={"mfo"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.nameofbank')}
                                        name={"organization.nameofbank"}
                                        type={"input"}
                                        label={"nameofbank"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.innofbank')}
                                        name={"organization.innofbank"}
                                        type={"input"}
                                        label={"innofbank"}
                                    />
                                </Col>

                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.scheduledaccount')}
                                        name={"organization.scheduledaccount"}
                                        type={"input"}
                                        label={"scheduledaccount"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.region')}
                                        name={"organization.region"}
                                        type={"select"}
                                        label={"Region"}
                                        options={regions}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.district')}
                                        name={"organization.district"}
                                        type={"select"}
                                        label={"District"}
                                        options={districts}
                                        params={{ required: true }}
                                    />
                                </Col>

                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.address')}
                                        name={"organization.address"}
                                        type={"input"}
                                        label={"address"}
                                        params={{ required: true }}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.postcode')}
                                        name={"organization.postcode"}
                                        type={"input"}
                                        label={"postcode"}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.checkingaccount')}
                                        name={"organization.checkingaccount"}
                                        type={"input"}
                                        label={"checkingaccount"}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Field
                                        defaultValue={get(agent,'data.organization.employees')}
                                        isMulti
                                        name={"organization.employees"}
                                        type={"select"}
                                        options={employeeList}
                                        label={"Employees"}
                                        params={{ required: true }}
                                    />
                                </Col>
                            </>
                        )}
                        <Col xs={4}>
                            <Field
                                defaultValue={get(agent,'data.isUsedourpanel')}
                                label={"isUsedourpanel"}
                                type={"switch"}
                                name={"isUsedourpanel"}
                                params={{ required: true }}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                defaultValue={get(agent,'data.isUserRestAPI')}
                                label={"isUserRestAPI"}
                                type={"switch"}
                                name={"isUserRestAPI"}
                                params={{ required: true }}
                            />
                        </Col>
                    </Row>

                    <Row className={"mb-15"}>
                        <Col xs={12}>
                            <Title>Тарифы</Title>
                        </Col>
                    </Row>

                    <Row className={"mb-25"}>
                        <Col xs={12}>
                            <Row align={"flex-end"}>
                                <Col xs={3}>
                                    <Field
                                        label={t('Выберите категорию')}
                                        options={groups}
                                        type={'select'}
                                        name={'group'}
                                        property={{onChange: (val) => setProductGroupId(val)}}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        label={t('Выберите подкатегорию')}
                                        options={subGroups}
                                        type={'select'}
                                        name={'subGroup'}
                                        property={{onChange: (val) => setProductSubGroupId(val)}}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        label={"Продукты"}
                                        type={"select"}
                                        name={"tariff[0].product"}
                                        options={products}
                                        defaultValue={get(product, "tariff[0].product")}
                                        params={{
                                            required: get(product, "riskData", []).length > 0,
                                        }}
                                        property={{onChange: (val) => setProductId(val)}}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        label={"Разрешить заключение договоров"}
                                        type={"switch"}
                                        name={"tariff[0].allowAgreement"}
                                        defaultValue={get(find(get(productsList, `data.data`, []),(_item)=>isEqual(get(_item,'_id'),productId)),'tariff.allowAgreement',false)}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        label={"Лимит ответственности"}
                                        type={"number-format-input"}
                                        name={"tariff[0].limitOfAgreement"}
                                        defaultValue={get(find(get(productsList, `data.data`, []),(_item)=>isEqual(get(_item,'_id'),productId)),'tariff.limitOfAgreement',0)}
                                        property={{ placeholder: "Введите значение" }}
                                    />
                                </Col>
                                <Col xs={3} className={"text-right"}>
                                    <Button
                                        onClick={addTariff}
                                        type={"button"}
                                        className={"mb-25"}
                                    >
                                        Применить
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        {get(agent, "data.tariff", []).length > 0 && (
                            <Col xs={12} className={"mb-25"}>
                                <hr />
                                <Table
                                    hideThead={false}
                                    thead={[
                                        "Класс",
                                        "минимальную и  ставку по классу ",
                                        "максимальную ставку по классу",
                                    ]}
                                >
                                    {get(agent, "data.tariff", []).map((item, i) => (
                                        <tr key={i + 1}>
                                            <td>
                                                <Field
                                                    name={`tariff[0].tariffPerClass[${i}].class`}
                                                    type={"select"}
                                                    property={{
                                                        hideLabel: true,
                                                        bgColor: get(
                                                            findItem(
                                                                get(classes, "data.data"),
                                                                get(item, "_id")
                                                            ),
                                                            "color"
                                                        ),
                                                    }}
                                                    options={classOptions}
                                                    defaultValue={get(
                                                        findItem(
                                                            get(classes, "data.data"),
                                                            get(item, "classeId")
                                                        ),
                                                        "_id"
                                                    )}
                                                    isDisabled={true}
                                                />
                                            </td>
                                            <td>
                                                <Flex justify={"center"}>
                                                    <Field
                                                        name={`tariff[0].tariffPerClass[${i}].min`}
                                                        type={"number-format-input"}
                                                        property={{
                                                            hideLabel: true,
                                                            placeholder: "Мин",
                                                            suffix: " %",
                                                        }}
                                                        defaultValue={get(
                                                            product,
                                                            `tariff[0].tariffPerClass[${i}].min`,
                                                            0
                                                        )}
                                                    />
                                                </Flex>
                                            </td>
                                            <td>
                                                <Flex justify={"flex-end"}>
                                                    <Field
                                                        name={`tariff[0].tariffPerClass[${i}].max`}
                                                        type={"number-format-input"}
                                                        property={{
                                                            hideLabel: true,
                                                            placeholder: "Макс",
                                                            suffix: " %",
                                                        }}
                                                        defaultValue={get(
                                                            product,
                                                            `tariff[0].tariffPerClass[${i}].max`,
                                                            0
                                                        )}
                                                    />
                                                </Flex>
                                            </td>
                                        </tr>
                                    ))}
                                </Table>
                            </Col>
                        )}
                        {tariffList.length > 0 && (
                            <Col xs={12} className={"horizontal-scroll"}>
                                <hr />
                                <Table
                                    hideThead={false}
                                    thead={[
                                        "Продукт",
                                        "Разрешить заключение договоров",
                                        "Лимит ответственности",
                                        "Class",
                                        "Max",
                                        "Min",
                                        "Delete",
                                    ]}
                                >
                                    {tariffList.map((item, i) => (
                                        <tr key={i + 1}>
                                            <td>
                                                <Field
                                                    className={"minWidth300"}
                                                    options={products}
                                                    type={"select"}
                                                    name={`tariff[${i + 1}].product`}
                                                    defaultValue={get(item, "tariff[0].product")}
                                                    property={{ hideLabel: true }}
                                                    isDisabled={true}
                                                />
                                            </td>

                                            <td className={"text-center"}>
                                                <Field
                                                    property={{ hideLabel: true }}
                                                    type={"switch"}
                                                    name={`tariff[${i + 1}].allowAgreement`}
                                                    defaultValue={get(
                                                        item,
                                                        "tariff[0].allowAgreement",
                                                        false
                                                    )}
                                                    disabled={true}
                                                />
                                            </td>
                                            <td>
                                                <Field
                                                    type={"number-format-input"}
                                                    name={`tariff[${i + 1}].limitOfAgreement`}
                                                    defaultValue={get(
                                                        item,
                                                        "tariff[0].limitOfAgreement",
                                                        0
                                                    )}
                                                    property={{
                                                        disabled: true,
                                                        placeholder: "Введите значение",
                                                        hideLabel: true,
                                                    }}
                                                />
                                            </td>
                                            <td colSpan={3}>
                                                {get(item, `tariff[0].tariffPerClass`, []).map(
                                                    (c, j) => (
                                                        <Flex>
                                                            <Field
                                                                key={j}
                                                                className={"mb-15 mr-16 flex-none"}
                                                                name={`tariff[${
                                                                    i + 1
                                                                }].tariffPerClass[${j}].class`}
                                                                type={"select"}
                                                                property={{
                                                                    hideLabel: true,
                                                                    bgColor: get(
                                                                        findItem(
                                                                            get(classes, "data.data"),
                                                                            get(c, "_id")
                                                                        ),
                                                                        "color"
                                                                    ),
                                                                }}
                                                                options={classOptions}
                                                                defaultValue={get(
                                                                    findItem(
                                                                        get(classes, "data.data"),
                                                                        get(c, "class")
                                                                    ),
                                                                    "_id"
                                                                )}
                                                                isDisabled={true}
                                                            />
                                                            <Field
                                                                key={j}
                                                                className={"mb-15 mr-16 ml-15"}
                                                                type={"number-format-input"}
                                                                name={`tariff[${
                                                                    i + 1
                                                                }].tariffPerClass[${j}].max`}
                                                                defaultValue={get(c, "max", 0)}
                                                                property={{
                                                                    disabled: true,
                                                                    placeholder: "Введите значение",
                                                                    hideLabel: true,
                                                                }}
                                                            />
                                                            <Field
                                                                key={j}
                                                                className={"mb-15"}
                                                                type={"number-format-input"}
                                                                name={`tariff[${
                                                                    i + 1
                                                                }].tariffPerClass[${j}].min`}
                                                                defaultValue={get(c, "min", 0)}
                                                                property={{
                                                                    disabled: true,
                                                                    placeholder: "Введите значение",
                                                                    hideLabel: true,
                                                                }}
                                                            />
                                                        </Flex>
                                                    )
                                                )}
                                            </td>
                                            <td
                                                className={"cursor-pointer"}
                                                onClick={() => removeTariffFromList(i)}
                                            >
                                                <Trash2 color={"#dc2626"} />
                                            </td>
                                        </tr>
                                    ))}
                                </Table>
                            </Col>
                        )}
                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default AgentsUpdateContainer;
