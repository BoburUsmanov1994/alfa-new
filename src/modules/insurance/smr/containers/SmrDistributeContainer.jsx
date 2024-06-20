import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../../store";
import {get, isEqual, find, isEmpty, isNil, includes} from "lodash";
import {useTranslation} from "react-i18next";
import Section from "../../../../components/section";
import {Col, Row} from "react-grid-system";
import Title from "../../../../components/ui/title";
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {useNavigate} from "react-router-dom";
import {OverlayLoader} from "../../../../components/loader";
import Table from "../../../../components/table";
import Checkbox from "rc-checkbox";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {getSelectOptionsListFromData} from "../../../../utils";
import Flex from "../../../../components/flex";
import Button from "../../../../components/ui/button";
import Form from "../../../../containers/form/form";
import Field from "../../../../containers/form/field";

const SmrDistributeContainer = ({
                           id = null
                       }) => {
    const navigate = useNavigate();

    const {t} = useTranslation()
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [params, setParams] = useState({
        branchId: null
    })
    const [idList, setIdList] = useState([])

    const user = useStore(state => get(state, 'user'))

    let {data: transactions, isLoading: _isLoading} = useGetAllQuery({
        key: KEYS.smrList, url: `${URLS.smrList}`, params: {
            params: {
                branch: get(user, 'branch._id'),
                limit: 100
            }
        }
    })

    let {data: branches, isLoading: isLoadingBranches} = useGetAllQuery({
        key: KEYS.branches, url: `${URLS.branches}/list`, params: {
            params: {
                limit: 100
            }
        }
    })
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')

    const {
        mutate: distributeRequest,
        isLoading: isLoadingTransactionLog
    } = usePostQuery({listKeyId: KEYS.smrList})

    const create = (attach = true) => {
        if (isEmpty(idList)) {
            toast.warn("Please select smr")
        } else if (isNil(get(params, 'branchId'))) {
            toast.warn("Please select branch")
        } else {
            distributeRequest({
                url: URLS.smrDistribute,
                attributes: {
                    attach: attach,
                    smrs: idList,
                    branch: get(params, 'branchId')
                }
            })
            navigate(`/insurance/smr`)
        }
    }

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('СМР'),
            path: '/insurance/smr',
        },
        {
            id: 2,
            title: t('К полису'),
            path: '#',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


    if (_isLoading || isLoadingBranches) {
        return <OverlayLoader/>
    }


    return (
        <Section>
            {isLoadingTransactionLog && <OverlayLoader/>}
            <Row className={'mb-15'} align={'center'}>
                <Col xs={12}>
                    <Title>СМР Распределение</Title>
                </Col>
            </Row>
            <Row className={'mb-20'}>
                <Col xs={12}>
                    <Flex justify={'flex-end'}>
                        <Button onClick={() => create(false)} type={'button'} className={'mr-16'}
                                danger> Открепить</Button>
                        <Button type={'button'} onClick={()=>create(true)} className={'mr-16'}>Распределить</Button>
                        <Form getValueFromField={(value, name) => {
                            if (includes(['branchId'], name)) {
                                setParams(prev => ({...prev, [name]: value}))
                            }
                        }}>
                            <Field name={'branchId'} property={{
                                placeholder: 'Филиалы',
                                hideLabel: true,
                            }} type={'select'} options={branches}/>
                        </Form>
                    </Flex>
                </Col>
            </Row>
            <Row className={'mb-20'}>
                <Col xs={12} className={'horizontal-scroll'}>
                    {
                        <Table bordered hideThead={false}
                               thead={[<Checkbox onChange={(e) => {
                                   if (e.target?.checked) {
                                       setIdList(get(transactions, 'data.docs', []).map(({_id}) => _id))
                                   } else {
                                       setIdList([])
                                   }
                               }}/>, '№', 'Наименование', 'Филиал', 'Номер договора', 'Серия полиса', 'Номер полиса', 'Insurance sum','Insurance premium','Снято на договор', 'Created at', 'Status']}>{get(transactions, 'data.docs', []).map((item, i) =>
                            <tr key={get(item, '_id')}>
                                <td><Checkbox checked={includes(idList, get(item, '_id'))} onChange={(e) => {
                                    if (e.target?.checked) {
                                        setIdList(prev => ([...prev, get(item, '_id')]))
                                    } else {
                                        setIdList(idList.filter(id => !isEqual(id, get(item, '_id'))))
                                    }
                                }}/></td>
                                <td>{i + 1}</td>
                                <td>{get(item, 'insurant.name')}</td>
                                <td>{get(item, 'branch.branchname')}</td>
                                <td>{get(item, 'contract_id')}</td>
                                <td>{get(item, 'policy.seria')}</td>
                                <td>{get(item, 'policy.number')}</td>
                                <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                  value={get(item, 'policy.ins_sum', 0)}/></td>
                                <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                  value={get(item, 'policy.ins_premium', 0)}/></td>
                                <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                  value={get(item, 'attachedSum', 0)}/></td>
                                <td>{dayjs(get(item, 'createdAt')).format("DD.MM.YYYY")}</td>
                                <td>{get(item, 'attachStatus')}</td>
                                {/*<td>*/}
                                {/*    <Eye onClick={() => navigate(`/insurance/smr/view/${get(item,'contract_id')}`)}*/}
                                {/*         className={'cursor-pointer mr-10'} size={20} color={'#78716c'}/>*/}
                                {/*</td>*/}
                            </tr>)}</Table>}
                </Col>
            </Row>


        </Section>
    );
};

export default SmrDistributeContainer;