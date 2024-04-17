import React, {useState} from 'react';
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import Section from "../../../components/section";
import Button from "../../../components/ui/button";
import Field from "../../../containers/form/field";
import Form from "../../../containers/form/form";
import {useTranslation} from "react-i18next";
import {useGetAllQuery, useGetOneQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import {Navigate, useNavigate} from "react-router-dom";
import {get} from "lodash"
import {getSelectOptionsListFromData} from "../../../utils";
import {useStore} from "../../../store";


const CreateContainer = ({
                             product_id = null,
                             ...rest
                         }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [filter, setFilter] = useState({})
    const user = useStore(state => get(state, 'user', null))
    let {data: agreementData, isLoading} = useGetOneQuery({
        id: product_id,
        key: KEYS.agreements,
        url: `${URLS.agreements}/show`
    })
    const {mutate: createPolicy, isLoading: isLoadingPolicy} = usePostQuery({listKeyId: KEYS.agreements})

    let {data: policyTypeList} = useGetAllQuery({key: KEYS.typeofbco, url: 'api/references/policy-type/list'})
    policyTypeList = getSelectOptionsListFromData(get(policyTypeList, `data.data`, []), '_id', 'name')

    let {data: policyStatusList} = useGetAllQuery({key: KEYS.statusofpolicy, url: 'api/bco/policy-status/list'})
    policyStatusList = getSelectOptionsListFromData(get(policyStatusList, `data.data`, []), '_id', 'name')

    let {data: paymentStatusList} = useGetAllQuery({
        key: KEYS.statusofpayment,
        url: 'api/references/payment-status/list'
    })
    paymentStatusList = getSelectOptionsListFromData(get(paymentStatusList, `data.data`, []), '_id', 'name')

    let {data: policyBlankList} = useGetAllQuery({
        key: KEYS.policyblank,
        params:{
            params:{
                branch:get(user, 'branch._id'),
                employee:get(user, 'employee._id'),
                is_used:false
            }
        },
        url: `/api/bco/policy-blank/list`,
    })
    policyBlankList = getSelectOptionsListFromData(get(policyBlankList, `data.data`, []), '_id', 'blank.blank_number')
    let {data: payments} = useGetAllQuery({key: KEYS.typeofpayment, url: 'api/references/payment-type/list'})
    payments = getSelectOptionsListFromData(get(payments, `data.data`, []), '_id', 'name')

    let {data: documents} = useGetAllQuery({key: ['documents_policy'], url: 'api/references/additional-documents/list'})
    documents = getSelectOptionsListFromData(get(documents, `data.data`, []), '_id', 'name')

    const addPolicy = (data) => {
        createPolicy({
            url: `${URLS.policy}?agreementId=${product_id}`, attributes: {
                ...data
            }
        }, {
            onSuccess: () => {
                navigate(`/agreements/view/${product_id}`)
            },
            onError: () => {
            }
        })
    }


    if (isLoading) {
        return <OverlayLoader/>;
    }
    return (
        <Section>
            {isLoadingPolicy && <ContentLoader/>}
            <Row className={'mb-15'} align={'center'}>
                <Col xs={12}>
                    <Title>Add policy</Title>
                </Col>
            </Row>
            <Form getValueFromField={(value, name) => setFilter(prev => ({...prev, [name]: value}))}
                  formRequest={({data}) => {
                      addPolicy(data);
                  }}
                  footer={<><Button>{t("Add")}</Button></>}>
                <Row>
                    <Col xs={12}>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Field label={t('Number')} type={'input'}
                                       name={'number'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field label={t('Number')} type={'datepicker'}
                                       name={'issueDate'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field label={t('Start')} type={'datepicker'}
                                       name={'startDate'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field label={t('End')} type={'datepicker'}
                                       name={'endDate'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field label={t('Type')} options={policyTypeList} type={'select'}
                                       name={'type'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field label={t('Policy blank')} options={policyBlankList} type={'select'}
                                       name={'blank'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field label={t('Invoice')} type={'input'}
                                       name={'invois'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    type={'select'}
                                    name={`paymentType`}
                                    options={payments}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field label={t('Policy status')} options={policyStatusList} type={'select'}
                                       name={'status'}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field label={t('Payment status')} options={paymentStatusList} type={'select'}
                                       name={'paymentStatus'}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field
                                    isMulti
                                    type={'select'}
                                    name={`documents`}
                                    options={documents}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Section>
    );
};

export default CreateContainer;