import React, {useEffect, useMemo, useState} from 'react';
import {Row, Col} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import {get, includes, isEqual, isNil} from "lodash";
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
import {DollarSign, Download, Eye, Send, Trash2} from "react-feather";
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

const AgentViewContainer = () => {
    const {t} = useTranslation();
    const {id} = useParams()
    const navigate = useNavigate();
    const [selectedPolice, setSelectedPolice] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [showTransactionId, setShowTransactionId] = useState(null);
    let {data, isLoading} = useGetOneQuery({id, key: KEYS.agreements, url: `${URLS.agreements}/show`})
    let {data: policyData, isLoading: policyIsLoading} = useGetAllQuery({
        id, key: KEYS.policyFilter, url: URLS.policyFilter, params: {
            params: {
                agreementId: id
            }
        }
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
        key: KEYS.transactions, url: `${URLS.transactions}/list`, enabled: !!(get(user, 'branch._id')), params: {
            params: {
                branch: get(user, 'branch._id'),
                limit: 100
            }
        }
    })
    const {mutate: attachRequest, isLoading: isLoadingAttach} = usePostQuery({listKeyId: [KEYS.transactions,KEYS.policyFilter]})
    const {mutate: unAttachRequest, isLoading: isLoadingUnAttach} = usePostQuery({listKeyId: [KEYS.transactions,KEYS.policyFilter]})
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
                            <Col xs={8}><Title sm>Полис</Title></Col>
                            <Col xs={4} className={'text-right'}>
                                <Button green onClick={() => navigate(`/policy/create/${id}`)} className={'mr-16'}
                                        type={'button'}>Добавить
                                    полис</Button>

                            </Col>
                        </Row>
                        <Row className={'mt-15'}>
                            {get(policyData, "data.data", []).length > 0 && <Col xs={12}  className={'horizontal-scroll'}>
                                <hr/>
                                <Table hideThead={false}
                                       thead={['Номер полиса', 'Страхователь', 'Номер бланка полиса', 'Дата выдачи полиса', 'Дата начала периода по полису','Дата окончания периода по полису','Страховая сумма','Страховая премия', 'Прикреплено', 'Скачать анкету-заявление','Скачать договор','Скачать другие документы','Скачать сгенерированный полис','Status', 'Action']}>
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
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, "attachedSum")}/></td>
                                        <td>{get(data, "data.copyOfDocuments") && <FilePreview fileId={get(data, "data.copyOfDocuments")} />}</td>
                                        <td>{get(data, "data.copyOfAgreement") && <FilePreview fileId={get(data, "data.copyOfAgreement")} />}</td>
                                        <td>{get(data, "data.documents._id") && <FilePreview fileId={get(data, "data.documents._id")} />}</td>
                                        <td>{get(item,'url') && <a target={"_blank"} href={get(item,'url','#')}><Download /></a>}</td>
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
                                                {includes([config.ROLES.admin],get(user,'role.name')) && <Button onClick={()=>unAttach(get(item, '_id'))} sm inline danger>Открепить деньги</Button>}
                                                {includes([config.ROLES.admin],get(user,'role.name')) && <Button className={'ml-15'} onClick={()=>navigate(`/policy/termination/${id}/${get(item, '_id')}`)} sm inline danger>Расторжение</Button>}
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
                            <Col xs={12}><Title sm>Индоссамент</Title></Col>
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
            <Modal title={'Распределение к полису'} visible={!isNil(selectedPolice)}
                   hide={() => setSelectedPolice(null)}>
                {
                    isLoadingAttach && <ContentLoader/>
                }
                {
                    <Table bordered hideThead={false}
                           thead={['', '№', 'Дата п/п', 'Наименоменование отправителя', 'Сумма поступления','Детали платежа', 'Available sum']}>{get(transactions, 'data.data', []).map((item, i) =>
                        <tr key={get(item, '_id')}>
                            <td><Checkbox disabled={!get(item, 'available_sum', 0)}
                                          checked={isEqual(transactionId, get(item, '_id'))} onChange={(e) => {
                                if (e.target?.checked) {
                                    setTransactionId(get(item, '_id'))
                                } else {
                                    setTransactionId(null)
                                }
                            }}/></td>
                            <td>{i + 1}</td>
                            <td>{dayjs(get(item, 'payment_order_date')).format("DD.MM.YYYY")}</td>
                            <td>{get(item, 'sender_name')}</td>
                            <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                              value={get(item, 'payment_amount', 0)}/></td>

                            <td>{get(item, 'payment_details')}</td>
                            <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                              value={get(item, 'available_sum', 0)}/></td>
                        </tr>)}</Table>}
                {transactionId && <Form formRequest={attach} footer={<Button type={'submit'}>Прикрепить</Button>}>
                    <Row className={'mt-15'}>
                        <Col xs={6}>
                            <Field defaultValue={get(selectedPolice, 'insurancePremium', 0)}
                                   label={'Сумма оплаты по полису:'} property={{disabled: true}}
                                   type={'number-format-input'} name={'sumInsurancePremium'}/>
                        </Col>
                        <Col xs={6}>
                            <Field defaultValue={get(selectedPolice, 'attachedSum', 0)} property={{disabled: true}}
                                   type={'number-format-input'}
                                   name={'attachedSum'} label={'Сумма прикреплённых средств:'}/>
                        </Col>
                        <Col xs={6}>
                            <Field type={'number-format-input'} name={'attachmentSum'} label={'Сумма к прикреплению:'}/>
                        </Col>
                    </Row>
                </Form>}
            </Modal>
            <Modal title={'Transaction logs'} visible={!isNil(showTransactionId)}
                   hide={() => setShowTransactionId(null)}>
                {showTransactionId && <GridView
                    tableHeaderData={[
                        {
                            id: 1,
                            key: 'typeofdistribute.name',
                            title: 'Distribute type'
                        },
                        {
                            id: 2,
                            key: 'payment_order_number',
                            title: 'Payment order number'
                        },
                        {
                            id: 3,
                            key: 'amount',
                            title: 'Amount',
                            hasNumberFormat: true
                        },
                        {
                            id: 4,
                            key: 'cred_account_ID',
                            title: 'cred_account_ID',
                        },
                        {
                            id: 5,
                            key: 'debt_account_ID',
                            title: 'debt_account_ID',
                        },
                        {
                            id: 6,
                            key: 'transaction_date',
                            title: 'transaction_date',
                            date: true,
                            dateFormat: 'MM/DD/YYYY'
                        },
                    ]}
                    keyId={KEYS.transactionLogs}
                    url={URLS.transactionLogs}
                    listUrl={`${URLS.transactionLogs}/list`}
                    params={{
                        policy:showTransactionId
                    }}
                    title={''}
                    responseDataKey={'data.data'}
                    hideCreateBtn
                    hideDeleteBtn
                />}
            </Modal>
        </>
    )
        ;
};

export default AgentViewContainer;
