import React, {useEffect, useState} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {get, includes, isEqual, isNil, range, round, sum, find, entries, head, last} from "lodash"
import Title from "../../../../components/ui/title";
import {useGetAllQuery} from "../../../../hooks/api";
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
import {INSURANCE_OBJECT_TYPES, PERSON_TYPE} from "../../../../constants";
import ReactJson from "react-json-view";

const StepTwo = ({id = null, ...props}) => {
    const {t} = useTranslation()
    const [diff, setDiff] = useState({accruedinsurancepremium: 0, paidinsurancepremium: 0})
    const [schedule, setSchedule] = useState([])
    const [checkedAll, setCheckedAll] = useState(false)
    const [openObjectModal, setOpenObjectModal] = useState(false)
    const [fields, setFields] = useState({riskOptions: []})
    const [riskFields, setRiskFields] = useState([])
    const [_fields, _setFields] = useState({})
    const [_modalFields, _setModalFields] = useState({})
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
            insurancepremium,
            insurancerate,
            suminsured,
            startofinsurance,
            ...rest
        } = data;
        setAgreement({
            ...rest,
            objectOfInsurance: objects
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

    let {data: payments} = useGetAllQuery({key: KEYS.paymentcurrency, url: `${URLS.paymentCurrency}/list`})
    payments = getSelectOptionsListFromData(get(payments, `data.data`, []), '_id', 'name')


    let {data: classes} = useGetAllQuery({key: KEYS.classes, url: `${URLS.insuranceClass}/list`})
    const classOptions = getSelectOptionsListFromData(get(classes, `data.data`, []), '_id', 'name')

    let {data: risks} = useGetAllQuery({key: KEYS.risk, url: `${URLS.risk}/list`})
    let risksOptions = getSelectOptionsListFromData(get(risks, `data.data`, []), '_id', 'name')


    let {data: franchises} = useGetAllQuery({key: KEYS.typeoffranchise, url: `${URLS.typeoffranchise}/list`})
    franchises = getSelectOptionsListFromData(get(franchises, `data.data`, []), '_id', 'name')

    let {data: baseFranchises} = useGetAllQuery({key: KEYS.baseoffranchise, url: `${URLS.baseoffranchise}/list`})
    baseFranchises = getSelectOptionsListFromData(get(baseFranchises, `data.data`, []), '_id', 'name')

    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries, url: `${URLS.countries}/list`
    })
    const countryList = getSelectOptionsListFromData(get(country, `data.data`, []), '_id', 'name')

    const {data: residentTypes} = useGetAllQuery({
        key: KEYS.residentTypes, url: `${URLS.residentTypes}/list`
    })
    const residentTypeList = getSelectOptionsListFromData(get(residentTypes, `data.data`, []), '_id', 'name')

    const {data: region, isLoading: isLoadingRegion} = useGetAllQuery({
        key: KEYS.regions, url: `${URLS.regions}/list`
    })
    const regionList = getSelectOptionsListFromData(get(region, `data.data`, []), '_id', 'name')

    const {data: district} = useGetAllQuery({
        key: [KEYS.districts, get(_modalFields, 'objectOfInsurance.region')],
        url: `${URLS.districts}/list`,
        params: {
            params: {
                region: get(_modalFields, 'objectOfInsurance.region')
            }
        },
        enabled: !!(get(_modalFields, 'objectOfInsurance.region'))
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.data`, []), '_id', 'name')

    const {data: genders} = useGetAllQuery({
        key: KEYS.genders, url: `${URLS.genders}/list`
    })
    const genderList = getSelectOptionsListFromData(get(genders, `data.data`, []), '_id', 'name')

    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: `${URLS.ownershipForms}/list`
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.data`, []), '_id', 'name')

    const {data: vehicleType} = useGetAllQuery({
        key: KEYS.vehicleType, url: `${URLS.vehicleType}/list`
    })
    const vehicleTypeList = getSelectOptionsListFromData(get(vehicleType, `data.data`, []), '_id', 'name')

    const {data: propertyRightType} = useGetAllQuery({
        key: KEYS.vehicleType, url: `${URLS.propertyRightType}/list`
    })
    const propertyRightTypeList = getSelectOptionsListFromData(get(propertyRightType, `data.data`, []), '_id', 'name')

    const {data: propertyType} = useGetAllQuery({
        key: KEYS.vehicleType, url: `${URLS.propertyType}/list`
    })
    const propertyTypeList = getSelectOptionsListFromData(get(propertyType, `data.data`, []), '_id', 'name')

    const {data: agriculturalType} = useGetAllQuery({
        key: KEYS.vehicleType, url: `${URLS.agriculturalType}/list`
    })
    const agriculturalTypeList = getSelectOptionsListFromData(get(agriculturalType, `data.data`, []), '_id', 'name')

    const {data: measurementType} = useGetAllQuery({
        key: KEYS.vehicleType, url: `${URLS.measurementType}/list`
    })
    const measurementTypeList = getSelectOptionsListFromData(get(measurementType, `data.data`, []), '_id', 'name')


    const setFieldValue = (value, name = "") => {

        if (includes('riskOptions', name) || includes(name, 'franchise')) {
            setFields(prev => ({...prev, [name]: value}));
        }

        _setFields(prev => ({...prev, [name]: value}))

    }


    const findItem = (list = [], id = null) => {
        return find(list, l => isEqual(get(l, "_id"), id))
    }


    const setGraphic = () => {
        setSchedule([])
        let now = new Date();
        for (let i = 12; i > 0; i--) {
            let newdate = now.setMonth(now.getMonth() - 1);
            setSchedule(prev => [...prev, {
                date: formatDate(newdate),
                count: round(Math.abs(get(_fields, 'accruedInsurancePremium', 0) - get(_fields, 'paidInsurancePremium', 0)) / 12, 2)
            }])
        }

    }

    useEffect(() => {
        if (!isNil(get(agreement, 'product.risk', []))) {
            setRiskFields(get(agreement, 'product.risk', []).map(_r => ({
                ..._r,
                startDate: new Date(),
                endDate: new Date(),
                insurancePremium: 0,
                insuranceRate: 0,
                insuranceSum: 0
            })))
        }
    }, [agreement])
    console.log('agreement', agreement)
    console.log('risks', risks)
    console.log('riskFields', riskFields)
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
                                                          thead={['Object JSON', 'Actions']}>
                                {objects?.length > 0 && objects.map((obj, i) => <tr key={get(obj, 'id', i)}>
                                    <td style={{width: 500}}>
                                        {obj && <ReactJson collapsed src={obj}/>}
                                    </td>
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
                                   thead={['Risk', 'startdate', 'enddate', 'insurancepremium', 'insurancerate', 'suminsured']}>
                                {riskFields.map((item, i) => <tr key={i + 1}>
                                    <td>
                                        <Field
                                            className={'w-250'}
                                            name={`riskDetails[${i}].risk`}
                                            type={'select'}
                                            property={{
                                                hideLabel: true,
                                            }}
                                            options={risksOptions}
                                            defaultValue={get(findItem(get(risks, 'data.data'), get(item, "_id")), '_id')}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            property={{
                                                hideLabel: true,
                                            }}
                                            name={`riskDetails[${i}].startDate`} type={'datepicker'}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            property={{
                                                hideLabel: true,
                                            }}
                                            name={`riskDetails[${i}].endDate`} type={'datepicker'}
                                        />
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field

                                                name={`riskDetails[${i}].insurancePremium`}
                                                type={'number-format-input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'ввод значения',
                                                }}
                                                defaultValue={round((((dayjs(get(_fields, `riskDetails[${i}].endDate`)).diff(get(_fields, `riskDetails[${i}].startDate`), 'day') + 1) / 365) * get(_fields, `riskDetails[${i}].insuranceSum`, 0) * get(_fields, `riskId[${i}].insuranceRate`, 0) / 100), 2)}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'flex-end'}>
                                            <Field
                                                name={`riskDetails[${i}].insuranceRate`}
                                                type={'number-format-input'}
                                                property={{hideLabel: true, placeholder: 'insuranceRate', suffix: ' %'}}
                                                defaultValue={round((365 * 100 * get(_fields, `riskDetails[${i}].insurancePremium`, 0) / ((dayjs(get(_fields, `riskDetails[${i}].endDate`)).diff(get(_fields, `riskDetails[${i}].startDate`), 'day') + 1) * get(_fields, `riskDetails[${i}].insuranceSum`, 0))), 2)}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                name={`riskDetails[${i}].insuranceSum`}
                                                type={'number-format-input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'ввод значения',
                                                }}
                                                defaultValue={get(agreement, `riskDetails[${i}].insuranceSum`, 0)}
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
                                        name={`totalInsuranceSum`}
                                        type={'number-format-input'}
                                        label={'Общая страховая сумма'}
                                        property={{
                                            placeholder: 'ввод значения',
                                            disabled: true
                                        }}
                                        defaultValue={sum(range(0, riskFields?.length).map(i => get(_fields, `riskDetails[${i}].insuranceSum`)))}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        className={'mr-16'}
                                        name={`totalInsurancePremium`}
                                        type={'number-format-input'}
                                        label={'Общая страховая премия'}
                                        defaultValue={sum(range(0, riskFields?.length).map(i => get(_fields, `riskDetails[${i}].insurancePremium`)))}
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
                                        name={`accruedInsurancePremium`}
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
                                        name={`paidInsurancePremium`}
                                        type={'number-format-input'}
                                        label={'Оплаченная страховая премия'}
                                        property={{
                                            placeholder: 'ввод значения',
                                        }}
                                    />
                                </Col>
                                {get(agreement, 'product.allowForeignCurrency', false) && <Col xs={3}>
                                    <Field
                                        options={payments}
                                        property={{isColumn: true}}
                                        label={'Валюта оплаты'}
                                        type={'checkbox'}
                                        name={'paymentCurrency'}
                                        defaultValue={get(agreement, 'paymentCurrency')}
                                    />
                                </Col>}
                                <Col xs={9}>
                                    <Row>
                                        <Col xs={12}>
                                            <Flex align={'flex-end'} justify={'space-between'}>
                                                <Field
                                                    label={t('Комиссия за дубликат')}
                                                    type={'switch'}
                                                    name={'duplicateFee.hasDuplicateFee'}
                                                    params={{required: true}}
                                                />
                                                {get(_fields, 'duplicateFee.hasDuplicateFee', false) && <><Field
                                                    name={`duplicateFee.countOfFee`}
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
                                                        name={'duplicateFee.typeOfFee'}
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
                                                    name={'demonstrableCosts.hasDemonstrableCosts'}
                                                    params={{required: true}}
                                                />
                                                {get(_fields, 'demonstrableCosts.hasDemonstrableCosts', false) && <>
                                                    <Field
                                                        name={`demonstrableCosts.countOfFee`}
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
                                                        name={'demonstrableCosts.typeOfFee'}
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
                                            name={`paymentSchedule[${i}].date`}
                                            type={'datepicker'}
                                            defaultValue={get(s, 'date')}
                                            disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            name={`paymentSchedule[${i}].count`}
                                            type={'number-format-input'}
                                            property={{
                                                placeholder: 'ввод значения',
                                                hideLabel: true,
                                                disabled: true
                                            }}
                                            defaultValue={get(s, 'count')}
                                        />
                                    </td>
                                </tr>)}
                                <tr>
                                    <td>
                                        <strong>Итого сумма:</strong>
                                    </td>
                                    <td><strong><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                              value={Math.abs(get(_fields, 'accruedInsurancePremium', 0) - get(_fields, 'paidInsurancePremium', 0))}/></strong>
                                    </td>
                                </tr>
                            </Table>}
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}><Title>Франшиза</Title></Col>
                    </Row>
                    <Row className={'mb-25'}>
                        {get(agreement, 'product.risk', []).length > 0 && <Col xs={12} className={'horizontal-scroll'}>
                            <hr/>
                            <Table hideThead={false}
                                   thead={['Страховой риск', 'Имеет франшизу', 'Строго фиксирована', 'Введите фиксированное значение', 'Укажите тип франшизы', 'Укажите базу франшизы', 'Франшиза']}>
                                {get(agreement, 'product.risk', []).map((item, i) => <tr key={i + 1}>
                                    <td>
                                        <Field
                                            className={'w-250'}
                                            name={`franchise[${i}].risk`}
                                            type={'select'}
                                            property={{hideLabel: true}}
                                            options={risksOptions}
                                            defaultValue={get(findItem(get(risks, 'data.data'), get(item, '_id')), '_id')}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                type={'switch'}
                                                name={`franchise[${i}].hasFranchise`}
                                                defaultValue={get(agreement, `franchise[${i}].hasFranchise`, false)}
                                                property={{hideLabel: true}}
                                                disabled={!!!(get(agreement, `product.allowChangeFranchise`, false))}

                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                type={'switch'}
                                                name={`franchise[${i}].isFixed`}
                                                defaultValue={get(agreement, `franchise[${i}].isFixed`, false)}
                                                property={{hideLabel: true}}
                                                disabled={!!!(get(fields, `franchise[${i}].hasFranchise`))}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                name={`franchise[${i}].fixedValue`}
                                                type={'number-format-input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'ввод значения',
                                                    disabled: !!!(get(fields, `franchise[${i}].isFixed`))
                                                }}
                                                defaultValue={get(agreement, `franchise[${i}].fixedValue`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                    <td className={'w-250'}>
                                        <Flex justify={'center'}>
                                            <Field
                                                className={'w-250'}
                                                name={`franchise[${i}].franchiseType`}
                                                type={'select'}
                                                property={{hideLabel: true}}
                                                options={franchises}
                                                isDisabled={!!!(get(fields, `franchise[${i}].hasFranchise`))}
                                                defaultValue={get(agreement, `franchise[${i}].franchiseType`)}
                                            />
                                        </Flex>
                                    </td>
                                    <td className={'w-250'}>
                                        <Flex justify={'center'}>
                                            <Field
                                                className={'w-250'}
                                                name={`franchise[${i}].franchiseBase`}
                                                type={'select'}
                                                property={{hideLabel: true}}
                                                options={baseFranchises}
                                                isDisabled={!!!(get(fields, `franchise[${i}].hasFranchise`))}
                                                defaultValue={get(agreement, `franchise[${i}].franchiseBase`)}
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
                                                    disabled: !(get(fields, `franchise[${i}].hasFranchise`) && !get(fields, `franchise[${i}].isFixed`))
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
                    <Form getValueFromField={(value, name) => _setModalFields(prev => ({...prev, [name]: value}))}
                          formRequest={({data}) => {
                              addObjects({...data, id: objects.length});
                              setOpenObjectModal(false)
                          }}
                          footer={<><Button>{t("Add")}</Button></>}>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Field
                                    options={entries(INSURANCE_OBJECT_TYPES).map(_item => ({
                                        value: head(_item),
                                        label: t(last(_item))
                                    }))}
                                    type={'select'}
                                    name={`objectOfInsurance.type`}
                                    label={t('Object type')}
                                    params={{required: true}}
                                />
                            </Col>
                            {
                                isEqual(get(_modalFields, 'objectOfInsurance.type'), INSURANCE_OBJECT_TYPES.BORROWER) && <>
                                    <Col xs={4}>
                                        <Field
                                            options={entries(PERSON_TYPE).map(_item => ({
                                                value: last(_item),
                                                label: t(last(_item))
                                            }))}
                                            type={'select'}
                                            name={`objectOfInsurance.details.type`}
                                            label={t('Person type')}
                                            params={{required: true}}
                                        />
                                    </Col>
                                    {
                                        isEqual(get(_modalFields, 'objectOfInsurance.details.type'), PERSON_TYPE.person) ? <>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       label={'Firstname'}
                                                       type={'input'}
                                                       name={'person.fullName.firstname'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       label={'Lastname'} type={'input'}
                                                       name={'person.fullName.lastname'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       label={'Middlename'}
                                                       type={'input'}
                                                       name={'objectOfInsurance.details.person.fullName.middlename'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       label={'Дата выдачи паспорта'}
                                                       type={'datepicker'}
                                                       name={'objectOfInsurance.details.person.passportData.startDate'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       label={'Кем выдан'}
                                                       type={'input'}
                                                       name={'objectOfInsurance.details.person.passportData.issuedBy'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    fullWidth
                                                    params={{required: true}}
                                                    options={genderList}
                                                    label={'Gender'}
                                                    type={'select'}
                                                    name={'objectOfInsurance.details.person.gender'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={'Passport seria'} params={{required: true}}
                                                       type={'input-mask'} property={{
                                                    placeholder: 'Seria',
                                                    mask: 'aa',
                                                    maskChar: '_'
                                                }}
                                                       name={'objectOfInsurance.details.person.passportData.seria'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={'Passport number'} params={{required: true}}
                                                       type={'input-mask'} property={{
                                                    placeholder: 'Number',
                                                    mask: '9999999',
                                                    maskChar: '_'
                                                }}
                                                       name={'objectOfInsurance.details.person.passportData.number'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={'ПИНФЛ'} type={'input-mask'} property={{
                                                    placeholder: 'ПИНФЛ',
                                                    mask: '99999999999999',
                                                    maskChar: '_'
                                                }}
                                                       name={'objectOfInsurance.details.person.passportData.pinfl'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    params={{
                                                        required: true,
                                                        pattern: {
                                                            value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                                            message: 'Invalid format'
                                                        }
                                                    }}
                                                    label={'Phone'}
                                                    type={'input'}
                                                    property={{placeholder: '998XXXXXXXXX'}}
                                                    name={'objectOfInsurance.details.person.phone'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    label={'Email'}
                                                    type={'input'}
                                                    name={'objectOfInsurance.details.person.email'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    params={{required: true}}
                                                    options={residentTypeList}
                                                    label={'Resident type'}
                                                    type={'select'}
                                                    name={'objectOfInsurance.details.person.residentType'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    noMaxWidth
                                                    params={{required: true}}
                                                    label={'Address'}
                                                    type={'input'}
                                                    name={'objectOfInsurance.details.person.address'}/>
                                            </Col>

                                        </> : <>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       label={'Наименование'} type={'input'}
                                                       name={'objectOfInsurance.details.organization.name'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={'Inn'} params={{required: true}} type={'input-mask'}
                                                       property={{
                                                           placeholder: 'Inn',
                                                           mask: '999999999',
                                                           maskChar: '_'
                                                       }}
                                                       name={'objectOfInsurance.details.organization.inn'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={'Руководитель'} type={'input'}
                                                       name={'objectOfInsurance.details.organization.representativeName'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={'Должность'} type={'input'}
                                                       name={'objectOfInsurance.details.organization.position'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={'Email'} type={'input'}
                                                       name={'objectOfInsurance.details.organization.email'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{
                                                    required: true,
                                                    pattern: {
                                                        value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                                        message: 'Invalid format'
                                                    }
                                                }}
                                                       property={{placeholder: '998XXXXXXXXX'}}
                                                       label={'Телефон'} type={'input'}
                                                       name={'objectOfInsurance.details.organization.phone'}/>
                                            </Col>
                                            <Col xs={4}><Field
                                                label={'Oked'} params={{required: true, valueAsString: true}}
                                                type={'input'}
                                                name={'objectOfInsurance.details.organization.oked'}/></Col>

                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={'Расчетный счет'} type={'input'}
                                                       name={'objectOfInsurance.details.organization.checkingAccount'}/>
                                            </Col>
                                            <Col xs={4}><Field label={'Форма собственности'}
                                                               options={ownershipFormList}
                                                               type={'select'}
                                                               name={'objectOfInsurance.details.organization.ownershipForm'}/></Col>

                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    noMaxWidth
                                                    params={{required: true}}
                                                    label={'Address'}
                                                    type={'input'}
                                                    name={'objectOfInsurance.details.organization.address'}/>
                                            </Col>

                                        </>
                                    }

                                </>
                            }
                            {
                                isEqual(get(_modalFields, 'objectOfInsurance.type'), INSURANCE_OBJECT_TYPES.VEHICLE) && <>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={residentTypeList}
                                            label={'Resident type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.residency'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Регистрационный номер'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.registrationNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Марка ТС'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.carMake'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Модель ТС'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.carModel'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            options={vehicleTypeList}
                                            params={{required: true}}
                                            label={'Vehicle type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.carType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Год выпуска'}
                                            type={'datepicker'}
                                            name={'objectOfInsurance.details.manufactureYear'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Номер кузова'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.bodyNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={'Номер двигателя'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.engineNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true, valueAsNumber: true}}
                                            property={{type: 'number'}}
                                            label={'Грузоподъемность'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoCapacity'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true, valueAsNumber: true}}
                                            property={{type: 'number'}}
                                            label={'Количество мест сидения'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.seatNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Номер тех.паспорта'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.techPassportNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Серия тех.паспорта'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.techPassportSeries'}/>
                                    </Col>
                                </>}
                            {
                                isEqual(get(_modalFields, 'objectOfInsurance.type'), INSURANCE_OBJECT_TYPES.PROPERTY) && <>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            options={propertyRightTypeList}
                                            label={'Property right type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.propertyRightType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={residentTypeList}
                                            label={'Resident type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.ownerResidency'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Кадастровый номер'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cadastralNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Дата кадастрового документа'}
                                            type={'datepicker'}
                                            name={'objectOfInsurance.details.cadastralDocDate'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={propertyTypeList}
                                            label={'Property type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.propertyClassification'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={'Описание имущества'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.propertyDescription'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={'Почтовый индекс'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.postcode'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Адрес имущества'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.address'}/>
                                    </Col>
                                </>}
                            {
                                isEqual(get(_modalFields, 'objectOfInsurance.type'), INSURANCE_OBJECT_TYPES.AGRICULTURE) && <>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={residentTypeList}
                                            label={'Resident type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.ownerResidency'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={agriculturalTypeList}
                                            label={'Agricultural type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.agriculturalObjectType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Наименование объекта'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.objectName'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={'Описание объекта'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.objectDescription'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={measurementTypeList}
                                            label={'Measurement type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.measurementType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Объем страхования'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.insuranceVolume'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={'Почтовый индекс'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.postcode'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Адрес имущества'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.address'}/>
                                    </Col>
                                </>}
                            {
                                isEqual(get(_modalFields, 'objectOfInsurance.type'), INSURANCE_OBJECT_TYPES.OTHEROBJECT) && <>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={residentTypeList}
                                            label={'Resident type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.ownerResidency'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={agriculturalTypeList}
                                            label={'Agricultural type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.agriculturalObjectType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Наименование объекта'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.objectName'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={'Описание объекта'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.objectDescription'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={measurementTypeList}
                                            label={'Measurement type'}
                                            type={'select'}
                                            name={'objectOfInsurance.details.measurementType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Объем страхования'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.insuranceVolume'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={'Почтовый индекс'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.postcode'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={'Адрес имущества'}
                                            type={'input'}
                                            name={'objectOfInsurance.details.address'}/>
                                    </Col>
                                </>}
                            <Col xs={4}>
                                <Field
                                    type={'number-format-input'}
                                    name={`objectOfInsurance.quantity`}
                                    label={t('Quantity')}
                                    params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    options={countryList}
                                    defaultValue={210}
                                    type={'select'}
                                    name={`objectOfInsurance.country`}
                                    label={t('Country')}
                                    params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    options={regionList}
                                    type={'select'}
                                    name={`objectOfInsurance.region`}
                                    label={t('Region')}
                                    params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    options={districtList}
                                    type={'select'}
                                    name={`objectOfInsurance.district`}
                                    label={t('District')}
                                    params={{required: true}}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </Col>
        </Row>
    );
};

export default StepTwo;