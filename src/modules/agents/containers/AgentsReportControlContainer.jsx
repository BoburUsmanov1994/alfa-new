import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get, includes, isEmpty, isEqual} from "lodash";
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
import {Trash2} from "react-feather";
import Checkbox from "rc-checkbox";
import Button from "../../../components/ui/button";
import {ContentLoader} from "../../../components/loader";

const AgentsReportControlContainer = () => {
    const {t} = useTranslation()
    const [idList, setIdList] = useState([])
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const user = useStore(state => get(state, 'user'))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Агенты"),
            path: '/agents',
        },
        {
            id: 2,
            title: t("Управления актами выполненных работ"),
            path: '/agents/report-control',
        }
    ], [])

    let {data: agentActList} = useGetAllQuery({key: KEYS.agentActList, url: URLS.agentActList})


    const {mutate: setPaidRequest, isLoading} = usePostQuery({listKeyId: KEYS.agentActList})

    const setPaid = () => {
        setPaidRequest({
            url: URLS.agentActStatus,
            attributes: {
                acts: idList,
                isPaid: true
            }
        }, {
            onSuccess: () => {
                setIdList([])
            }
        })
    }

    const remove = (_id) => {
        setPaidRequest({
            url: URLS.agentActStatus,
            attributes: {
                acts: [_id],
                isPaid: false
            }
        })
    }
    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    return (
        <Section>
            {isLoading && <ContentLoader/>}
            <Row className={''} align={'center'}>
                <Col xs={12} className={'mb-15'}>
                    <Title>{t('Управления актами выполненных работ')}</Title>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    {isEmpty(get(agentActList, 'data.data', [])) ? <EmptyPage/> : <Table hideThead={false}
                                                                                         thead={[<Checkbox
                                                                                             onChange={(e) => {
                                                                                                 if (e.target?.checked) {
                                                                                                     setIdList(get(agentActList, 'data.data', []).map(({_id}) => _id))
                                                                                                 } else {
                                                                                                     setIdList([])
                                                                                                 }
                                                                                             }}/>, '№', '№ акта', 'Дата акта', 'Агент', 'Сумма', 'Статус', 'Действие удалить']}>{get(agentActList, 'data.data', []).map((item, i) =>
                        <tr key={get(item, '_id')}>
                            <td><Checkbox checked={includes(idList, get(item, '_id'))} onChange={(e) => {
                                if (e.target?.checked) {
                                    setIdList(prev => ([...prev, get(item, '_id')]))
                                } else {
                                    setIdList(idList.filter(id => !isEqual(id, get(item, '_id'))))
                                }
                            }}/></td>
                            <td>{i + 1}</td>
                            <td>{get(item, 'actNumber')}</td>
                            <td>{dayjs(get(item, 'actDate')).format('DD.MM.YYYY')}</td>
                            <td> {get(item, 'agent.person.name') ? `${get(item, 'agent.person.secondname')} ${get(item, 'agent.person.name')} ${get(item, 'agent.person.middlename')}` : get(item, 'agent.organization.nameoforganization')}</td>
                            <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                              value={get(item, 'totalPremiumAmount', 0)}/></td>
                            <td>{get(item, 'status')}</td>
                            <td>
                                {get(item, 'status') === 'paid' &&
                                <Trash2 onClick={() => remove(get(item, '_id', null))}
                                        className={'ml-15 cursor-pointer'} color={'#dc2626'}/>}
                            </td>
                        </tr>)}</Table>}
                    <Button onClick={setPaid} className={"mt-30"}>{t("Установить")}</Button>
                </Col>
            </Row>
        </Section>
    );
};

export default AgentsReportControlContainer;