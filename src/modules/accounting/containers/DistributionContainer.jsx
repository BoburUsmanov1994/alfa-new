import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {find, get, includes, isEmpty, isEqual, head, isNil} from "lodash";
import {useTranslation} from "react-i18next";
import Section from "../../../components/section";
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import Button from "../../../components/ui/button";
import Flex from "../../../components/flex";
import EmptyPage from "../../auth/pages/EmptyPage";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import Table from "../../../components/table";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";
import Checkbox from "rc-checkbox";
import Form from "../../../containers/form/form";
import Field from "../../../containers/form/field";
import {getSelectOptionsListFromData} from "../../../utils";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const DistributionContainer = ({
                                   ...rest
                               }) => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [params, setParams] = useState({
        branchId: null
    })
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [idList, setIdList] = useState([])
    let {data: transactions, isLoading} = useGetAllQuery({
        key: KEYS.transactions, url: `${URLS.transactions}/list`, params: {
            params: {
                limit: 1000
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
    } = usePostQuery({listKeyId: KEYS.transactions})

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Бухгалтерия'),
            path: '/accounting',
        },
        {
            id: 2,
            title: t('Распределение'),
            path: '#',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const create = (attach = true) => {
        if (isEmpty(idList)) {
            toast.warn("Please select transaction")
        } else if (isNil(get(params, 'branchId'))) {
            toast.warn("Please select branch")
        } else {
            distributeRequest({
                url: URLS.transactionDistribute,
                attributes: {
                    attach: attach,
                    transactions: idList,
                    branch: get(params, 'branchId')
                }
            })
            navigate(`/accounting/policy`)
        }
    }
    if (isLoading || isLoadingBranches) {
        return <OverlayLoader/>
    }

    return (
        <Section>
            {isLoadingTransactionLog && <ContentLoader/>}
            <Row className={'mb-15'} align={'center'}>
                <Col xs={12}>
                    <Title>Распределение</Title>
                </Col>
            </Row>
            <Row className={'mb-20'}>
                <Col xs={12}>
                    <Flex justify={'flex-end'}>
                        <Button onClick={() => create(false)} type={'button'} className={'mr-16'}
                                danger> Открепить</Button>
                        <Button type={'button'} onClick={create} className={'mr-16'}>Распределить</Button>
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
                    {isEmpty(get(transactions, 'data.data', [])) ? <EmptyPage/> :
                        <Table bordered hideThead={false} thead={[<Checkbox onChange={(e) => {
                            if (e.target?.checked) {
                                setIdList(get(transactions, 'data.data', []).map(({_id}) => _id))
                            } else {
                                setIdList([])
                            }
                        }}/>, '№', 'Статус прикрепления', 'Филиал', 'Дата п/п', 'Наименоменование отправителя', 'Сумма поступления', 'Снято на договор', 'Детали платежа', 'ИНН отправителя', 'ИНН банка отправителя', 'МФО отправителя', 'Р/С отправителя', 'ИНН банка получателя', 'МФО банка получателя', 'Р/С получателя', 'Дата ввода']}>{get(transactions, 'data.data', []).map((item, i) =>
                            <tr key={get(item, '_id')}>
                                <td><Checkbox checked={includes(idList, get(item, '_id'))} onChange={(e) => {
                                    if (e.target?.checked) {
                                        setIdList(prev => ([...prev, get(item, '_id')]))
                                    } else {
                                        setIdList(idList.filter(id => !isEqual(id, get(item, '_id'))))
                                    }
                                }}/></td>
                                <td>{i + 1}</td>
                                <td>{get(item, 'status_of_attachment')}</td>
                                <td>{get(item, 'branch.branchname')}</td>
                                <td>{dayjs(get(item, 'payment_order_date')).format("DD.MM.YYYY")}</td>
                                <td>{get(item, 'sender_name')}</td>
                                <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                  value={get(item, 'payment_amount', 0)}/></td>
                                <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                  value={get(item, 'attached_sum', 0)}/></td>
                                <td>{get(item, 'payment_details')}</td>
                                <td>{get(item, 'sender_taxpayer_number')}</td>
                                <td>{get(item, 'sender_bank_taxpayer_number')}</td>
                                <td>{get(item, 'sender_bank_code')}</td>
                                <td>{get(item, 'sender_bank_account')}</td>
                                <td>{get(item, 'recipient_bank_taxpayer_number')}</td>
                                <td>{get(item, 'recipient_bank_code')}</td>
                                <td>{get(item, 'recipient_bank_account')}</td>
                                <td>{dayjs(get(item, 'created_at')).format("DD.MM.YYYY")}</td>
                            </tr>)}</Table>}
                </Col>
            </Row>

        </Section>
    );
};

export default DistributionContainer;