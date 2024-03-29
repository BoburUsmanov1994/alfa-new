import React, {useState} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {get, head, includes} from "lodash"
import {useGetAllQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";

const StepThree = ({...props}) => {
    const [show, setShow] = useState({
        Isfixedpolicyholder: false,
        Isfixedbeneficiary: false,
        Isfixedpremium: false,
        Isfixedrate: false,
        Isfixedsuminsured: false,
        Isfixedfee: false,
        Isfixedpreventivemeasures: false
    })
    const setProduct = useSettingsStore(state => get(state, 'setProduct', () => {
    }))
    const resetProduct = useSettingsStore(state => get(state, 'resetProduct', () => {
    }))
    const resetRiskList = useSettingsStore(state => get(state, 'resetRiskList', []))

    const product = useSettingsStore(state => get(state, 'product', {}))

    const nextStep = ({data}) => {
        setProduct(data);
        props.nextStep();
    }

    const prevStep = () => {
        props.previousStep();
    }

    const reset = () => {
        resetProduct();
        resetRiskList();
        props.firstStep();
    }

    let {data: clients} = useGetAllQuery({key: KEYS.agents, url: `${URLS.clients}/list`})
    clients = getSelectOptionsListFromData(get(clients, `data`, []), '_id', ['person.fullName.lastname','person.fullName.firstname','organization.name'])

    let {data: policyformats} = useGetAllQuery({key: KEYS.policyformats, url: `${URLS.policyFormat}/list`})
    policyformats = getSelectOptionsListFromData(get(policyformats, `data`, []), '_id', 'name')

    let {data: refunds} = useGetAllQuery({key: KEYS.typeofrefund, url: `${URLS.typeofrefund}/list`})
    refunds = getSelectOptionsListFromData(get(refunds, `data`, []), '_id', 'name')

    let {data: claimSettlements} = useGetAllQuery({key: KEYS.typeofclaimsettlement, url: `${URLS.claimSettlement}/list`})
    claimSettlements = getSelectOptionsListFromData(get(claimSettlements, `data`, []), '_id', 'name')

    let {data: payments} = useGetAllQuery({key: KEYS.typeofpayment, url: `${URLS.typeofpayment}/list`})
    payments = getSelectOptionsListFromData(get(payments, `data`, []), '_id', 'name')

    let {data: polices} = useGetAllQuery({key: KEYS.typeofpolice, url: `${URLS.policyType}/list`})
    polices = getSelectOptionsListFromData(get(polices, `data`, []), '_id', 'name')


    const showField = (value, name) => {
        if (includes(['hasFixedPolicyHolder', 'hasFixedBeneficary', 'hasFixedPremium', 'hasFixedRate', 'hasFixedInsuranceSum', 'hasFixedFee', 'hasFixedPreventiveMeasures'], name)) {
            setShow(prev => ({...prev, [name]: value}))
        }
    }
    return (
        <Row>
            <Col xs={12}>
                <StepNav step={3}/>
            </Col>
            <Col xs={12}>
                <Form formRequest={nextStep} getValueFromField={showField}>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированного страхователя'}
                                   type={'switch'}
                                   name={'hasFixedPolicyHolder'}
                                   defaultValue={get(product,'hasFixedPolicyHolder',false)}
                                   property={{hasRequiredLabel: true}}
                            />
                            {get(show, 'hasFixedPolicyHolder', false) &&
                                <Field label={'Имеет фиксированного страхователя'}
                                       type={'select'}
                                       name={'fixedPolicyHolder'}
                                       property={{hideLabel: true}}
                                       options={clients}
                                       defaultValue={get(product,'fixedPolicyHolder')}
                                />}
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет  выгодоприобретеля'}
                                   type={'switch'}
                                   name={'hasBeneficary'}
                                   defaultValue={get(product,'hasBeneficary',false)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет  фиксированного выгодоприобретеля'}
                                   type={'switch'}
                                   name={'hasFixedBeneficary'}
                                   defaultValue={get(product,'hasFixedBeneficary',false)}

                            />
                            {get(show, 'hasFixedBeneficary', false) &&
                                <Field label={'Имеет фиксированного страхователя'}
                                       type={'select'}
                                       name={'fixedBeneficary'}
                                       property={{hideLabel: true}}
                                       options={clients}
                                       defaultValue={get(product,'fixedBeneficary')}
                                />}
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированную премию'}
                                   type={'switch'}
                                   name={'hasFixedPremium'}
                                   defaultValue={get(product,'hasFixedPremium',false)}
                            />
                            {get(show, 'hasFixedPremium', false) && <Field
                                type={'number-format-input'}
                                name={'fixedPremium'}
                                property={{hideLabel: true}}
                                defaultValue={get(product,'fixedPremium',0)}
                            />}
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет диапазон ставок'}
                                   type={'switch'}
                                   name={'hasBettingRange'}
                                   defaultValue={get(product,'hasBettingRange',false)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированную ставку'}
                                   type={'switch'}
                                   name={'hasFixedRate'}
                                   defaultValue={get(product,'hasFixedRate',false)}
                            />
                            {get(show, 'hasFixedRate', false) && <Field
                                type={'number-format-input'}
                                name={'fixedRate'}
                                property={{hideLabel: true, suffix: " %"}}
                                defaultValue={get(product,'fixedRate',0)}
                            />}
                        </Col>
                    </Row>

                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированную страховую сумму'}
                                   type={'switch'}
                                   name={'hasFixedInsuranceSum'}
                                   defaultValue={get(product,'hasFixedInsuranceSum',false)}
                            />
                            {get(show, 'hasFixedInsuranceSum', false) && <Field
                                type={'number-format-input'}
                                name={'fixedInsuranceSum'}
                                property={{hideLabel: true}}
                                defaultValue={get(product,'fixedInsuranceSum',0)}
                            />}
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированную комиссию'}
                                   type={'switch'}
                                   name={'hasFixedFee'}
                                   defaultValue={get(product,'hasFixedFee',false)}
                            />
                            {get(show, 'hasFixedFee', false) && <Field
                                type={'number-format-input'}
                                name={'fixedFee'}
                                property={{hideLabel: true, suffix: " %"}}
                                defaultValue={get(product,'fixedFee',0)}
                            />}
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированный превентивных мероприятий '}
                                   type={'switch'}
                                   name={'hasFixedPreventiveMeasures'}
                                   defaultValue={get(product,'hasFixedPreventiveMeasures',false)}
                            />
                            {get(show, 'hasFixedPreventiveMeasures', false) && <Field
                                type={'number-format-input'}
                                name={'fixedPreventiveMeasures'}
                                property={{hideLabel: true, suffix: " %"}}
                                defaultValue={get(product,'fixedPreventiveMeasures',0)}
                            />}
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Разрешить полис без оплаты'}
                                   type={'switch'}
                                   name={'allowPolicyWithoutPayment'}
                                   defaultValue={get(product,'allowPolicyWithoutPayment',false)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Разрешить несколько агентов'}
                                   type={'switch'}
                                   name={'allowMultipleAgents'}
                                   defaultValue={get(product,'allowMultipleAgents',false)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Разрешить изменение франшизы'}
                                   type={'switch'}
                                   name={'allowChangeFranchise'}
                                   defaultValue={get(product,'allowChangeFranchise',false)}
                            />
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Разрешать иностранную валюту'}
                                   type={'switch'}
                                   name={'allowForeignCurrency'}
                                   defaultValue={get(product,'allowForeignCurrency',false)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Форматы полисов'}
                                   type={'select'}
                                   name={'policyFormat'}
                                   options={policyformats}
                                   defaultValue={get(product,'policyFormat')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Вид урегулирования претензии'}
                                   type={'select'}
                                   name={'claimSettlementType'}
                                   options={claimSettlements}
                                   defaultValue={get(product,'claimSettlementType')}
                            />
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Тип возмещения'}
                                   type={'radio-group'}
                                   name={'refundType'}
                                   options={refunds}
                                   defaultValue={get(product,'refundType',get(head(refunds),'value'))}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                options={payments}
                                label={'Тип оплаты'}
                                type={'checkbox'}
                                name={'paymentType'}
                                defaultValue={get(product,'paymentType')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                params={{required:true}}
                                options={polices}
                                label={'Тип полиса'}
                                type={'checkbox'}
                                name={'policyTypes'}
                                property={{hasRequiredLabel:true}}
                                defaultValue={get(product,'policyTypes')}
                            />
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field
                                label={'Укажите минимальный срок страхования в днях'}
                                type={'number-format-input'}
                                name={'minimumInsuranceTerm'}
                                defaultValue={get(product,'minimumInsuranceTerm',0)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                label={'Укажите максимальный срок страхования в днях'}
                                type={'number-format-input'}
                                name={'maximumInsuranceTerm'}
                                defaultValue={get(product,'maximumInsuranceTerm',0)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} className={'mt-32'}>
                            <Button className={'mr-16'} type={'button'} onClick={reset} danger outlined
                                    back>Отменить</Button>
                            <Button dark className={'mr-16'} type={'button'} onClick={prevStep}
                                    outlined>Назад</Button>
                            <Button type={'submit'} success>Продолжить</Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    );
};

export default StepThree;