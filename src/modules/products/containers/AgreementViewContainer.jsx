import React, {useEffect, useMemo, useState} from 'react';
import {Row, Col} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import {get, includes, isEmpty, isEqual, isNil} from "lodash";
import {useDeleteQuery, useGetAllQuery, useGetOneQuery, usePostQuery, usePutQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import Table from "../../../components/table";
import {useStore} from "../../../store";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import dayjs from "dayjs";
import Button from "../../../components/ui/button";
import {DollarSign, Download, Eye, Filter, Send, Trash, Trash2, User} from "react-feather";
import Swal from "sweetalert2";
import NumberFormat from "react-number-format";
import Form from "../../../containers/form/form";
import Field from "../../../containers/form/field";
import Modal from "../../../components/modal";
import Checkbox from "rc-checkbox";
import FilePreview from "../../../components/file-preview";
import Flex from "../../../components/flex";
import config from "../../../config";
import GridView from "../../../containers/grid-view";
import Pagination from "../../../components/pagination";
import useEimzo from "../../../hooks/eimzo/useEimzo";
import {checkBeforeCurrentTime} from "../../../utils";
import {toast} from "react-toastify";

const AgentViewContainer = () => {
    const {t} = useTranslation();
    const {id} = useParams()
    const navigate = useNavigate();
    const [selectedPolice, setSelectedPolice] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [showTransactionId, setShowTransactionId] = useState(null);
    const [policyId, setPolicyId] = useState(null);
    const [page,setPage] = useState(1)
    const [filter,setFilter] = useState({})
    const { loading, setLoading = () => {}, keys, error, sign, initEIMZO } = useEimzo();
    let {data, isLoading} = useGetOneQuery({id, key: KEYS.agreements, url: `${URLS.agreements}/show`})
    let {data: policyData, isLoading: policyIsLoading} = useGetAllQuery({
        id, key: KEYS.policyFilter, url: URLS.policyFilter, params: {
            params: {
                agreementId: id
            }
        }
    })
    let {data: gtkDetails} = useGetAllQuery({
         key: [KEYS.agreementGtkDetails,id,policyId], url: URLS.agreementGtkDetails, params: {
            params: {
                agreementId: id,
                policyId
            }
        },
        enabled:!!(policyId)
    })
    let {data: endorsementData, isLoading: endorsementIsLoading} = useGetAllQuery({
        id,
        key: KEYS.endorsements,
        url: `${URLS.endorsements}/list`,
        params: {
            params: {
                agreementId: id
            }
        }
    })
    const {mutate: sentToFondRequest} = usePostQuery({listKeyId: KEYS.agreements})
    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.policyFilter})
    const {
        mutate: deleteEndorsementRequest,
        isLoading: deleteEndorsementLoading
    } = useDeleteQuery({listKeyId: KEYS.endorsementFilter})

    const user = useStore(state => get(state, 'user'))
    let {data: transactions, isLoading: _isLoading} = useGetAllQuery({
        key: [KEYS.transactions,filter], url: `${URLS.transactions}/list`, enabled: !!(get(user, 'branch._id')), params: {
            params: {
                page,
                branch: get(user, 'branch._id'),
                limit: 50,
                isAvailable:true,
                ...filter
            }
        }
    })
    const {mutate: attachRequest, isLoading: isLoadingAttach} = usePostQuery({listKeyId: [KEYS.transactions,KEYS.policyFilter]})
    const {mutate: unAttachRequest, isLoading: isLoadingUnAttach} = usePostQuery({listKeyId: [KEYS.transactions,KEYS.policyFilter]})
    const {mutate: createPkcs7} = usePostQuery({listKeyId: [KEYS.eimzoPkcs7,policyId],hideSuccessToast:true})
    const {mutate: signPkcs7,isLoading:isLoadingSign} = usePostQuery({listKeyId: [KEYS.policyFilter,id],hideSuccessToast:true})
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Agreements'),
            path: '/agreements',
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

    const attach = ({data}) => {
        const {attachmentSum} = data;
        attachRequest({
            url: URLS.transactionAttach,
            attributes: {
                attach: true,
                transaction: transactionId,
                policy: get(selectedPolice, '_id'),
                attachmentSum,
                agreement: get(selectedPolice, 'agreement')
            }
        }, {
            onSuccess: () => {
                setTransactionId(null)
                setSelectedPolice(null)
            },
            onError: () => {

            }
        })
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
                deleteRequest({url: `${URLS.policy}/${id}`})
            }
        });
    }

    const unAttach = (_id) => {
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
            confirmButtonText: t('Unattach'),
            cancelButtonText: t('Cancel'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                unAttachRequest({url: URLS.unattachPolicy,attributes:{
                        agreement:id,
                        policy:_id
                    }})
            }
        });
    }


    const sendToFond = (agreementId, policyId) => {
        sentToFondRequest({url: `${URLS.sendToFond}?agreementId=${agreementId}&policyId=${policyId}`})
    }

    const {mutate: allowRequest, isLoading:isLoadingAllow} = usePutQuery({listKeyId: KEYS.endorsements})
    const allow = (_id, _isAllowed = true) => {
        allowRequest({
            url: `${URLS.endorsements}/${_id}`,
            attributes: {
                allow: _isAllowed
            }
        })
    }
    const signWithEimzo = (_key) => {
        sign(_key, JSON.stringify(get(gtkDetails,'data','Test')), (data, error) => {
            if (!error) {
                const {pkcs7_64 = null} = data;

                createPkcs7({
                    url: URLS.eimzoPkcs7,
                            attributes: {
                                pkcs7Data: pkcs7_64
                            },
                },{
                    onSuccess:(res)=>{
                        // signPkcs7({
                        //     url: URLS.agreementGtkSend,
                        //     attributes: {
                        //         agreementId: id,
                        //         policyId,
                        //         signature:get(res,'data.pkcs7b64')
                        //     },
                        // },{
                        //     onSuccess:(val)=>{
                        //         if(isEqual(get(val,'data.resultcode'),0)){
                        //             toast.success(t('Successfully signed'))
                        //         }else{
                        //             toast.error(get(val,'data.resultnote','ERROR'))
                        //         }
                        //         setPolicyId(null)
                        //     }
                        // })
                    }
                })
            }
        })
    }

    if (isLoading || deleteLoading || policyIsLoading || endorsementIsLoading || deleteEndorsementLoading || isLoadingAllow) {
        return <OverlayLoader/>
    }
    return (
        <>
            <Section>
                {isLoadingUnAttach && <ContentLoader/>}
                <Row className={''} align={'center'}>
                    <Col xs={12}>
                        <Title>{t('Договор')}</Title>
                    </Col></Row>
                <Row>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("Product")}</td>
                                <td><strong>{get(data, "data.product.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Страхователь")}</td>
                                <td>
                                    <strong>{get(data, "data.insurant.organization.name") ? get(data, "data.insurant.organization.name") : `${get(data, "data.insurant.person.fullName.lastname")} ${get(data, "data.insurant.person.fullName.firstname")} ${get(data, "data.insurant.person.fullName.middlename")}`}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Номер договора")}</td>
                                <td><strong>{get(data, "data.agreementNumber")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Дата договора")}</td>
                                <td>
                                    <strong>{dayjs(get(data, "data.agreementDate")).format("DD/MM/YYYY")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Insurance start date")}</td>
                                <td>
                                    <strong>{dayjs(get(data, "data.startOfInsurance")).format("DD/MM/YYYY")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Дата окончания периода страхования")}</td>
                                <td>
                                    <strong>{dayjs(get(data, "data.endOfInsurance")).format("DD/MM/YYYY")}</strong>
                                </td>
                            </tr>

                        </Table>
                    </Col>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("Total insurance sum")}</td>
                                <td><strong><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(data, "data.totalInsuranceSum", 0)}/></strong></td>
                            </tr>
                            <tr>
                                <td>{t("Общая страховая премия")}</td>
                                <td><strong><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(data, "data.totalInsurancePremium", 0)}/></strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Номер анкеты-заявления")}</td>
                                <td><strong>{t(get(data, "data.registrationNumber"))}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Дата анкеты-заявления")}</td>
                                <td>
                                    <strong>{dayjs(get(data, "data.createdAt")).format("DD/MM/YYYY")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Кем принято")}</td>
                                <td><strong>{t(get(data, "data.whoAccepted"))}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Status")}</td>
                                <td><strong>{t(get(data, "data.status"))}</strong></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td onClick={()=>navigate(`/agreements/edit/${id}`)}><Button>Доп.соглашение</Button></td>
                            </tr>
                        </Table>

                    </Col>
                </Row>
                <Row className={'mt-15'}>
                    <Col xs={12}>
                        <Row align={'center'}>
                            <Col xs={8}><Title sm>{t("Полис")}</Title></Col>
                            <Col xs={4} className={'text-right'}>
                                <Button green onClick={() => navigate(`/policy/create/${id}`)} className={'mr-16'}
                                        type={'button'}>{t("Добавить полис")}</Button>

                            </Col>
                        </Row>
                        <Row className={'mt-15'}>
                            {get(policyData, "data.data", []).length > 0 && <Col xs={12}  className={'horizontal-scroll'}>
                                <hr/>
                                <Table hideThead={false}
                                       thead={['Номер полиса', 'Страхователь', 'Номер бланка полиса', 'Дата выдачи полиса', 'Дата начала периода по полису','Дата окончания периода по полису','Страховая сумма','Страховая премия','Страховой агент', 'Прикреплено', 'Скачать анкету-заявление','Скачать договор','Скачать другие документы','Скачать сгенерированный полис','Status', 'Action']}>
                                    {get(policyData, "data.data", []).map((item, i) => <tr key={i + 1}>
                                        <td>
                                            {get(item, 'number', '-')}
                                        </td>
                                        <td>
                                            {get(data, "data.insurant.organization") ? get(data, "data.insurant.organization.name") : `${get(data, "data.insurant.person.fullName.lastname")} ${get(data, "data.insurant.person.fullName.firstname")} ${get(data, "data.insurant.person.fullName.middlename")}`}
                                        </td>
                                        <td>
                                            {get(item, 'blank.blank.blank_number')}
                                        </td>
                                        <td>
                                            {dayjs(get(item, 'issueDate')).format('DD/MM/YYYY')}
                                        </td>
                                        <td>{dayjs(get(item, 'startDate')).format('DD/MM/YYYY')}</td>
                                        <td>{dayjs(get(item, 'endDate')).format('DD/MM/YYYY')}</td>
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, "insuranceSum")}/></td>
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, "insurancePremium")}/></td>
                                        <td>
                                            {get(item, "agent.organization") ? get(item, "agent.organization.name",'-') : `${get(item, "agent.person.secondname",'-')} ${get(item, "agent.person.name",'-')} `}
                                        </td>
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, "attachedSum")}/></td>
                                        <td>{get(data, "data.copyOfDocuments") && <FilePreview fileId={get(data, "data.copyOfDocuments")} />}</td>
                                        <td>{get(data, "data.copyOfAgreement") && <FilePreview fileId={get(data, "data.copyOfAgreement")} />}</td>
                                        <td>{get(data, "data.documents._id") && <FilePreview fileId={get(data, "data.documents._id")} />}</td>
                                        <td>{get(item,'url') && <a target={"_blank"} title={'UZ'} href={get(item,'url','#')}><Download /></a>}
                                            {get(item,'url_ru') && <a style={{marginLeft:'8px'}} target={"_blank"} title={'RU'} href={get(item,'url_ru','#')}><Download /></a>}
                                            {get(item,'url_en') && <a style={{marginLeft:'8px'}} target={"_blank"} title={'EN'} href={get(item,'url_en','#')}><Download /></a>}
                                        </td>
                                        <td>{get(item, "fondStatus")}</td>


                                        <td
                                        >
                                            <Flex>
                                            {includes(['new', 'partialPaid','sent'], get(item, "fondStatus")) &&
                                            <DollarSign onClick={() => setSelectedPolice(item)}
                                                        className={'cursor-pointer flex-none min-none' }
                                                        color={'#71BC70'}/>}
                                            {get(user,'isCheckPayment') && !includes(['sent'], get(item, "fondStatus")) && !get(item,'url') &&
                                            <Send  className={'cursor-pointer ml-15 flex-none min-none'} color={'#13D6D1'}
                                                  onClick={() => sendToFond(id, get(item, '_id'))}/>}
                                                <Eye onClick={() => setShowTransactionId(get(item, '_id', null))}
                                                        className={'ml-15 cursor-pointer flex-none min-none'} color={'#13D6D1'}/>
                                            {includes(['new'], get(item, "fondStatus")) &&
                                            <Trash2 onClick={() => remove(get(item, '_id', null))}
                                                    className={'ml-15 cursor-pointer flex-none min-none'} color={'#dc2626'}/>}
                                                {includes([config.ROLES.admin],get(user,'role.name')) && includes(['paid', 'partialPaid'], get(item, "fondStatus")) && <Button onClick={()=>unAttach(get(item, '_id'))} sm inline danger>Открепить деньги</Button>}
                                                {includes([config.ROLES.admin],get(user,'role.name')) && <Button className={'ml-15'} onClick={()=>navigate(`/policy/termination/${id}/${get(item, '_id')}`)} sm inline danger>Расторжение</Button>}
                                                {includes(['sent'], get(item, "fondStatus")) && !includes(['sent'], get(item, "gtkStatus")) && <Button  className={'ml-15'} onClick={()=>setPolicyId(get(item, '_id'))} sm  yellow>Отпраква ГТК</Button>}
                                            </Flex>
                                        </td>
                                    </tr>)}
                                </Table>
                            </Col>
                            }
                        </Row>
                    </Col>
                </Row>
                <Row className={'mt-30'}>
                    <Col xs={12}>
                        <Row align={'center'}>
                            <Col xs={12}><Title sm>{t("Индоссамент")}</Title></Col>
                        </Row>
                        <Row className={'mt-15'}>
                            {get(endorsementData, "data.data", []).length > 0 && <Col xs={12}  className={'horizontal-scroll'}>
                                <hr/>
                                <Table hideThead={false}
                                       thead={['Причина', 'Решение', 'Дата решения', 'Кем принято решение',  'Action']}>
                                    {get(endorsementData, "data.data", []).map((item, i) => <tr key={i + 1}>
                                        <td>
                                            {get(item, 'reason', '-')}
                                        </td>
                                        <td>{get(item, "decision")}</td>
                                        <td>{dayjs(get(item, "createdAt")).format("DD.MM.YYYY")}</td>
                                        <td>{get(item, "request_creator.name")}</td>
                                        <td className={''}
                                        >
                                            {get(item, 'decision') === 'approved' ? <><Button danger
                                                                                            onClick={() => allow(get(item, '_id'), false)}>{t('Отказать')}</Button></> : <Button
                                                className={'ml-15'}
                                                onClick={() => allow(get(item, '_id'))}>{t('Одобрить')}</Button>}
                                        </td>
                                    </tr>)}
                                </Table>
                            </Col>
                            }
                        </Row>
                    </Col>
                </Row>
            </Section>
            <Modal  title={'Распределение к полису'} visible={!isNil(selectedPolice)}
                   hide={() => setSelectedPolice(null)}>
                <div style={{padding:'15px 0'}}>
                    <Form formRequest={({data}) => setFilter({...data})}>
                        <Row align={'end'} gutterWidth={16}>
                            <Col xs={2}>
                                <Field sm label={t('Дата п/п от')} type={'datepicker'}
                                       name={'fromDate'}
                                       defaultValue={get(filter, 'fromDate')}

                                />
                                <Field sm label={t('Дата п/п до')} type={'datepicker'}
                                       name={'toDate'}
                                       defaultValue={get(filter, 'toDate')}

                                />

                            </Col>
                            <Col xs={2}>
                                <Field sm label={t('Сумма поступления от')} type={'number-format-input-filter'}
                                       name={'payment_amount_from'}
                                       defaultValue={get(filter, 'payment_amount_from', null)}
                                />
                                <Field sm label={t('Сумма поступления до')} type={'number-format-input-filter'}
                                       name={'payment_amount_to'}
                                       defaultValue={get(filter, 'payment_amount_to', null)}
                                />
                            </Col>
                            <Col xs={2}>
                                <Field sm label={t('Прикреплено от')} type={'number-format-input-filter'}
                                       name={'attached_sum_from'}
                                       defaultValue={get(filter, 'attached_sum_from', null)}
                                />
                                <Field sm label={t('Прикреплено до')} type={'number-format-input-filter'}
                                       name={'attached_sum_to'}
                                       defaultValue={get(filter, 'attached_sum_to', null)}
                                />
                            </Col>
                            <Col xs={2}>
                                <Field sm label={t('Доступный остаток от')} type={'number-format-input-filter'}
                                       name={'available_sum_from'}
                                       defaultValue={get(filter, 'available_sum_from', null)}
                                />
                                <Field sm label={t('Доступный остаток до')} type={'number-format-input-filter'}
                                       name={'available_sum_to'}
                                       defaultValue={get(filter, 'available_sum_to', null)}
                                />
                            </Col>
                            <Col xs={2}>

                                <Field  defaultValue={get(filter, 'is1C')} type={'switch'}
                                        name={'is1C'}
                                        label={t("is1C ?")}
                                />
                                <Field sm  defaultValue={get(filter, 'payment_details')} type={'input'}
                                       name={'payment_details'}
                                       label={t("Payment details ")}
                                />
                            </Col>
                            <Col xs={2} >
                                <div style={{marginBottom:'25px'}}>
                                    <Button xs htmlType={'submit'}><Flex justify={'center'}><Filter size={14}/><span
                                        style={{marginLeft: '5px'}}>{t("Применить")}</span></Flex></Button>
                                    <Button className={'mt-15'} xs onClick={() => {
                                        setFilter({})
                                    }} danger type={'reset'}><Flex justify={'center'}><Trash
                                        size={14}/><span
                                        style={{marginLeft: '5px'}}>{t("Очистить")}</span></Flex></Button>

                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
                {
                    isLoadingAttach && <ContentLoader/>
                }
                {
                    <Table bordered hideThead={false}
                           thead={['', '№', 'Дата п/п', 'Наименоменование отправителя', 'Сумма поступления','Детали платежа', 'Прикреплено', 'Доступный остаток']}>{get(transactions, 'data.data', []).map((item, i) =>
                        <tr key={get(item, '_id')}>
                            <td><Checkbox disabled={!get(item, 'available_sum', 0)}
                                          checked={isEqual(transactionId, get(item, '_id'))} onChange={(e) => {
                                if (e.target?.checked) {
                                    setTransactionId(get(item, '_id'))
                                } else {
                                    setTransactionId(null)
                                }
                            }}/></td>
                            <td>{(page-1)*50+(i + 1)}</td>
                            <td>{get(item, 'payment_order_date')}</td>
                            <td>{get(item, 'sender_name')}</td>
                            <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                              value={get(item, 'payment_amount', 0)}/></td>

                            <td>{get(item, 'payment_details')}</td>
                            <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                              value={get(item, 'attached_sum', 0)}/></td>
                            <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                              value={get(item, 'available_sum', 0)}/></td>
                        </tr>)}</Table>}
                {transactionId && <Form formRequest={attach} footer={<Button type={'submit'}>{t("Прикрепить")}</Button>}>
                    <Row className={'mt-15'}>
                        <Col xs={6}>

                            <Field defaultValue={get(selectedPolice, 'insurancePremium', 0)}
                                   label={t("Сумма оплаты по полису:")} property={{disabled: true}}
                                   type={'number-format-input'} name={'sumInsurancePremium'}/>
                        </Col>
                        <Col xs={6}>
                            <Field defaultValue={get(selectedPolice, 'attachedSum', 0)} property={{disabled: true}}
                                   type={'number-format-input'}
                                   name={'attachedSum'} label={t("Сумма прикреплённых средств:")}/>
                        </Col>
                        <Col xs={6}>
                            <Field type={'number-format-input'} name={'attachmentSum'} label={t("Сумма к прикреплению:")}/>
                        </Col>
                    </Row>
                </Form>}
                <Pagination limit={50} page={page} setPage={setPage} totalItems={get(transactions, 'data.count', 0)} />
            </Modal>
            <Modal title={t("Transaction logs")} visible={!isNil(showTransactionId)}
                   hide={() => setShowTransactionId(null)}>
                {showTransactionId && <GridView
                    tableHeaderData={[
                        {
                            id: 1,
                            key: 'typeofdistribute.name',
                            title: t("Distribute type")
                        },
                        {
                            id: 2,
                            key: 'payment_order_number',
                            title: t("Payment order number")
                        },
                        {
                            id: 3,
                            key: 'amount',
                            title: t("Amount"),
                            hasNumberFormat: true
                        },
                        {
                            id: 4,
                            key: 'cred_account_ID',
                            title: t("cred_account_ID"),
                        },
                        {
                            id: 5,
                            key: 'debt_account_ID',
                            title: t("debt_account_ID"),
                        },
                        {
                            id: 6,
                            key: 'transaction_date',
                            title: t("transaction_date"),
                            date: true,
                            dateFormat: 'MM/DD/YYYY'
                        },
                    ]}
                    keyId={KEYS.transactionLogs}
                    url={URLS.transactionLogs}
                    listUrl={`${URLS.transactionLogs}/list`}
                    params={{
                        policy:showTransactionId,
                        isAvailable:true
                    }}
                    title={''}
                    responseDataKey={'data.data'}
                    hideCreateBtn
                    hideDeleteBtn
                />}
            </Modal>
            <Modal title={t("Выберите ключ")} visible={!isNil(policyId)}
                   hide={() => setPolicyId(null)}>
                {isLoadingSign && <OverlayLoader />}
                {error && isEqual(error, "NOT_INSTALLED") ? <div style={{padding:'15px'}}>
                        {t("Установите модуль E-IMZO от имени Администратора.")}
                </div> : isEmpty(keys) ? <div style={{padding:'15px'}}>
                        {t("Ключ(и) E-IMZO не найден(ы)")}
                    </div> :
                    keys.map((key) => {
                    const validFrom = dayjs(get(key, "validFrom")).unix();
                    const validTo = dayjs(get(key, "validTo")).unix();
                    const isValid = validTo - validFrom > 0;
                    return (
                        <div onClick={()=>checkBeforeCurrentTime(get(key, "validTo")) ? ()=>{} : signWithEimzo(key)} style={{padding:'12px',boxShadow:'0px 5px 49px rgba(0, 0, 0, 0.06)',marginTop:'12px',cursor:checkBeforeCurrentTime(get(key, "validTo")) ? 'not-allowed' :'pointer'}}>
                           <h4 style={{color:'#222',display:'flex',alignItems:'center'}}> <User style={{marginRight:'5px'}} />   {get(key, "CN", "")}</h4>
                            <div style={{marginTop:'5px'}}>
                                {t("ПИНФЛ")} : {get(key, "PINFL")}
                            </div>
                            <div style={{marginTop:'5px',color:checkBeforeCurrentTime(get(key, "validTo")) ? 'red' : 'rgb(112, 112, 112)'}}>
                                {t("PERIOD")} : {dayjs(get(key, "validFrom")).format("DD-MM-YYYY")} / {dayjs(get(key, "validTo")).format("DD-MM-YYYY")} {checkBeforeCurrentTime(get(key, "validTo")) && t("Expired")}
                            </div>
                        </div>
                    )
                })}

            </Modal>
        </>
    )
        ;
};

export default AgentViewContainer;
