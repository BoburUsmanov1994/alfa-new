import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get, includes, isEmpty, isEqual} from "lodash";
import {useGetAllQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {OverlayLoader} from "../../../components/loader";
import {Col, Row} from "react-grid-system";
import EmptyPage from "../../auth/pages/EmptyPage";
import Table from "../../../components/table";
import Checkbox from "rc-checkbox";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";
import Title from "../../../components/ui/title";
import Section from "../../../components/section";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import {Trash} from "react-feather";

const BCOJournalContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [idList, setIdList] = useState([])
    const navigate = useNavigate();
    let {data: acts, isLoading: actsIsLoading} = useGetAllQuery({key: KEYS.bco, url: URLS.bco})
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Справочники',
            path: '/handbook',
        },
        {
            id: 2,
            title: 'Журнал БСО',
            path: '/handbook/bco-journal',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    if (actsIsLoading) {
        return <OverlayLoader/>
    }
    return (
        <>
            <Section>
                <Row className={'mb-20'} align={'center'}>
                    <Col xs={12}>
                        <Title>Журнал БСО</Title>
                    </Col>
                </Row>
                <Row className={'mb-25'}>
                    <Col xs={12} className={'horizontal-scroll'}>
                        {isEmpty(get(acts, 'data.data', [])) ? <EmptyPage/> :
                            <Table bordered hideThead={false} thead={[<Checkbox onChange={(e) => {
                                if (e.target?.checked) {
                                    setIdList(get(acts, 'data.data', []).map(({_id}) => _id))
                                } else {
                                    setIdList([])
                                }
                            }}/>, '№', 'Филиал', 'Номер бланка', 'Номер полиса', 'Дата выдачи', 'Страховой продукт', 'Страхователь', 'Страховая премия','Action']}>{get(acts, 'data.data', []).map((item, i) =>
                                <tr key={get(item, '_id')}>
                                    <td><Checkbox checked={includes(idList, get(item, '_id'))} onChange={(e) => {
                                        if (e.target?.checked) {
                                            setIdList(prev => ([...prev, get(item, '_id')]))
                                        } else {
                                            setIdList(idList.filter(id => !isEqual(id, get(item, '_id'))))
                                        }
                                    }}/></td>
                                    <td>{i + 1}</td>
                                    <td>{get(item, 'branch_id.branchname')}</td>
                                    <td>{get(item, 'policy_qr_code')}</td>
                                    <td>{get(item, 'policy_number')}</td>
                                    <td>{dayjs(get(item, 'createdAt')).format('DD-MM-YYYY')}</td>
                                    <td>{get(item, 'policy_type_id.policy_type_name')}</td>
                                    <td>{get(item, 'employee_id.name')}</td>
                                    <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                      value={get(item, 'policyId', [])?.length}/></td>
                                    <td><Trash /></td>
                                </tr>)}</Table>}
                    </Col>
                </Row>
                <Row className={'mb-20'}>
                    <Col xs={12}>
                        <Button type={'button'} className={'mr-16'}
                                > Добавить на склад</Button>
                    </Col>
                </Row>
            </Section>
        </>
    );
};

export default BCOJournalContainer;