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

const DistributionContainer = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [filter, setFilter] = useState({branch:null,status:null,fromDate:dayjs().subtract(1, 'year').format("YYYY-MM-DD"),toDate:dayjs().format("YYYY-MM-DD")})
    const [params, setParams] = useState({
        branchId: null
    })
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [idList, setIdList] = useState([])
    let {data: transactions, isLoading} = useGetAllQuery({
        key: KEYS.transactions, url: `${URLS.transactions}/list`, params: {
            params: {
                limit: 25,
                page: 1,
                branch: get(filter, 'branch'),
                status: get(filter, 'status'),
                fromDate: get(filter, 'fromDate'),
                toDate: get(filter, 'toDate'),
            }
        },
        // enabled: !!(fromDate && toDate)
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
                    branch: get(params, 'branchId'),
                }
            })
            navigate(`/accounting/policy`)
        }
    }
    if (isLoading || isLoadingBranches) {
        return <OverlayLoader/>
    }
    console.log("filter", filter)

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
                        <Button type={'button'} onClick={() => create(true)} className={'mr-16'}>Распределить</Button>
                        <Form getValueFromField={(value, name) => {
                            if (includes(['branchId'], name)) {
                                setParams(prev => ({...prev, [name]: value}))
                            }
                        }}>
                            <Field className={'minWidth300'} name={'branchId'} property={{
                                placeholder: 'Филиалы',
                                hideLabel: true,
                            }} type={'select'} options={branches}/>
                        </Form>
                    </Flex>
                </Col>
                <Col xs={12} className={'mt-30'}>
                    <Form formRequest={({data})=>setFilter({...data})}>
                        <Row>
                            <Col xs={3}>
                                <Field
                                    defaultValue={get(filter, 'branch')}
                                    name={'branch'} property={{
                                    placeholder: 'Filter by branch',
                                    hideLabel: true,
                                }}
                                    type={'select'}
                                    options={branches}
                                />
                            </Col>
                            <Col xs={3}>
                                <Field
                                    defaultValue={get(filter, 'status')}
                                    name={'status'} property={{
                                    placeholder: 'Filter by status',
                                    hideLabel: true,
                                }} type={'select'}
                                    options={[{value: 'Новый', label: 'Новый'}, {value: 'Готов', label: 'Готов'}]}/>
                            </Col>
                            <Col xs={6}>
                                <Flex>
                                <Field
                                    className={'mr-16'}
                                    defaultValue={get(filter,'fromDate')}
                                       type={'datepicker'}
                                       name={'fromDate'} property={{
                                    hideLabel: true,
                                }}
                                />
                                <Field  defaultValue={get(filter,'toDate')}  className={'mr-16'} property={{
                                    hideLabel: true,
                                }} type={'datepicker'} name={'toDate'} label={t("End date")}
                                />
                                <Button>{t("Search")}</Button>
                                </Flex>
                            </Col>
                        </Row>
                    </Form>
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
                        }}/>, '№', 'Статус прикрепления', 'Филиал', 'Дата п/п', 'Наименоменование отправителя', 'Сумма поступления', 'Снято на договор', 'Available sum', 'Детали платежа', 'ИНН отправителя', 'ИНН банка отправителя', 'МФО отправителя', 'Р/С отправителя', 'ИНН банка получателя', 'МФО банка получателя', 'Р/С получателя', 'Дата ввода']}>{get(transactions, 'data.data', []).map((item, i) =>
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
                                <td>{get(item, 'branch.branchName')}</td>
                                <td>{dayjs(get(item, 'payment_order_date')).format("DD.MM.YYYY")}</td>
                                <td>{get(item, 'sender_name')}</td>
                                <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                  value={get(item, 'payment_amount', 0)}/></td>
                                <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                  value={get(item, 'attached_sum', 0)}/></td>
                                <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                  value={get(item, 'available_sum', 0)}/></td>
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