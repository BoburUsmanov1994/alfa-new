import React, {useEffect, useMemo, useState} from 'react';
import {Row, Col} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import {get, includes, isEqual, isNil, sumBy} from "lodash";
import {useDeleteQuery, useGetAllQuery, useGetOneQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import Table from "../../../components/table";
import {useStore} from "../../../store";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import dayjs from "dayjs";
import Button from "../../../components/ui/button";
import {DollarSign, Send, Trash2} from "react-feather";
import Swal from "sweetalert2";
import NumberFormat from "react-number-format";
import Form from "../../../containers/form/form";
import Field from "../../../containers/form/field";
import Modal from "../../../components/modal";
import Checkbox from "rc-checkbox";

const AgentViewContainer = ({...rest}) => {
    const {t} = useTranslation();
    const {id} = useParams()
    const navigate = useNavigate();
    const [selectedPolice, setSelectedPolice] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    let {data, isLoading} = useGetOneQuery({id, key: KEYS.agreements, url: `${URLS.agreements}/show`})
    let {data: policyData, isLoading: policyIsLoading} = useGetAllQuery({
        id, key: KEYS.policyFilter, url: URLS.policyFilter, params: {
            params: {
                agreementId: id
            }
        }
    })
    let {data: endorsementData, isLoading: endorsementIsLoading} = useGetOneQuery({
        id,
        key: KEYS.endorsementFilter,
        url: URLS.endorsementFilter,
        enabled: false
    })
    const {mutate: sentToFondRequest, isLoadingSendToFond} = usePostQuery({listKeyId: KEYS.agreements})
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
    const {mutate: attachRequest, isLoading: isLoadingAttach} = usePostQuery({listKeyId: KEYS.policyFilter})
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
    console.log('selectedPolice', selectedPolice)

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

    const removeEndorsement = (id) => {
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
                deleteEndorsementRequest({url: `${URLS.endorsements}/${id}`})
            }
        });
    }

    const sendToFond = (agreementId, policyId) => {
        sentToFondRequest({url: `${URLS.sendToFond}?agreementId=${agreementId}&policyId=${policyId}`})
    }


    if (isLoading || deleteLoading || policyIsLoading || endorsementIsLoading || deleteEndorsementLoading) {
        return <OverlayLoader/>
    }

    return (
        <>
            <Section>
                <Row className={''} align={'center'}>
                    <Col xs={12}>
                        <Title>{t('Agreement view')}</Title>
                    </Col></Row>
                <Row>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("Product")}</td>
                                <td><strong>{get(data, "data.product.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Agreement number")}</td>
                                <td><strong>{get(data, "data.agreementNumber")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Agreement date")}</td>
                                <td>
                                    <strong>{dayjs(get(data, "data.agreementDate")).format("DD/MM/YYYY")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Application date")}</td>
                                <td>
                                    <strong>{dayjs(get(data, "data.applicationDate")).format("DD/MM/YYYY")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Insurance start date")}</td>
                                <td>
                                    <strong>{dayjs(get(data, "data.startOfInsurance")).format("DD/MM/YYYY")}</strong>
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
                                <td>{t("Total premium")}</td>
                                <td><strong><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(data, "data.totalInsurancePremium", 0)}/></strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Registration number")}</td>
                                <td><strong>{t(get(data, "data.registrationNumber"))}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Status")}</td>
                                <td><strong>{t(get(data, "data.status"))}</strong></td>
                            </tr>
                        </Table>
                    </Col>
                </Row>
                <Row className={'mt-15'}>
                    <Col xs={6}>
                        <Row align={'center'}>
                            <Col xs={8}><Title sm>Полис</Title></Col>
                            <Col xs={4} className={'text-right'}>
                                <Button green onClick={() => navigate(`/policy/create/${id}`)} className={'mr-16'}
                                        type={'button'}>Добавить
                                    полис</Button>

                            </Col>
                        </Row>
                        <Row className={'mt-15'}>
                            {get(policyData, "data.data", []).length > 0 && <Col xs={12}>
                                <hr/>
                                <Table hideThead={false}
                                       thead={['Policy number', 'Issue date', 'Attached sum', 'Status', 'Action']}>
                                    {get(policyData, "data.data", []).map((item, i) => <tr key={i + 1}>
                                        <td>
                                            {get(item, 'number', '-')}
                                        </td>
                                        <td>
                                            {dayjs(get(item, 'issueDate')).format('DD/MM/YYYY')}
                                        </td>
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, "attachedSum")}/></td>
                                        <td>{get(item, "fondStatus")}</td>

                                        <td className={''}
                                        >
                                            {includes(['new', 'partialPaid'], get(item, "fondStatus")) &&
                                                <DollarSign onClick={() => setSelectedPolice(item)}
                                                            className={'cursor-pointer'}
                                                            color={'#71BC70'}/>}
                                            {includes([ 'paid'], get(item, "fondStatus")) &&
                                                <Send className={'cursor-pointer ml-15'} color={'#13D6D1'}
                                                      onClick={() => sendToFond(id, get(item, '_id'))}/>}
                                            {includes(['new'], get(item, "fondStatus")) &&
                                                <Trash2 onClick={() => remove(get(item, '_id', null))}
                                                        className={'ml-15 cursor-pointer'} color={'#dc2626'}/>}
                                        </td>
                                    </tr>)}
                                </Table>
                            </Col>
                            }
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Row align={'center'}>
                            <Col xs={12}> <Title sm>Индосаменты</Title></Col>
                            {/*<Col xs={4} className={'text-right'}> <Button*/}
                            {/*    onClick={() => navigate(`/endorsement/create/${id}`)} green type={'button'}>Добавить*/}
                            {/*    индосаменты</Button></Col>*/}
                        </Row>
                        <Row className={'mt-15'}>
                            {get(endorsementData, "data.data", []).length > 0 && <Col xs={12}>
                                <hr/>
                                <Table hideThead={false}
                                       thead={['Type', 'Status', 'Conclusion', 'Action']}>
                                    {get(endorsementData, "data.data", []).map((item, i) => <tr key={i + 1}>
                                        <td>
                                            {get(item, 'typeofendorsements.name', '-')}
                                        </td>
                                        <td>
                                            {get(item, 'statusofendorsements.name', '-')}
                                        </td>
                                        <td>
                                            {get(item, 'reqforconclusion', '-')}
                                        </td>
                                        <td className={'cursor-pointer'}
                                            onClick={() => removeEndorsement(get(item, '_id', null))}>
                                            <Trash2 color={'#dc2626'}/>
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
                           thead={['', '№', 'Дата п/п', 'Наименоменование отправителя', 'Сумма поступления','Available sum']}>{get(transactions, 'data.data', []).map((item, i) =>
                        <tr key={get(item, '_id')}>
                            <td><Checkbox disabled={!get(item, 'available_sum', 0)} checked={isEqual(transactionId, get(item, '_id'))} onChange={(e) => {
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
                            <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                              value={get(item, 'available_sum', 0)}/></td>
                        </tr>)}</Table>}
                {transactionId && <Form formRequest={attach} footer={<Button type={'submit'}>Прикрепить</Button>}>
                    <Row className={'mt-15'}>
                        <Col xs={6}>
                            <Field defaultValue={sumBy(get(selectedPolice, 'riskId', []), 'insurancepremium')}
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
        </>
    )
        ;
};

export default AgentViewContainer;