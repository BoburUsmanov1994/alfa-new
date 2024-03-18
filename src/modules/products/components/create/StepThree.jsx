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

    let {data: agents} = useGetAllQuery({key: KEYS.agents, url: URLS.agents})
    agents = getSelectOptionsListFromData(get(agents, `data.data`, []), '_id', 'inn')

    let {data: policyformats} = useGetAllQuery({key: KEYS.policyformats, url: URLS.policyformats})
    policyformats = getSelectOptionsListFromData(get(policyformats, `data.data`, []), '_id', 'name')

    let {data: refunds} = useGetAllQuery({key: KEYS.typeofrefund, url: URLS.typeofrefund})
    refunds = getSelectOptionsListFromData(get(refunds, `data.data`, []), '_id', 'name')

    let {data: claimSettlements} = useGetAllQuery({key: KEYS.typeofclaimsettlement, url: URLS.typeofclaimsettlement})
    claimSettlements = getSelectOptionsListFromData(get(claimSettlements, `data.data`, []), '_id', 'name')

    let {data: payments} = useGetAllQuery({key: KEYS.typeofpayment, url: URLS.typeofpayment})
    payments = getSelectOptionsListFromData(get(payments, `data.data`, []), '_id', 'name')

    let {data: polices} = useGetAllQuery({key: KEYS.typeofpolice, url: URLS.typeofpolice})
    polices = getSelectOptionsListFromData(get(polices, `data.data`, []), '_id', 'name')


    const showField = (value, name) => {
        if (includes(['Isfixedpolicyholder', 'Isfixedbeneficiary', 'Isfixedpremium', 'Isfixedrate', 'Isfixedsuminsured', 'Isfixedfee', 'Isfixedpreventivemeasures'], name)) {
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
                                   name={'Isfixedpolicyholder'}
                                   defaultValue={get(product,'Isfixedpolicyholder',false)}
                                   property={{hasRequiredLabel: true}}
                            />
                            {get(show, 'Isfixedpolicyholder', false) &&
                                <Field label={'Имеет фиксированного страхователя'}
                                       type={'select'}
                                       name={'fixedpolicyholder'}
                                       property={{hideLabel: true}}
                                       options={agents}
                                       defaultValue={get(product,'fixedpolicyholder')}
                                />}
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет  выгодоприобретеля'}
                                   type={'switch'}
                                   name={'Isbeneficiary'}
                                   defaultValue={get(product,'Isbeneficiary',false)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет  фиксированного выгодоприобретеля'}
                                   type={'switch'}
                                   name={'Isfixedbeneficiary'}
                                   defaultValue={get(product,'Isfixedbeneficiary',false)}

                            />
                            {get(show, 'Isfixedbeneficiary', false) &&
                                <Field label={'Имеет фиксированного страхователя'}
                                       type={'select'}
                                       name={'fixedbeneficiary'}
                                       property={{hideLabel: true}}
                                       options={agents}
                                       defaultValue={get(product,'fixedbeneficiary')}
                                />}
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированную премию'}
                                   type={'switch'}
                                   name={'Isfixedpremium'}
                                   defaultValue={get(product,'Isfixedpremium',false)}
                            />
                            {get(show, 'Isfixedpremium', false) && <Field
                                type={'number-format-input'}
                                name={'fixedpremium'}
                                property={{hideLabel: true}}
                                defaultValue={get(product,'fixedpremium',0)}
                            />}
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет диапазон ставок'}
                                   type={'switch'}
                                   name={'Isbettingrange'}
                                   defaultValue={get(product,'Isbettingrange',false)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированную ставку'}
                                   type={'switch'}
                                   name={'Isfixedrate'}
                                   defaultValue={get(product,'Isfixedrate',false)}
                            />
                            {get(show, 'Isfixedrate', false) && <Field
                                type={'number-format-input'}
                                name={'fixedrate'}
                                property={{hideLabel: true, suffix: " %"}}
                                defaultValue={get(product,'fixedrate',0)}
                            />}
                        </Col>
                    </Row>

                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированную страховую сумму'}
                                   type={'switch'}
                                   name={'Isfixedsuminsured'}
                                   defaultValue={get(product,'Isfixedsuminsured',false)}
                            />
                            {get(show, 'Isfixedsuminsured', false) && <Field
                                type={'number-format-input'}
                                name={'fixedsuminsured'}
                                property={{hideLabel: true}}
                                defaultValue={get(product,'fixedsuminsured',0)}
                            />}
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированную комиссию'}
                                   type={'switch'}
                                   name={'Isfixedfee'}
                                   defaultValue={get(product,'Isfixedfee',false)}
                            />
                            {get(show, 'Isfixedfee', false) && <Field
                                type={'number-format-input'}
                                name={'fixedfee'}
                                property={{hideLabel: true, suffix: " %"}}
                                defaultValue={get(product,'fixedfee',0)}
                            />}
                        </Col>
                        <Col xs={4}>
                            <Field label={'Имеет фиксированный превентивных мероприятий '}
                                   type={'switch'}
                                   name={'Isfixedpreventivemeasures'}
                                   defaultValue={get(product,'Isfixedpreventivemeasures',false)}
                            />
                            {get(show, 'Isfixedpreventivemeasures', false) && <Field
                                type={'number-format-input'}
                                name={'fixedpreventivemeasures'}
                                property={{hideLabel: true, suffix: " %"}}
                                defaultValue={get(product,'fixedpreventivemeasures',0)}
                            />}
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Разрешить полис без оплаты'}
                                   type={'switch'}
                                   name={'Ispolicywithoutpayment'}
                                   defaultValue={get(product,'Ispolicywithoutpayment',false)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Разрешить несколько агентов'}
                                   type={'switch'}
                                   name={'Ismultipleagents'}
                                   defaultValue={get(product,'Ismultipleagents',false)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Разрешить изменение франшизы'}
                                   type={'switch'}
                                   name={'Isfranchisechange'}
                                   defaultValue={get(product,'Isfranchisechange',false)}
                            />
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Разрешать иностранную валюту'}
                                   type={'switch'}
                                   name={'Isforeigncurrency'}
                                   defaultValue={get(product,'Isforeigncurrency',false)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Форматы полисов'}
                                   type={'select'}
                                   name={'policyformatId'}
                                   options={policyformats}
                                   defaultValue={get(product,'policyformatId')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={'Вид урегулирования претензии'}
                                   type={'select'}
                                   name={'typeofclaimsettlement'}
                                   options={claimSettlements}
                                   defaultValue={get(product,'typeofclaimsettlement')}
                            />
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field label={'Тип возмещения'}
                                   type={'radio-group'}
                                   name={'typeofrefund'}
                                   options={refunds}
                                   defaultValue={get(product,'typeofrefund',get(head(refunds),'value'))}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                options={payments}
                                label={'Тип оплаты'}
                                type={'checkbox'}
                                name={'typeofpayment'}
                                defaultValue={get(product,'typeofpayment')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                options={polices}
                                label={'Тип полиса'}
                                type={'checkbox'}
                                name={'typeofpolice'}
                                defaultValue={get(product,'typeofpolice')}
                            />
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={4}>
                            <Field
                                label={'Укажите минимальный срок страхования в днях'}
                                type={'number-format-input'}
                                name={'minimumterminsurance'}
                                defaultValue={get(product,'minimumterminsurance',0)}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                label={'Укажите максимальный срок страхования в днях'}
                                type={'number-format-input'}
                                name={'maxterminsurance'}
                                defaultValue={get(product,'maxterminsurance',0)}
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