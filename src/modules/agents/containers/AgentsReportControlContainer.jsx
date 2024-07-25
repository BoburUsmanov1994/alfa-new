import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get, isEmpty} from "lodash";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import Section from "../../../components/section";
import {useTranslation} from "react-i18next";
import {getSelectOptionsListFromData} from "../../../utils";
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import EmptyPage from "../../auth/pages/EmptyPage";
import Table from "../../../components/table";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";

const AgentsReportControlContainer = () => {
    const {t} = useTranslation()
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const user = useStore(state => get(state, 'user'))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Агенты',
            path: '/agents',
        },
        {
            id: 2,
            title: 'Управления актами выполненных работ',
            path: '/agents/report-control',
        }
    ], [])

    let {data: agentActList} = useGetAllQuery({key: KEYS.agentActList, url: URLS.agentActList})


    const {mutate: actPostRequest, isLoading: isLoadingActPost} = usePostQuery({listKeyId: KEYS.policyByAgent})

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    return (
        <Section>
            <Row className={''} align={'center'}>
                <Col xs={12} className={'mb-15'}>
                    <Title>{t('Управления актами выполненных работ')}</Title>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    {isEmpty(get(agentActList, 'data.data', [])) ? <EmptyPage/> : <Table hideThead={false}
                                                                                         thead={['Выбрать', '№', '№ акта', 'Дата акта', 'Агент', 'Сумма', 'Статус', 'Действие удалить']}>{get(agentActList, 'data.data', []).map((item, i) =>
                        <tr key={get(item, '_id')}>
                            <td></td>
                            <td>{i + 1}</td>
                            <td>{get(item, 'actNumber')}</td>
                            <td>{dayjs(get(item, 'actDate')).format('DD.MM.YYYY')}</td>
                            <td>{get(item, 'sender_name')}</td>
                            <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                              value={get(item, 'payment_amount', 0)}/></td>
                            <td>{get(item, 'payment_details')}</td>
                            <td>{get(item, 'sender_taxpayer_number')}</td>
                            <td>{get(item, 'recipient_bank_taxpayer_number')}</td>
                            <td>{get(item, 'recipient_bank_code')}</td>
                            <td>{get(item, 'recipient_bank_account')}</td>
                        </tr>)}</Table>}
                </Col>
            </Row>
        </Section>
    );
};

export default AgentsReportControlContainer;