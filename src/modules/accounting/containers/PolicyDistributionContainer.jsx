import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get, isEqual, find, isEmpty, includes} from "lodash";
import {useTranslation} from "react-i18next";
import Section from "../../../components/section";
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import Button from "../../../components/ui/button";
import Flex from "../../../components/flex";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {getSelectOptionsListFromData} from "../../../utils";
import Form from "../../../containers/form/form";
import Field from "../../../containers/form/field";
import {useNavigate} from "react-router-dom";
import {OverlayLoader} from "../../../components/loader";
import Table from "../../../components/table";
import Checkbox from "rc-checkbox";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";

const PolicyDistributionContainer = ({
                                         id = null
                                     }) => {
    const navigate = useNavigate();
    const [agreementId, setAgreementId] = useState(null);
    const [transactionId, setTransactionId] = useState(null);
    const [policyId, setPolicyId] = useState(null);
    const {t} = useTranslation()
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const user = useStore(state => get(state, 'user'))
    let {data: transactions, isLoading: _isLoading} = useGetAllQuery({
        key: KEYS.transactions, url: URLS.transactions, enabled: !!(get(user, 'branch_Id.id')), params: {
            params: {
                branch: get(user, 'branch_Id.id'),
                limit: 100
            }
        }
    })
    let {data: agreements} = useGetAllQuery({
        key: KEYS.transactionAgreements,
        url: `${URLS.transactionAgreements}/${transactionId}`,
        enabled: !!(transactionId)
    })
    agreements = getSelectOptionsListFromData(get(agreements, `data.data`, []), 'id', 'agreementsnumber')
    let {data: policies} = useGetAllQuery({
        key: [KEYS.transactionPolicies, agreementId],
        url: `${URLS.transactionPolicies}/${agreementId}`,
        enabled: !!(agreementId)
    })
    let policyList = getSelectOptionsListFromData(get(policies, `data.data`, []), '_id', 'policy_number')

    const {mutate: attachRequest, isLoading} = usePostQuery({listKeyId: KEYS.transactions})

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Бухгалтерия'),
            path: '/accounting',
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

    const attach = ({data}) => {
        const {attachmentSum} = data;
        attachRequest({
            url: URLS.transactionAttach,
            attributes: {transactionId: transactionId, policyId, attachmentSum}
        }, {
            onSuccess: () => {
                setTransactionId(null)
            },
            onError: () => {

            }
        })
    }
    if (_isLoading) {
        return <OverlayLoader/>
    }

    return (
        <Section>
            {isLoading && <OverlayLoader/>}
            <Row className={'mb-15'} align={'center'}>
                <Col xs={12}>
                    <Title>Распределение к полису</Title>
                </Col>
            </Row>
            <Row className={'mb-20'}>
                <Col xs={12} className={'horizontal-scroll'}>
                    {
                        <Table bordered hideThead={false}
                               thead={['', '№', 'Статус прикрепления', 'Филиал', 'Дата п/п', 'Наименоменование отправителя', 'Сумма поступления', 'Снято на договор', 'Детали платежа', 'ИНН отправителя', 'ИНН банка отправителя', 'МФО отправителя', 'Р/С отправителя', 'ИНН банка получателя', 'МФО банка получателя', 'Р/С получателя', 'Дата ввода']}>{get(transactions, 'data.data', []).map((item, i) =>
                            <tr key={get(item, '_id')}>
                                <td><Checkbox checked={isEqual(transactionId, get(item, '_id'))} onChange={(e) => {
                                    if (e.target?.checked) {
                                        setTransactionId(get(item, '_id'))
                                    } else {
                                        setTransactionId(null)
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

            {transactionId && <Row className={'mb-20'}>
                <Col xs={12}>
                    <Form formRequest={() => {
                    }} getValueFromField={(value, name) => {
                        if (name === 'agreement') {
                            setAgreementId(value)
                        }
                        if (name === 'policy') {
                            setPolicyId(value)
                        }
                    }}>
                        <Row>
                            <Col xs={3}> <Field label={t('Agreement')} type={'select'} name={'agreement'}
                                                options={agreements}/></Col>
                            <Col xs={3}> <Field label={t('Policy')} type={'select'} name={'policy'}
                                                options={policyList}/></Col>
                        </Row>
                    </Form>
                </Col>
            </Row>}
            <Row className={'mb-20'}>
                <Col xs={12}>
                    {transactionId && agreementId && policyId && <Form formRequest={attach} footer={<Flex>
                        <Button type={'submit'} className={'mr-16'}>Прикрепить</Button>
                        <Button type={'button'} danger> Открепить средства</Button>
                    </Flex>}>
                        <Field
                            defaultValue={get(find(get(policies, `data.data`, []), (_item) => isEqual(get(_item, "_id"), policyId)), 'sumInsurancePremium', 0)}
                            property={{disabled: true}} type={'number-format-input'} name={'sumInsurancePremium'}
                            label={'Сумма оплаты по полису:'}/>
                        <Field
                            defaultValue={get(find(get(policies, `data.data`, []), (_item) => isEqual(get(_item, "_id"), policyId)), 'attachedSum', 0)}
                            property={{disabled: true}} type={'number-format-input'} name={'attachedSum'}
                            label={'Сумма прикреплённых средств:'}/>
                        <Field type={'number-format-input'} name={'attachmentSum'} label={'Сумма к прикреплению:'}/>
                    </Form>}

                </Col>
            </Row>


        </Section>
    );
};

export default PolicyDistributionContainer;