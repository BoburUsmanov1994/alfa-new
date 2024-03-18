import React,{useEffect, useMemo} from 'react';
import {Row, Col} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import {get} from "lodash";
import {useGetOneQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {OverlayLoader} from "../../../components/loader";
import Table from "../../../components/table";
import {useStore} from "../../../store";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import dayjs from "dayjs";

const BranchViewContainer = ({...rest}) => {
    const {t} = useTranslation();
    const {id} = useParams()
    let {data,isLoading,isError} = useGetOneQuery({id,key: KEYS.branches, url: URLS.branches})

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Branches'),
            path: '/branches',
        },
        {
            id: 2,
            title:  id,
            path: '#',
        }
    ], [data])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    if(isLoading){
        <OverlayLoader />
    }

    return (
        <>
            <Section>
                <Row className={''}>
                    <Col xs={12}>
                        <Title>Branch view</Title>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("Branch name")}</td>
                                <td><strong>{get(data,"data.data.branchname")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Region")}</td>
                                <td><strong>{get(data,"data.data.region.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("address")}</td>
                                <td><strong>{get(data,"data.data.address")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("agreementdate")}</td>
                                <td><strong>{dayjs(get(data,"data.data.agreementdate")).format("DD/MM/YYYY")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("agreementnumber")}</td>
                                <td><strong>{get(data,"data.data.agreementnumber")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("breanchstatus")}</td>
                                <td><strong>{get(data,"data.data.breanchstatus.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("checkingaccount")}</td>
                                <td><strong>{get(data,"data.data.checkingaccount")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("codeofbreanches")}</td>
                                <td><strong>{get(data,"data.data.codeofbreanches")}</strong></td>
                            </tr>

                        </Table>
                    </Col>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("email")}</td>
                                <td><strong>{get(data,"data.data.email")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("expirationdate")}</td>
                                <td><strong>{dayjs(get(data,"data.data.expirationdate")).format("DD/MM/YYYY")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Inn")}</td>
                                <td><strong>{get(data,"data.data.inn")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("MFO")}</td>
                                <td><strong>{get(data,"data.data.mfo")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Bank name")}</td>
                                <td><strong>{get(data,"data.data.nameofbank")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("shorttitleofbranch")}</td>
                                <td><strong>{get(data,"data.data.shorttitleofbranch")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("telephone")}</td>
                                <td><strong>{get(data,"data.data.telephone")}</strong></td>
                            </tr>

                        </Table>
                    </Col>
                </Row>

            </Section>
        </>
    );
};

export default BranchViewContainer;