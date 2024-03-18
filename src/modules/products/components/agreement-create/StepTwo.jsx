import React, {useEffect, useState} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {chain, get, includes, isEqual, isNil, range, round, sum, update, updateWith} from "lodash"
import Title from "../../../../components/ui/title";
import {useGetAllQuery, useGetOneQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {formatDate, getSelectOptionsListFromData} from "../../../../utils";
import Table from "../../../../components/table";
import Flex from "../../../../components/flex";
import {Trash2} from "react-feather";
import Checkbox from "rc-checkbox";
import 'rc-checkbox/assets/index.css';
import {useTranslation} from "react-i18next";
import Modal from "../../../../components/modal";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";

const StepTwo = ({id = null, ...props}) => {
    const {t} = useTranslation()
    const [show, setShow] = useState({
        duplicatefee: {Isduplicatefee: false},
        demonstrablecosts: {Isdemonstrablecosts: false}
    })
    const [diff, setDiff] = useState({accruedinsurancepremium: 0, paidinsurancepremium: 0})
    const [schedule, setSchedule] = useState([])
    const [checkedAll, setCheckedAll] = useState(false)
    const [openObjectModal, setOpenObjectModal] = useState(false)
    const [fields, setFields] = useState({riskOptions: []})
    const [riskFields, setRiskFields] = useState([])
    const [objectType, _setObjectType] = useState(null)
    const [_fields, _setFields] = useState({})
    const setAgreement = useSettingsStore(state => get(state, 'setAgreement', () => {
    }))
    const addObjects = useSettingsStore(state => get(state, 'addObjects', () => {
    }))
    const resetAgreement = useSettingsStore(state => get(state, 'resetAgreement', () => {
    }))
    const resetRiskList = useSettingsStore(state => get(state, 'resetRiskList', []))

    const removeObjects = useSettingsStore(state => get(state, 'removeObjects', () => {
    }))

    const agreement = useSettingsStore(state => get(state, 'agreement', {}))

    const objects = useSettingsStore(state => get(state, 'objects', []))

    const nextStep = ({data}) => {
        let {
            riskOptions,
            agentlist,
            Isagreement,
            limitofagreement,
            tariffperclasses,
            objectofinsurance,
            ...rest
        } = data;
        setAgreement({
            ...rest,
            objectofinsurance: objectofinsurance?.map((_item, i) => ({..._item, details: {...objects?.[i]}}))
        });
        props.nextStep();
    }

    const prevStep = () => {
        props.previousStep();
    }

    const reset = () => {
        resetAgreement();
        resetRiskList();
        props.firstStep();
    }

    let {data: payments} = useGetAllQuery({key: KEYS.paymentcurrency, url: URLS.paymentcurrency})
    payments = getSelectOptionsListFromData(get(payments, `data.data`, []), '_id', 'name')


    let {data: classes} = useGetAllQuery({key: KEYS.classes, url: URLS.classes})
    const classOptions = getSelectOptionsListFromData(get(classes, `data.data`, []), '_id', 'name')

    let {data: risks} = useGetAllQuery({key: KEYS.risk, url: URLS.risk})
    let risksOptions = getSelectOptionsListFromData(get(risks, `data.data`, []), '_id', 'name')

    let {data: risksGroup} = useGetAllQuery({key: KEYS.typeofrisk, url: URLS.typeofrisk})
    let risksGroupOptions = getSelectOptionsListFromData(get(risksGroup, `data.data`, []), '_id', 'name')

    let {data: franchises} = useGetAllQuery({key: KEYS.typeoffranchise, url: URLS.typeoffranchise})
    franchises = getSelectOptionsListFromData(get(franchises, `data.data`, []), '_id', 'name')

    let {data: baseFranchises} = useGetAllQuery({key: KEYS.baseoffranchise, url: URLS.baseoffranchise})
    baseFranchises = getSelectOptionsListFromData(get(baseFranchises, `data.data`, []), '_id', 'name')

    let {data: typeofobject} = useGetAllQuery({key: KEYS.typeofobject, url: URLS.typeofobject})
    typeofobject = getSelectOptionsListFromData(get(typeofobject, `data.data`, []), '_id', 'name')


    let {data: objectFields} = useGetAllQuery({
        key: [KEYS.objectFields, objectType], url: `${URLS.objectFields}/${objectType}`,
        enabled: !!(objectType)
    })

    const setFieldValue = (value, name = "") => {

        if (includes('riskOptions', name) || includes(name, 'franchise')) {
            setFields(prev => ({...prev, [name]: value}));
        }

        if (includes(['duplicatefee.Isduplicatefee', 'demonstrablecosts.Isdemonstrablecosts'], name)) {
            setShow(prev => ({...prev, [name]: value}))
        }

        if (includes(['accruedinsurancepremium', 'paidinsurancepremium'], name)) {
            setDiff(prev => ({...prev, [name]: value}))
        }
        _setFields(prev=>({...prev,[name]:value}))

    }


    const findItem = (list = [], id = null) => {
        return list.find(l => isEqual(get(l, "_id"), id))
    }


    const setGraphic = () => {
        setSchedule([])
        let now = new Date();
        for (let i = 12; i > 0; i--) {
            let newdate = now.setMonth(now.getMonth() - 1);
            setSchedule(prev => [...prev, {
                scheduledate: formatDate(newdate),
                schedulecount: round(Math.abs(get(diff, 'accruedinsurancepremium', 0) - get(diff, 'paidinsurancepremium', 0)) / 12, 2)
            }])
        }

    }

    useEffect(() => {
        if (!isNil(get(agreement, 'riskId', []))) {
            setRiskFields(get(agreement, 'riskId', []).map(_r => ({
                ..._r,
                startdate: new Date(),
                enddate: new Date(),
                insurancepremium: 0,
                insurancerate: 0,
                suminsured: 0
            })))
        }
    }, [agreement])

   console.log('_fields',_fields)
    return (
        <Row>
            <Col xs={12}>
                <StepNav step={2}
                         steps={['Продукт', 'Обязательства', 'Расторжение', 'Документооборот']}/>
            </Col>
            <Col xs={12}>
                <Form formRequest={nextStep} getValueFromField={setFieldValue}>

                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title> Обязательства по договору</Title>
                        </Col>
                        <Col xs={12} className={'text-right mb-15'}>
                            <Button onClick={() => setOpenObjectModal(true)} type={'button'}>Добавить объект</Button>
                        </Col>
                        <Col xs={12}>
                            <hr/>
                            {objects.length > 0 && <Table hideThead={false}
                                                          thead={['Object type', '', '', '', '', 'Actions']}>
                                {objects?.length > 0 && objects.map((obj, i) => <tr key={get(obj, 'id', i)}>
                                    <td colSpan={5}>
                                        <Field
                                            options={typeofobject}
                                            type={'select'}
                                            name={`objectofinsurance[${i}].typeofobjects`}
                                            defaultValue={get(obj, 'typeofobjects')}
                                            property={{hideLabel: true}}
                                            isDisabled={true}
                                        />
                                    </td>
                                    {/*<td>*/}
                                    {/*    <Field*/}
                                    {/*        options={[]}*/}
                                    {/*        type={'select'}*/}
                                    {/*        name={`objectofinsurance[${i}].objects`}*/}
                                    {/*        defaultValue={get(obj, 'objects')}*/}
                                    {/*        property={{hideLabel: true}}*/}
                                    {/*        isDisabled={true}*/}
                                    {/*    />*/}
                                    {/*</td>*/}
                                    {/*<td>*/}
                                    {/*    <Field*/}
                                    {/*        options={regions}*/}
                                    {/*        type={'select'}*/}
                                    {/*        name={`objectofinsurance[${i}].region`}*/}
                                    {/*        defaultValue={get(obj, 'region')}*/}
                                    {/*        property={{hideLabel: true}}*/}
                                    {/*        isDisabled={true}*/}
                                    {/*    />*/}
                                    {/*</td>*/}
                                    {/*<td>*/}
                                    {/*    <Field*/}
                                    {/*        options={districts}*/}
                                    {/*        type={'select'}*/}
                                    {/*        name={`objectofinsurance[${i}].districtsId`}*/}
                                    {/*        defaultValue={get(obj, 'districtsId')}*/}
                                    {/*        property={{hideLabel: true}}*/}
                                    {/*        isDisabled={true}*/}
                                    {/*    />*/}
                                    {/*</td>*/}
                                    {/*<td>*/}
                                    {/*    <Field type={'number-format-input'}*/}
                                    {/*           name={`objectofinsurance[${i}].quantity`}*/}
                                    {/*           property={{hideLabel: true, disabled: true}}*/}
                                    {/*           defaultValue={get(obj, 'quantity')}*/}
                                    {/*    />*/}
                                    {/*</td>*/}
                                    <td className={'cursor-pointer'}
                                        onClick={() => removeObjects(get(obj, 'id', i))}>
                                        <Trash2 color={'#dc2626'}/>
                                    </td>
                                </tr>)
                                }
                            </Table>}
                        </Col>
                    </Row>
                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title>Страховая сумма по рискам</Title>
                        </Col>
                    </Row>

                    <Row className={'mb-25'}>
                        <Col xs={12}>
                            <Row align={'center'}>
                                <Col xs={1} className={''}>
                                    <Checkbox checked={checkedAll} className={'mr-5'}
                                              onChange={(e) => setCheckedAll(e.target.checked)}/> {t("Select all")}
                                </Col>
                                <Col xs={3}>

                                    <Field
                                        label={'Выберите группу  риска'}
                                        type={'select'}
                                        name={'agentlist'}
                                        options={risksOptions}
                                        defaultValue={get(agreement, 'agentlist')}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field label={'Выберите риск'}
                                           type={'select'}
                                           name={'agentlist'}
                                           options={risksOptions}
                                           defaultValue={get(agreement, 'agentlist')}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field label={'Выберите класс'}
                                           type={'select'}
                                           name={'agentlist'}
                                           options={classOptions}
                                           defaultValue={get(agreement, 'agentlist')}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        {riskFields.length > 0 && <Col xs={12} className={'mb-25 horizontal-scroll'}>
                            <hr/>
                            <Table hideThead={false}
                                   thead={['Risk group', 'Risk', 'Класс', 'startdate', 'enddate', 'insurancepremium', 'insurancerate', 'suminsured']}>
                                {riskFields.map((item, i) => <tr key={i + 1}>
                                    <td>
                                        <Flex>
                                            <Checkbox className={'mr-16'}/>
                                            <Field
                                                className={'w-250'}
                                                name={`riskId[${i}].riskgroup`}
                                                type={'select'}
                                                property={{
                                                    hideLabel: true
                                                }}
                                                options={risksGroupOptions}
                                                defaultValue={get(findItem(get(risksGroup, 'data.data'), get(item, "riskgroup")), '_id')}
                                                isDisabled={true}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Field
                                            className={'w-250'}
                                            name={`riskId[${i}].risk`}
                                            type={'select'}
                                            property={{
                                                hideLabel: true,
                                            }}
                                            options={risksOptions}
                                            defaultValue={get(findItem(get(risks, 'data.data'), get(item, "risk")), '_id')}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            className={'w-250'}
                                            name={`riskId[${i}].classeId`}
                                            type={'select'}
                                            property={{
                                                hideLabel: true,
                                                bgColor: get(findItem(get(classes, 'data.data'), get(item, "_id")), 'color')
                                            }}
                                            options={classOptions}
                                            defaultValue={get(findItem(get(classes, 'data.data'), get(item, "classeId")), '_id')}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            property={{
                                                hideLabel: true,
                                            }}
                                            name={`riskId[${i}].startdate`} type={'datepicker'}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            property={{
                                                hideLabel: true,
                                            }}
                                            name={`riskId[${i}].enddate`} type={'datepicker'}
                                        />
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field

                                                name={`riskId[${i}].insurancepremium`}
                                                type={'number-format-input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'ввод значения',
                                                }}
                                                defaultValue={round((((dayjs(get(_fields, `riskId[${i}].enddate`)).diff(get(_fields, `riskId[${i}].startdate`),'day')+1)/365)*get(_fields, `riskId[${i}].suminsured`, 0)*get(_fields, `riskId[${i}].insurancerate`, 0)/100),2)}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'flex-end'}>
                                            <Field
                                                name={`riskId[${i}].insurancerate`}
                                                type={'number-format-input'}
                                                property={{hideLabel: true, placeholder: 'insurancerate', suffix: ' %'}}
                                                defaultValue={round((365*100*get(_fields, `riskId[${i}].insurancepremium`, 0)/((dayjs(get(_fields, `riskId[${i}].enddate`)).diff(get(_fields, `riskId[${i}].startdate`),'day')+1) * get(_fields, `riskId[${i}].suminsured`, 0))),2)}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                name={`riskId[${i}].suminsured`}
                                                type={'number-format-input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'ввод значения',
                                                }}
                                                defaultValue={get(agreement, `riskId[${i}].suminsured`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                </tr>)}
                            </Table>
                        </Col>}
                        <Col xs={12}>
                            <Row>
                                <Col xs={12}>
                                    <Flex
                                    >
                                        <Field
                                            className={'mr-16'}
                                            property={{
                                                hideLabel: true,
                                            }}
                                            name={'startofinsurance'} type={'datepicker'}
                                            label={'Начало страхового покрытия'}
                                        />
                                        <Field
                                            className={'mr-16'}
                                            property={{
                                                hideLabel: true,
                                            }}
                                            name={'startofinsurance'} type={'datepicker'}
                                            label={'Начало страхового покрытия'}
                                        />
                                        <Field
                                            className={'mr-16'}
                                            name={`insurancepremium`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                        />
                                        <Field
                                            className={'mr-16'}
                                            name={`insurancerate`}
                                            type={'number-format-input'}
                                            property={{hideLabel: true, placeholder: 'insurancerate', suffix: ' %'}}

                                        />
                                        <Field
                                            className={'mr-16'}
                                            name={`suminsured`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                        />
                                        <Button type={'button'} className={'mb-25'}>Применить к
                                            выделенным</Button>
                                    </Flex>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <Row>
                                <Col xs={3}>
                                    <Field
                                        className={'mr-16'}
                                        name={`totalsuminsured`}
                                        type={'number-format-input'}
                                        label={'Общая страховая сумма'}
                                        property={{
                                            placeholder: 'ввод значения',
                                            disabled: true
                                        }}
                                        defaultValue={sum(range(0,riskFields?.length).map(i=>get(_fields,`riskId[${i}].suminsured`)))}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        className={'mr-16'}
                                        name={`totalinsurancepremium`}
                                        type={'number-format-input'}
                                        label={'Общая страховая премия'}
                                        defaultValue={sum(range(0,riskFields?.length).map(i=>get(_fields,`riskId[${i}].insurancepremium`)))}
                                        property={{
                                            placeholder: 'ввод значения',
                                            disabled: true
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}><Title>Страховая премия и взаиморасчеты</Title></Col>
                    </Row>
                    <Row>
                        <Col xs={7}>
                            <Row>
                                <Col xs={6}>
                                    <Field
                                        name={`accruedinsurancepremium`}
                                        type={'number-format-input'}
                                        label={'Начисленная страховая премия'}
                                        property={{
                                            placeholder: 'ввод значения',
                                            disabled: true
                                        }}
                                    />
                                </Col>
                                <Col xs={6}>
                                    <Field
                                        name={`paidinsurancepremium`}
                                        type={'number-format-input'}
                                        label={'Оплаченная страховая премия'}
                                        property={{
                                            placeholder: 'ввод значения',
                                        }}
                                    />
                                </Col>
                                {get(agreement, 'product.Isforeigncurrency', false) && <Col xs={3}>
                                    <Field
                                        options={payments}
                                        property={{isColumn: true}}
                                        label={'Валюта оплаты'}
                                        type={'checkbox'}
                                        name={'paymentcurrency'}
                                        defaultValue={get(agreement, 'paymentcurrency')}
                                    />
                                </Col>}
                                <Col xs={9}>
                                    <Row>
                                        <Col xs={12}>
                                            <Flex align={'flex-end'} justify={'space-between'}>
                                                <Field
                                                    label={t('Комиссия за дубликат')}
                                                    type={'switch'}
                                                    name={'duplicatefee.Isduplicatefee'}
                                                    params={{required: true}}
                                                />
                                                {get(show, 'duplicatefee.Isduplicatefee', false) && <><Field
                                                    name={`duplicatefee.countoffee`}
                                                    type={'number-format-input'}
                                                    property={{
                                                        placeholder: 'ввод значения',
                                                        hideLabel: true
                                                    }}
                                                />
                                                    <Field
                                                        options={[{
                                                            value: 'sum',
                                                            label: 'Сум'
                                                        }, {
                                                            value: '%',
                                                            label: '%'
                                                        }]}
                                                        type={'switch'}
                                                        name={'duplicatefee.typeoffee'}
                                                        params={{required: true}}
                                                        property={{
                                                            hideLabel: true
                                                        }}
                                                    />
                                                </>
                                                }
                                            </Flex>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <Flex align={'flex-end'} justify={'space-between'}>
                                                <Field
                                                    label={t('Доказуемые расходы')}
                                                    type={'switch'}
                                                    name={'demonstrablecosts.Isdemonstrablecosts'}
                                                    params={{required: true}}
                                                />
                                                {get(show, 'demonstrablecosts.Isdemonstrablecosts', false) && <><Field
                                                    name={`demonstrablecosts.countoffee`}
                                                    type={'number-format-input'}
                                                    property={{
                                                        placeholder: 'ввод значения',
                                                        hideLabel: true
                                                    }}
                                                />
                                                    <Field
                                                        options={[
                                                            {
                                                                value: 'sum',
                                                                label: 'Сум'
                                                            },
                                                            {
                                                                value: '%',
                                                                label: '%'
                                                            }
                                                        ]}
                                                        type={'switch'}
                                                        name={'demonstrablecosts.typeoffee'}
                                                        params={{required: true}}
                                                        property={{
                                                            hideLabel: true
                                                        }}
                                                    /></>}
                                            </Flex>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={5}>
                            <Flex className={'w-100'} justify={'space-between'}>
                                <Title sm>График оплаты премии</Title>
                                <Button onClick={setGraphic} type={'button'}>Установить график</Button>
                            </Flex>
                            <hr className={'mt-15'}/>
                            {schedule.length > 0 && <Table hideThead>
                                {schedule.map((s, i) => <tr key={i}>
                                    <td>
                                        <Field
                                            className={'mr-16'}
                                            property={{
                                                hideLabel: true,
                                            }}
                                            name={`premiumpaymentschedule[${i}].scheduledate`}
                                            type={'datepicker'}
                                            defaultValue={get(s, 'scheduledate')}
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            name={`premiumpaymentschedule[${i}].schedulecount`}
                                            type={'number-format-input'}
                                            property={{
                                                placeholder: 'ввод значения',
                                                hideLabel: true,
                                                disabled: true
                                            }}
                                            defaultValue={get(s, 'schedulecount')}
                                        />
                                    </td>
                                </tr>)}
                                <tr>
                                    <td>
                                        <strong>Итого сумма:</strong>
                                    </td>
                                    <td><strong><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                              value={Math.abs(get(diff, 'accruedinsurancepremium', 0) - get(diff, 'paidinsurancepremium', 0))}/></strong>
                                    </td>
                                </tr>
                            </Table>}
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}><Title>Франшиза</Title></Col>
                    </Row>
                    <Row className={'mb-25'}>
                        {get(agreement, 'riskId', []).length > 0 && <Col xs={12} className={'horizontal-scroll'}>
                            <hr/>
                            <Table hideThead={false}
                                   thead={['Страховой риск', 'Имеет франшизу', 'Строго фиксирована', 'Введите фиксированное значение', 'Укажите тип франшизы', 'Укажите базу франшизы', 'Франшиза']}>
                                {get(agreement, 'riskId', []).map((item, i) => <tr key={i + 1}>
                                    <td>
                                        <Field
                                            className={'w-250'}
                                            name={`franchise[${i}].risk`}
                                            type={'select'}
                                            property={{hideLabel: true}}
                                            options={risksOptions}
                                            defaultValue={get(findItem(get(risks, 'data.data'), get(item, 'risk')), '_id')}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                type={'switch'}
                                                name={`franchise[${i}].Isfranchise`}
                                                defaultValue={get(agreement, `franchise[${i}].Isfranchise`, false)}
                                                property={{hideLabel: true}}
                                                disabled={!!!(get(agreement, `product.Isfranchisechange`, false))}

                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                type={'switch'}
                                                name={`franchise[${i}].Isfixedfranchise`}
                                                defaultValue={get(agreement, `franchise[${i}].Isfixedfranchise`, false)}
                                                property={{hideLabel: true}}
                                                disabled={!!!(get(fields, `franchise[${i}].Isfranchise`))}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                name={`franchise[${i}].fixedvalue`}
                                                type={'number-format-input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'ввод значения',
                                                    disabled: !!!(get(fields, `franchise[${i}].Isfixedfranchise`))
                                                }}
                                                defaultValue={get(agreement, `franchise[${i}].fixedvalue`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                    <td className={'w-250'}>
                                        <Flex justify={'center'}>
                                            <Field
                                                className={'w-250'}
                                                name={`franchise[${i}].typeoffranchise`}
                                                type={'select'}
                                                property={{hideLabel: true}}
                                                options={franchises}
                                                isDisabled={!!!(get(fields, `franchise[${i}].Isfranchise`))}
                                                defaultValue={get(agreement, `franchise[${i}].typeoffranchise`)}
                                            />
                                        </Flex>
                                    </td>
                                    <td className={'w-250'}>
                                        <Flex justify={'center'}>
                                            <Field
                                                className={'w-250'}
                                                name={`franchise[${i}].baseoffranchise`}
                                                type={'select'}
                                                property={{hideLabel: true}}
                                                options={baseFranchises}
                                                isDisabled={!!!(get(fields, `franchise[${i}].Isfranchise`))}
                                                defaultValue={get(agreement, `franchise[${i}].baseoffranchise`)}
                                            />
                                        </Flex>
                                    </td>

                                    <td>
                                        <Flex justify={'flex-end'}>
                                            <Field
                                                name={`franchise[${i}].franchise`}
                                                type={'input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'Введите значение',
                                                    disabled: !(get(fields, `franchise[${i}].Isfranchise`) && !get(fields, `franchise[${i}].Isfixedfranchise`))
                                                }}
                                                defaultValue={get(agreement, `franchise[${i}].franchise`, '')}
                                            />
                                        </Flex>
                                    </td>
                                </tr>)}
                            </Table>
                        </Col>}
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
                <Modal title={'Добавить объект'} visible={openObjectModal}
                       hide={setOpenObjectModal}>

                    <Form formRequest={({data}) => {
                        addObjects({...data, id: objects.length});
                        setOpenObjectModal(false)
                    }}
                          footer={<><Button>{t("Add")}</Button></>}>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Field
                                    property={{
                                        onChange: (val) => {
                                            _setObjectType(val)
                                        }
                                    }}
                                    options={typeofobject}
                                    type={'select'}
                                    name={`typeofobjects`}
                                />
                            </Col>
                            {
                                get(objectFields, `data.data`, []).map(_field => <Col xs={4}>
                                    <Field
                                        url={get(_field, 'url', '#')}
                                        label={get(_field, 'label')}
                                        options={[]}
                                        type={get(_field, 'type')}
                                        name={get(_field, 'name')}
                                    />
                                </Col>)
                            }

                        </Row>
                    </Form>
                </Modal>
            </Col>
        </Row>
    );
};

export default StepTwo;