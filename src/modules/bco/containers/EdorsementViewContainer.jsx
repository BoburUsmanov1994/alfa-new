import React, {useEffect, useMemo, useState} from 'react';
import {Row, Col} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import {get} from "lodash";
import {useGetAllQuery, useGetOneQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {OverlayLoader} from "../../../components/loader";
import Table from "../../../components/table";
import {useStore} from "../../../store";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";

const EndorsementViewContainer = ({...rest}) => {
    const {t} = useTranslation();
    const {id} = useParams()
    let {data, isLoading, isError} = useGetOneQuery({
        id,
        key: [KEYS.endorsements, id],
        url: `${URLS.endorsements}/show`
    })

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Endorsement'),
            path: '/endorsement',
        },
        {
            id: 2,
            title: id,
            path: '#',
        }
    ], [data])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    if (isLoading) {
        return <OverlayLoader/>
    }

    return (
        <>
            <Section>
                <Row className={''}>
                    <Col xs={12}>
                        <Title>Endorsement view</Title>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("№ договора")}</td>
                                <td><strong>{get(data, "data.agreement.agreementNumber")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Дата договора")}</td>
                                <td><strong>{dayjs(get(data, "data.createdAt")).format("DD.MM.YYYY")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Причина")}</td>
                                <td><strong>{get(data, "data.reason")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Продукт")}</td>
                                <td><strong>{get(data, "data.product.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Страховая сумма")}</td>
                                <td><strong><NumberFormat displayType={'text'} thousandSeparator={' '}
                                                          value={get(data, "data.insuranceSum")}/></strong></td>
                            </tr>
                            <tr>
                                <td>{t("Страховая премия")}</td>
                                <td><strong><NumberFormat displayType={'text'} thousandSeparator={' '}
                                                          value={get(data, "data.insurancePremium")}/></strong></td>
                            </tr>
                        </Table>
                    </Col>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("Начало покрытия")}</td>
                                <td><strong>{dayjs(get(data, "data.startDate")).format("DD.MM.YYYY")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Конец покрытия")}</td>
                                <td><strong>{dayjs(get(data, "data.endDate")).format("DD.MM.YYYY")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Решение")}</td>
                                <td><strong>{get(data, "data.decision")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Дата решения")}</td>
                                <td><strong>{dayjs(get(data, "data.createdAt")).format("DD.MM.YYYY")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Кем принято решение")}</td>
                                <td><strong>{get(data, "data.request_creator.name")}</strong></td>
                            </tr>
                        </Table>
                    </Col>
                </Row>
            </Section>
        </>
    );
};

export default EndorsementViewContainer;