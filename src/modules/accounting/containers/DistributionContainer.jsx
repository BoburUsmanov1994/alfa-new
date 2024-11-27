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
import {useDeleteQuery, useGetAllQuery, usePostQuery} from "../../../hooks/api";
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
import Pagination from "../../../components/pagination";
import {FileText, Filter, Trash, Trash2} from "react-feather";
import Swal from "sweetalert2";
import config from "../../../config";

const DistributionContainer = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState({})
    const [params, setParams] = useState({
        branchId: null
    })
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const user = useStore(state => get(state, 'user'))
    const [idList, setIdList] = useState([])
    let {data: transactions, isLoading,refetch} = useGetAllQuery({
        key: [KEYS.transactions, filter], url: `${URLS.transactions}/list`, params: {
            params: {
                limit: 50,
                page,
                ...filter
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
    } = usePostQuery({listKeyId: [KEYS.transactions, filter]})
    const {
        mutate: deleteRequest
    } = useDeleteQuery({listKeyId:  [KEYS.transactions, filter]})
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
            toast.warn(t("Please select transaction"))
        } else if (isNil(get(params, 'branchId'))) {
            toast.warn(t("Please select branch"))
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
    const remove = (id) => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            backdrop: 'rgba(0,0,0,0.9)',
            background: 'none',
            title: t('Are you sure?'),
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#13D6D1',
            confirmButtonText: t('Delete'),
            cancelButtonText: t('Cancel'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest({url: `api/transaction/${id}`},{onSuccess:()=>{
                        refetch()
                    }})
            }
        });
    }
    if (isLoading || isLoadingBranches) {
        return <OverlayLoader/>
    }


    return (
        <Section>
            {isLoadingTransactionLog && <ContentLoader/>}
            <Row className={'mb-15'} align={'center'}>
                <Col xs={12}>
                    <Title>{t("Распределение")}</Title>
                </Col>
            </Row>
            <Row className={'mb-20'}>
                <Col xs={12}>
                    <Flex justify={'flex-end'}>
                        <Button onClick={() => create(false)} type={'button'} className={'mr-16'}
                                danger> {t("Открепить")}</Button>
                        <Button type={'button'} onClick={() => create(true)} className={'mr-16'}>{t("Распределить")}</Button>
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
                    <Form formRequest={({data}) => setFilter({...data})}>
                        <Row align={'end'} gutterWidth={16}>
                            <Col xs={1.25}>
                                <Field
                                    className={'mb-10'}
                                    sm
                                    label={'Branch'}
                                    defaultValue={get(filter, 'branch')}
                                    name={'branch'} property={{
                                    placeholder: t("Filter by branch"),
                                }}
                                    type={'select'}
                                    options={branches}
                                />
                                <Field
                                    sm
                                    label={'Status'}
                                    defaultValue={get(filter, 'status_of_attachment')}
                                    name={'status_of_attachment'} property={{
                                    placeholder: t("Filter by status"),
                                }} type={'select'}
                                    options={[{value: 'Новый', label: 'Новый'}, {value: 'Готов', label: 'Готов'}]}/>

                            </Col>
                            <Col xs={1}>
                                <Field
                                    className={'mb-10'}
                                    label={t("Start date")}
                                    sm
                                    defaultValue={get(filter, 'fromDate')}
                                    type={'datepicker'}
                                    name={'fromDate'}
                                />
                                <Field sm defaultValue={get(filter, 'toDate')} type={'datepicker'} name={'toDate'}
                                       label={t("End date")}
                                />
                            </Col>
                            <Col xs={1.25}>
                                <Field className={'mb-10'} sm defaultValue={get(filter, 'sender_name')} type={'input'}
                                       name={'sender_name'}
                                       label={t("Sender name")}
                                />
                                <Field sm defaultValue={get(filter, 'payment_details')} type={'input'}
                                       name={'payment_details'}
                                       label={t("Детали платежа")}
                                />
                            </Col>
                            <Col xs={1.25}>
                                <Field className={'mb-10'} sm defaultValue={get(filter, 'payment_amount_from')}
                                       type={'number-format-input-filter'} name={'payment_amount_from'}
                                       label={t("Payment from")}
                                />
                                <Field sm defaultValue={get(filter, 'payment_amount_to')}
                                       type={'number-format-input-filter'} name={'payment_amount_to'}
                                       label={t("Payment to")}
                                />
                            </Col>
                            <Col xs={1.25}>
                                <Field className={'mb-10'} sm defaultValue={get(filter, 'attached_sum_from')}
                                       type={'number-format-input-filter'} name={'attached_sum_from'}
                                       label={t("Attached from")}
                                />
                                <Field sm defaultValue={get(filter, 'attached_sum_to')}
                                       type={'number-format-input-filter'} name={'attached_sum_to'}
                                       label={t("Attached to")}
                                />
                            </Col>
                            <Col xs={1.25}>
                                <Field className={'mb-10'} sm defaultValue={get(filter, 'attached_sum_from')}
                                       type={'number-format-input-filter'} name={'attached_sum_from'}
                                       label={t("Available from")}
                                />
                                <Field sm defaultValue={get(filter, 'available_sum_from')}
                                       type={'number-format-input-filter'} name={'available_sum_to'}
                                       label={t("Available to")}
                                />
                            </Col>

                            <Col xs={1.25}>
                                <Field className={'mb-10'} sm defaultValue={get(filter, 'sender_taxpayer_number')}
                                       type={'input'} name={'sender_taxpayer_number'}
                                       label={t("ИНН отправителя")}
                                />
                                <Field className={'mb-10'} sm defaultValue={get(filter, 'sender_bank_taxpayer_number')}
                                       type={'input'} name={'sender_bank_taxpayer_number'}
                                       label={t("ИНН банка отправителя")}
                                />
                                <Field className={'mb-10'} sm defaultValue={get(filter, 'sender_bank_code')}
                                       type={'input'} name={'sender_bank_code'}
                                       label={t("МФО отправителя")}
                                />
                                <Field sm defaultValue={get(filter, 'sender_bank_account')} type={'input'}
                                       name={'sender_bank_account'}
                                       label={t("Р/С отправителя")}
                                />
                            </Col>
                            <Col xs={1.25}>
                                <Field className={'mb-10'} sm
                                       defaultValue={get(filter, 'recipient_bank_taxpayer_number')} type={'input'}
                                       name={'recipient_bank_taxpayer_number'}
                                       label={t("ИНН банка получателя")}
                                />
                                <Field className={'mb-10'} sm defaultValue={get(filter, 'recipient_bank_code')}
                                       type={'input'} name={'recipient_bank_code'}
                                       label={t("МФО банка получателя")}
                                />
                                <Field sm defaultValue={get(filter, 'recipient_bank_account')} type={'input'}
                                       name={'recipient_bank_account'}
                                       label={t("Р/С получателя")}
                                />
                            </Col>
                            <Col xs={1.25}>
                                <Field
                                    className={'mb-10'}
                                    label={t("Created from")}
                                    sm
                                    defaultValue={get(filter, 'createdAtFrom')}
                                    type={'datepicker'}
                                    name={'createdAtFrom'}
                                />
                                <Field sm defaultValue={get(filter, 'createdAtTo')} type={'datepicker'}
                                       name={'createdAtTo'}
                                       label={t("Created to")}
                                />
                            </Col>
                            <Col xs={1}>
                                <div>
                                    <Button xs htmlType={'submit'}><Flex justify={'center'}><Filter size={14}/><span
                                        style={{marginLeft: '5px'}}>{t("Применить")}</span></Flex></Button>
                                    <Button className={'mt-15'} xs onClick={() => {
                                        setFilter({})
                                        navigate(0)
                                    }} danger type={'reset'}><Flex justify={'center'}><Trash
                                        size={14}/><span
                                        style={{marginLeft: '5px'}}>{t("Очистить")}</span></Flex></Button>

                                </div>
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
                        }}/>, '№', 'Статус прикрепления', 'Филиал', 'Дата п/п', 'Наименоменование отправителя', 'Сумма поступления', 'Снято на договор', 'Available sum', 'Детали платежа', 'ИНН отправителя', 'ИНН банка отправителя', 'МФО отправителя', 'Р/С отправителя', 'ИНН банка получателя', 'МФО банка получателя', 'Р/С получателя', 'Дата ввода','Action']}>{get(transactions, 'data.data', []).map((item, i) =>
                            <tr key={get(item, '_id')}>
                                <td><Checkbox checked={includes(idList, get(item, '_id'))} onChange={(e) => {
                                    if (e.target?.checked) {
                                        setIdList(prev => ([...prev, get(item, '_id')]))
                                    } else {
                                        setIdList(idList.filter(id => !isEqual(id, get(item, '_id'))))
                                    }
                                }}/></td>
                                <td>{i + 1 + (page - 1) * 50}</td>
                                <td>{get(item, 'status_of_attachment')}</td>
                                <td>{get(item, 'branch.branchName')}</td>
                                <td>{get(item, 'payment_order_date')}</td>
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
                                <td>{dayjs(get(item, 'createdAt')).format("DD.MM.YYYY")}</td>
                                <td>{includes([config.ROLES.admin],get(user,'role.name')) && <Trash2 onClick={() => remove(get(item, '_id', null))}
                                        className={'mx-auto cursor-pointer '} color={'#dc2626'}/>}</td>
                            </tr>)}</Table>}
                </Col>
                <Pagination limit={50} page={page} setPage={setPage} totalItems={get(transactions, `data.count`, 0)}/>
            </Row>

        </Section>
    );
};

export default DistributionContainer;