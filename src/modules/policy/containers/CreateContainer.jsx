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


const CreateContainer = ({
                             product_id = null,
                             ...rest
                         }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [filter,setFilter] = useState({})
    let {data: agreementData, isLoading, isError} = useGetOneQuery({
        id: product_id,
        key: KEYS.agreements,
        url: URLS.agreements
    })
    const {mutate: createPolicy, isLoading: isLoadingPolicy} = usePostQuery({listKeyId: KEYS.agreements})

    let {data: policyTypeList} = useGetAllQuery({key: KEYS.typeofbco, url: URLS.typeofbco})
    policyTypeList = getSelectOptionsListFromData(get(policyTypeList, `data.data`, []), '_id', 'policy_type_name')

    let {data: policyStatusList} = useGetAllQuery({key: KEYS.statusofpolicy, url: URLS.statusofpolicy})
    policyStatusList = getSelectOptionsListFromData(get(policyStatusList, `data.data`, []), '_id', 'name')

    let {data: paymentStatusList} = useGetAllQuery({key: KEYS.statusofpayment, url: URLS.statusofpayment})
    paymentStatusList = getSelectOptionsListFromData(get(paymentStatusList, `data.data`, []), '_id', 'name')

    let {data: policyBlankList} = useGetAllQuery({key: KEYS.policyblank+get(filter,'typeofpoliceId'),
        url: `${URLS.policyblank}/f/${get(filter,'typeofpoliceId')}`,
        enabled:!!(get(filter,'typeofpoliceId'))
    })
    policyBlankList = getSelectOptionsListFromData(get(policyBlankList, `data.data`, []), '_id', 'blank_number')
    let {data: payments} = useGetAllQuery({key: KEYS.typeofpayment, url: URLS.typeofpayment})
    payments = getSelectOptionsListFromData(get(payments, `data.data`, []), '_id', 'name')

    const addPolicy = (data) => {
        createPolicy({
            url: URLS.policy, attributes: {
                ...data,
                agreementsId: product_id,
                copyofdocuments: 'xxxxxxxxx',
                riskId: get(agreementData, 'data.data.riskId'),
                objectofinsurance: get(agreementData, 'data.data.objectofinsurance'),
            }
        }, {
            onSuccess: () => {
                navigate(`/agreements/view/${product_id}`)
            },
            onError: () => {
            }
        })
    }

    if (isError) {
        return <Navigate to={'/500'}/>
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
            <Form getValueFromField={(value,name)=>setFilter(prev=>({...prev,[name]:value}))} formRequest={({data}) => {
                addPolicy(data);
            }}
                  footer={<><Button>{t("Add")}</Button></>}>
                <Row>
                    <Col xs={12}>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Field label={t('Policy type')} options={policyTypeList} type={'select'}
                                       name={'typeofpoliceId'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field label={t('Policy blank')} options={policyBlankList} type={'select'}
                                       name={'policy_blanknumber'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    type={'select'}
                                    name={`typeofpayment`}
                                    params={{required: true}}
                                    options={payments}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    type={'input'}
                                    name={`policy_number`}
                                    params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    type={'input'}
                                    name={`formnumber`}
                                    params={{required: true}}
                                />
                            </Col>


                            <Col xs={4}>
                                <Field label={t('Policy status')} options={policyStatusList} type={'select'}
                                       name={'statusofpolicy'} params={{required: true}}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field label={t('Payment status')} options={paymentStatusList} type={'select'}
                                       name={'statusofpayment'} params={{required: true}}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field
                                    type={'datepicker'}
                                    name={`dateofissue`}
                                    dateFormat={"DD.MM.YYYY"}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    type={'datepicker'}
                                    name={`dateofend`}
                                    dateFormat={"DD.MM.YYYY"}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    type={'dropzone'}
                                    name={`copyofdocuments`}
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