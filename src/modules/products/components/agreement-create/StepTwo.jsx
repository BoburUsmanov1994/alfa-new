import React, {useEffect, useState} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {
    get,
    isEqual,
    isNil,
    range,
    round,
    sum,
    find,
    entries,
    head,
    last,
    values,
    sumBy,
    includes,
    isNumber
} from "lodash"
import Title from "../../../../components/ui/title";
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import Table from "../../../../components/table";
import Flex from "../../../../components/flex";
import {Plus, Trash2} from "react-feather";
import 'rc-checkbox/assets/index.css';
import {useTranslation} from "react-i18next";
import Modal from "../../../../components/modal";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import {INSURANCE_OBJECT_TYPES, PERSON_TYPE} from "../../../../constants";
import {toast} from "react-toastify";
import Label from "../../../../components/ui/label";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {isEmpty} from "@chakra-ui/utils";

const StepTwo = ({id = null, ...props}) => {
    const reactQuillRef = React.useRef();
    const {t} = useTranslation()
    const [count, setCount] = useState(0)
    const [person, setPerson] = useState(null)
    const [organization, setOrganization] = useState(null)
    const [vehicle, setVehicle] = useState(null)
    const [property, setProperty] = useState(null)
    const [openObjectModal, setOpenObjectModal] = useState(false)
    const [riskFields, setRiskFields] = useState([])
    const [_fields, _setFields] = useState({})
    const [_modalFields, _setModalFields] = useState({})
    const [premium, setPremium] = useState({})
    const [insuranceSum, setInsuranceSum] = useState({})
    const [comment, setComment] = useState('');
    const [hasForeignCurrency, setHasForeignCurrency] = useState(false);
    const [exchangeRate, setExchangeRate] = useState(0);
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
        if (sum(range(0, count).map(_index => get(_fields, `paymentSchedule[${_index}].count`))) == round(sum(values(premium)), 2)) {
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
                exchangeRate,
                currencyId,
                totalForeignInsuranceSum,
                totalForeignInsurancePremium,
                hasForeignCurrency,
                ...rest
            } = data;
            setAgreement({
                ...rest,
                objectOfInsurance: objects.map(_item => get(_item, 'objectOfInsurance')),
                comment,
                exchangeRate:hasForeignCurrency ? exchangeRate : undefined,
                currencyId:hasForeignCurrency ? currencyId : undefined,
                totalForeignInsuranceSum:hasForeignCurrency ? totalForeignInsuranceSum : undefined,
                totalForeignInsurancePremium:hasForeignCurrency ? totalForeignInsurancePremium : undefined,
            });
            props.nextStep();
        } else {
            toast.warn(t('Total amount should be equal to insurance premium!'))
        }
    }

    const prevStep = () => {
        props.previousStep();
    }
    const checkCharacterCount = (event) => {
        const unprivilegedEditor = reactQuillRef.current.unprivilegedEditor;
        if (unprivilegedEditor.getLength() > 1600 && event.key !== 'Backspace')
            event.preventDefault();
    };
    const reset = () => {
        resetAgreement();
        resetRiskList();
        props.firstStep();
    }
    const {
        mutate: getPersonalInfoRequest, isLoading: isLoadingPersonalInfo
    } = usePostQuery({listKeyId: KEYS.personalInfoProvider})
    const getInfo = () => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes: {
                    passportSeries: get(_modalFields, 'objectOfInsurance.details.person.passportData.seria'),
                    passportNumber: get(_modalFields, 'objectOfInsurance.details.person.passportData.number'),
                    pinfl: get(_modalFields, 'objectOfInsurance.details.person.passportData.pinfl'),
                }
            },
            {
                onSuccess: ({data}) => {
                    setPerson(data);
                }
            }
        )
    }
    const {
        mutate: getOrganizationInfoRequest, isLoading: isLoadingOrganizationInfo
    } = usePostQuery({listKeyId: KEYS.organizationInfoProvider})
    const getOrgInfo = () => {
        getOrganizationInfoRequest({
                url: URLS.organizationInfoProvider, attributes: {
                    inn: get(_modalFields, 'objectOfInsurance.details.organization.inn'),
                }
            },
            {
                onSuccess: ({data}) => {
                    setOrganization(data)
                }
            }
        )
    }
    const {
        mutate: getVehicleInfoRequest, isLoading: isLoadingVehicleInfo
    } = usePostQuery({listKeyId: KEYS.vehicleInfo})

    const getVehicleInfo = () => {
        getVehicleInfoRequest({
                url: URLS.vehicleInfo, attributes: {
                    govNumber: get(_modalFields, 'objectOfInsurance.details.registrationNumber'),
                    techPassportNumber: get(_modalFields, 'objectOfInsurance.details.techPassportNumber'),
                    techPassportSeria: get(_modalFields, 'objectOfInsurance.details.techPassportSeries'),
                }
            },
            {
                onSuccess: ({data}) => {
                    setVehicle(data)
                }
            }
        )
    }

    const {
        mutate: getPropertyInfoRequest, isLoading: isLoadingPropertyInfo
    } = usePostQuery({listKeyId: KEYS.getCadastrInfo})

    const getPropertyInfo = () => {
        getPropertyInfoRequest({
                url: URLS.getCadastrInfo, attributes: {
                    cadasterNumber: get(_modalFields, 'objectOfInsurance.details.cadastralNumber'),
                }
            },
            {
                onSuccess: ({data}) => {
                    setProperty(data)
                }
            }
        )
    }

    let {data: payments} = useGetAllQuery({key: KEYS.paymentcurrency, url: `${URLS.paymentCurrency}/list`})
    payments = getSelectOptionsListFromData(get(payments, `data.data`, []), '_id', 'name')

    let {data: currencyList} = useGetAllQuery({key: KEYS.currencyList, url: `${URLS.currencyList}`})
    currencyList = getSelectOptionsListFromData(get(currencyList, `data.data`, []), '_id', 'name')


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

    const {data: engineType} = useGetAllQuery({
        key: KEYS.engineType, url: `${URLS.engineType}/list`
    })
    const engineTypeList = getSelectOptionsListFromData(get(engineType, `data.data`, []), 'id', 'name')

    const {data: propertyRightType} = useGetAllQuery({
        key: KEYS.propertyRightType, url: `${URLS.propertyRightType}/list`
    })
    const propertyRightTypeList = getSelectOptionsListFromData(get(propertyRightType, `data.data`, []), '_id', 'name')

    const {data: propertyType} = useGetAllQuery({
        key: KEYS.propertyType, url: `${URLS.propertyType}/list`
    })
    const propertyTypeList = getSelectOptionsListFromData(get(propertyType, `data.data`, []), '_id', 'name')

    const {data: agriculturalType} = useGetAllQuery({
        key: KEYS.agriculturalType, url: `${URLS.agriculturalType}/list`
    })
    const agriculturalTypeList = getSelectOptionsListFromData(get(agriculturalType, `data.data`, []), '_id', 'name')

    const {data: otherObjectType} = useGetAllQuery({
        key: KEYS.otherObjectType, url: `${URLS.otherObjectType}`
    })
    const otherObjectTypeList = getSelectOptionsListFromData(get(otherObjectType, `data.data`, []), 'id', 'name')

    const {data: measurementType} = useGetAllQuery({
        key: KEYS.measurementType, url: `${URLS.measurementType}/list`
    })
    const measurementTypeList = getSelectOptionsListFromData(get(measurementType, `data.data`, []), '_id', 'name')

    const {data: policyUseType} = useGetAllQuery({
        key: KEYS.policyUseType, url: `${URLS.policyUseType}`
    })
    const policyUseTypeList = getSelectOptionsListFromData(get(policyUseType, `data`, []), 'id', 'name')

    const {data: policyIntentType} = useGetAllQuery({
        key: KEYS.policyIntentType, url: `${URLS.policyIntentType}`
    })
    const policyIntentTypeList = getSelectOptionsListFromData(get(policyIntentType, `data`, []), 'id', 'name')

    const {data: gtkRegions} = useGetAllQuery({
        key: KEYS.gtkRegionList, url: `${URLS.gtkRegionList}`
    })
    const gtkRegionList = getSelectOptionsListFromData(get(gtkRegions, `data`, []), 'code', 'name')
    const setFieldValue = (value, name = "") => {

        _setFields(prev => ({...prev, [name]: value}))

    }


    const findItem = (list = [], id = null) => {
        return find(list, l => isEqual(get(l, "_id"), id))
    }

    const getNameFromObject = (object, type) => {
        switch (type) {
            case INSURANCE_OBJECT_TYPES.VEHICLE:
                return get(object, 'objectOfInsurance.details.carModel')
            case INSURANCE_OBJECT_TYPES.BORROWER:
                return get(object, 'objectOfInsurance.details.type') != 'PERSON' ? get(object, 'objectOfInsurance.details.organization.name') : `${get(object, 'objectOfInsurance.details.person.fullName.lastname')} ${get(object, 'objectOfInsurance.details.person.fullName.firstname')}`
            case INSURANCE_OBJECT_TYPES.PROPERTY:
                return get(object, 'objectOfInsurance.details.cadastralNumber')
            case INSURANCE_OBJECT_TYPES.AGRICULTURE:
                return get(object, 'objectOfInsurance.details.objectName')
            default:
                return '-';
        }
    }


    useEffect(() => {
        if (!isNil(get(agreement, 'product.risk', []))) {
            setRiskFields(get(agreement, 'product.risk', []).map(_r => ({
                ..._r,
                startDate: get(agreement, 'startOfInsurance'),
                endDate: get(agreement, 'endOfInsurance'),
                insurancePremium: 0,
                insuranceRate: 0,
                insuranceSum: 0
            })))
        }
        if(get(agreement,'product.riskComment')) {
            setComment(get(agreement,'product.riskComment'))
        }
    }, [agreement])


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
                            <Title> {t("Обязательства по договору")}</Title>
                        </Col>
                        <Col xs={12} className={' mb-15 mt-15'}>
                            <Button onClick={() => setOpenObjectModal(true)} type={'button'}>{t("Добавить объект")}</Button>
                        </Col>
                        <Col xs={12}>
                            <hr/>
                            {objects.length > 0 && <Table hideThead={false}
                                                          thead={['Object type', 'Details', 'Actions']}>
                                {objects?.length > 0 && objects.map((obj, i) => <tr key={get(obj, 'id', i)}>
                                    <td>
                                        {
                                            get(obj, 'objectOfInsurance.type')
                                        }
                                    </td>
                                    <td>
                                        {getNameFromObject(obj, get(obj, 'objectOfInsurance.type'))}
                                    </td>
                                    <td className={'cursor-pointer'}
                                    >
                                        <Trash2 onClick={() => removeObjects(get(obj, 'id', i))} color={'#dc2626'}/>
                                    </td>
                                </tr>)
                                }
                            </Table>}
                        </Col>
                    </Row>
                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title>{t("Страховая сумма по рискам")}</Title>
                        </Col>
                    </Row>

                    <Row className={'mb-25'}>
                        {riskFields.length > 0 && <Col xs={12} className={'mb-25 horizontal-scroll'}>
                            <hr/>
                            <Table hideThead={false}
                                   thead={['Risk', 'startdate', 'enddate', 'Insurance premium', 'Insurance rate', 'Insurance sum']}>
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
                                            defaultValue={get(item, 'startDate')}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            property={{
                                                hideLabel: true,
                                            }}
                                            name={`riskDetails[${i}].endDate`} type={'datepicker'}
                                            defaultValue={get(item, 'endDate')}
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
                                                    onChange: (val) => {
                                                        if(isNumber(val)){
                                                            setPremium(prev => ({...prev, [i]: val}))
                                                        }else{
                                                            setPremium(prev => ({...prev, [i]: 0}))
                                                        }
                                                    }
                                                }}
                                                defaultValue={round((((dayjs(get(_fields, `riskDetails[${i}].endDate`)).diff(get(_fields, `riskDetails[${i}].startDate`), 'day') + 1) / 365) * get(insuranceSum, `${i}`, 0) * get(_fields, `riskDetails[${i}].insuranceRate`, 0) / 100), 2)}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'flex-end'}>
                                            <Field
                                                name={`riskDetails[${i}].insuranceRate`}
                                                type={'number-format-input'}
                                                property={{hideLabel: true, placeholder: 'insuranceRate', suffix: ' %'}}
                                                defaultValue={round((365 * 100 * get(_fields, `riskDetails[${i}].insurancePremium`, 0) / ((dayjs(get(_fields, `riskDetails[${i}].endDate`)).diff(get(_fields, `riskDetails[${i}].startDate`), 'day') + 1) * get(insuranceSum, `${i}`, 0))), 2) || 0}
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
                                                    onChange: (val) => setInsuranceSum(prev => ({...prev, [i]: val}))
                                                }}
                                                defaultValue={sumBy(objects, (_object) => {
                                                    if(!isEmpty(get(_object, 'objectOfInsurance.risk', []))) {
                                                        if (includes(get(_object, 'objectOfInsurance.risk', []), get(item, '_id'))) {
                                                            return round(get(_object, 'objectOfInsurance.insuranceSum', 0) / get(_object, 'objectOfInsurance.risk', [])?.length,2)
                                                        }
                                                    }
                                                    return 0;
                                                })}
                                            />
                                        </Flex>
                                    </td>
                                </tr>)}
                            </Table>
                        </Col>}
                        <Col xs={12}>
                            <Row>
                                <Col xs={3}>
                                    <Field
                                        className={'mr-16'}
                                        name={`totalInsuranceSum`}
                                        type={'number-format-input'}
                                        label={t("Общая страховая сумма")}
                                        property={{
                                            placeholder: 'ввод значения',
                                            disabled: true
                                        }}
                                        defaultValue={round(sum(values(insuranceSum)), 2)}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        className={'mr-16'}
                                        name={`totalInsurancePremium`}
                                        type={'number-format-input'}
                                        label={t("Общая страховая премия")}
                                        defaultValue={round(sum(values(premium)), 2)}
                                        property={{
                                            placeholder: 'ввод значения',
                                            disabled: true
                                        }}
                                    />
                                </Col>
                                <Col xs={2}>
                                    <Field
                                        property={{onChange:(val)=>setHasForeignCurrency(val)}}
                                        label={t('Валюта договор')}
                                        type={'switch'}
                                        name={`hasForeignCurrency`}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        label={t('Валюта')}
                                        name={`currencyId`}
                                        type={'select'}
                                        options={currencyList}
                                        isDisabled={!hasForeignCurrency}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        label={t('Обменный курс')}
                                        name={`exchangeRate`}
                                        type={'number-format-input'}
                                        property={{disabled:!hasForeignCurrency,onChange:(val)=>setExchangeRate(val)}}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        label={t('Общая сумма зарубежного страхования')}
                                        name={`totalForeignInsuranceSum`}
                                        type={'number-format-input'}
                                        defaultValue={round(sum(values(insuranceSum))/exchangeRate, 2)}
                                        property={{disabled:!hasForeignCurrency}}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        label={t('Общая сумма иностранной страховой премии')}
                                        name={`totalForeignInsurancePremium`}
                                        type={'number-format-input'}
                                        defaultValue={round(sum(values(premium))/exchangeRate, 2)}
                                        property={{disabled:!hasForeignCurrency}}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <Row>


                            </Row>
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}><Title>{t("Страховая премия и взаиморасчеты")}</Title></Col>
                    </Row>
                    <Row>
                        <Col xs={7}>
                            <Row>
                                <Col xs={6}>
                                    <Field
                                        name={`accruedInsurancePremium`}
                                        type={'number-format-input'}
                                        label={t("Начисленная страховая премия")}
                                        property={{
                                            placeholder: 'ввод значения',
                                            disabled: true
                                        }}
                                        defaultValue={sum(range(0, count).map(_index => get(_fields, `paymentSchedule[${_index}].date`) <= dayjs().format("YYYY-MM-DD") ? get(_fields, `paymentSchedule[${_index}].count`) : 0))}
                                    />
                                </Col>
                                <Col xs={6}>
                                    <Field
                                        name={`paidInsurancePremium`}
                                        type={'number-format-input'}
                                        label={t("Оплаченная страховая премия")}
                                        property={{
                                            placeholder: 'ввод значения',
                                        }}
                                    />
                                </Col>
                                {get(agreement, 'product.allowForeignCurrency', false) && <Col xs={3}>
                                    <Field
                                        options={payments}
                                        property={{isColumn: true}}
                                        label={t("Валюта оплаты")}
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
                                <Title sm>{t("График оплаты премии")}</Title>
                                <Button onClick={() => {
                                    if (round(sum(values(premium)), 2) > 0) {
                                        if (sum(range(0, count).map(_index => get(_fields, `paymentSchedule[${_index}].count`))) <= round(sum(values(premium)), 2)) {
                                            setCount(prev => ++prev)
                                        } else {
                                            toast.warn(t('Total amount cannot be greater than insurance premium!'))
                                        }
                                    } else {
                                        toast.warn(t('Insurance premium  should be greater than 0!'))
                                    }
                                }} type={'button'}><Plus/></Button>
                            </Flex>
                            <hr className={'mt-15'}/>
                            {count > 0 && <Table hideThead>
                                {range(0, count).map((s, i) => <tr key={i}>
                                    <td>
                                        <Field
                                            className={'mr-16'}
                                            property={{
                                                hideLabel: true,
                                            }}
                                            name={`paymentSchedule[${i}].date`}
                                            type={'datepicker'}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            name={`paymentSchedule[${i}].count`}
                                            type={'number-format-input'}
                                            property={{
                                                placeholder: 'ввод значения',
                                                hideLabel: true,
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <Trash2 onClick={() => setCount(prev => --prev)}
                                                className={'cursor-pointer '} size={20} color={'#dc2626'}/>
                                    </td>
                                </tr>)}
                                <tr>
                                    <td>
                                        <strong>{t("Итого сумма")}:</strong>
                                    </td>
                                    {/*<td colSpan={2}><strong><NumberFormat displayType={'text'} thousandSeparator={" "}*/}
                                    {/*                          value={Math.abs(get(_fields, 'accruedInsurancePremium', 0) - get(_fields, 'paidInsurancePremium', 0))}/></strong>*/}
                                    {/*</td>*/}
                                    <td colSpan={2}><strong> <NumberFormat displayType={'text'} thousandSeparator={" "}
                                                                           value={sum(range(0, count).map(_index => get(_fields, `paymentSchedule[${_index}].count`)))}/></strong>
                                    </td>
                                </tr>
                            </Table>}
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}><Title>{t("Франшиза")}</Title></Col>
                    </Row>
                    <Row className={'mb-25'}>
                        {get(agreement, 'product.franchise', []).length > 0 &&
                        <Col xs={12} className={'horizontal-scroll'}>
                            <hr/>
                            <Table hideThead={false}
                                   thead={['Страховой риск', 'Имеет франшизу', 'Строго фиксирована', 'Введите фиксированное значение', 'Укажите тип франшизы', 'Укажите базу франшизы', 'Франшиза']}>
                                {get(agreement, 'product.franchise', []).map((item, i) => <tr key={i + 1}>
                                    <td>
                                        <Field
                                            className={'w-250'}
                                            name={`franchise[${i}].risk`}
                                            type={'select'}
                                            property={{hideLabel: true}}
                                            options={risksOptions}
                                            defaultValue={get(item, 'risk')}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                type={'switch'}
                                                name={`franchise[${i}].hasFranchise`}
                                                defaultValue={get(item, `hasFranchise`)}
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
                                                defaultValue={get(item, `isFixed`)}
                                                property={{hideLabel: true}}
                                                disabled={!!!(get(_fields, `franchise[${i}].hasFranchise`))}
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
                                                    disabled: !!!(get(_fields, `franchise[${i}].isFixed`))
                                                }}
                                                defaultValue={get(item, `fixedValue`)}
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
                                                isDisabled={!!!(get(_fields, `franchise[${i}].hasFranchise`))}
                                                defaultValue={get(item, `franchiseType`)}
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
                                                isDisabled={!!!(get(_fields, `franchise[${i}].hasFranchise`))}
                                                defaultValue={get(item, `franchiseBase`)}
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
                                                    disabled: !(get(_fields, `franchise[${i}].hasFranchise`) && !get(_fields, `franchise[${i}].isFixed`))
                                                }}
                                                defaultValue={get(item, `franchise`)}
                                            />
                                        </Flex>
                                    </td>
                                </tr>)}
                            </Table>
                        </Col>}
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}>
                            <ReactQuill  style={{height: 250}} theme="snow" value={comment} onChange={setComment}
                                        onKeyDown={checkCharacterCount}
                                        ref={reactQuillRef}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} className={'mt-32'}>
                            <Button className={'mr-16'} type={'button'} onClick={reset} danger outlined
                                    back>{t("Отменить")}</Button>
                            <Button dark className={'mr-16'} type={'button'} onClick={prevStep}
                                    outlined>{t("Назад")}</Button>
                            <Button type={'submit'} success>{t("Продолжить")}</Button>
                        </Col>
                    </Row>
                </Form>
                <Modal title={'Добавить объект'} visible={openObjectModal}
                       hide={setOpenObjectModal}>
                    <Form getValueFromField={(value, name) => _setModalFields(prev => ({...prev, [name]: value}))}
                          formRequest={({data}) => {
                              console.log('data', data)
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
                                                <Field label={t("Passport seria")} params={{required: true}}
                                                       type={'input-mask'} property={{
                                                    placeholder: 'Seria',
                                                    mask: 'aa',
                                                    maskChar: '_'
                                                }}
                                                       name={'objectOfInsurance.details.person.passportData.seria'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={t("Passport number")} params={{required: true}}
                                                       type={'input-mask'} property={{
                                                    placeholder: 'Number',
                                                    mask: '9999999',
                                                    maskChar: '_'
                                                }}
                                                       name={'objectOfInsurance.details.person.passportData.number'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={t("ПИНФЛ")} type={'input-mask'} property={{
                                                    placeholder: 'ПИНФЛ',
                                                    mask: '99999999999999',
                                                    maskChar: '_'
                                                }}
                                                       name={'objectOfInsurance.details.person.passportData.pinfl'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Label>{t("Получить данные")}</Label>
                                                <Button block type={'button'}
                                                        onClick={() => getInfo()}>{t("Получить")}</Button>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       label={t("Firstname")}
                                                       type={'input'}
                                                       defaultValue={get(person, 'firstNameLatin')}
                                                       name={'objectOfInsurance.details.person.fullName.firstname'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       defaultValue={get(person, 'lastNameLatin')}
                                                       label={t("Lastname")} type={'input'}
                                                       name={'objectOfInsurance.details.person.fullName.lastname'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       label={t("Middlename")}
                                                       defaultValue={get(person, 'middleNameLatin')}
                                                       type={'input'}
                                                       name={'objectOfInsurance.details.person.fullName.middlename'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       label={t("Дата выдачи паспорта")}
                                                       type={'datepicker'}
                                                       name={'objectOfInsurance.details.person.passportData.startDate'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       defaultValue={get(person, 'birthDate')}
                                                       label={t("Дата рождения")}
                                                       type={'datepicker'}
                                                       name={'objectOfInsurance.details.person.birthDate'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       label={t("Кем выдан")}
                                                       defaultValue={get(person, 'issuedBy')}
                                                       type={'input'}
                                                       name={'objectOfInsurance.details.person.passportData.issuedBy'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    defaultValue={get(person, 'gender')}
                                                    fullWidth
                                                    params={{required: true}}
                                                    options={genderList}
                                                    label={t("Gender")}
                                                    type={'select'}
                                                    name={'objectOfInsurance.details.person.gender'}/>
                                            </Col>


                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    params={{
                                                        required: true,
                                                        pattern: {
                                                            value: /^998[0-9]{9}$/,
                                                            message: t('Invalid format')
                                                        }
                                                    }}
                                                    label={t("Phone")}
                                                    type={'input'}
                                                    property={{placeholder: '998XXXXXXXXX'}}
                                                    name={'objectOfInsurance.details.person.phone'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    label={t("Email")}
                                                    type={'input'}
                                                    name={'objectOfInsurance.details.person.email'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    params={{required: true}}
                                                    options={residentTypeList}
                                                    label={t("Resident type")}
                                                    type={'select'}
                                                    name={'objectOfInsurance.details.person.residentType'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    noMaxWidth
                                                    defaultValue={get(person, 'address')}
                                                    params={{required: true}}
                                                    label={t("Address")}
                                                    type={'input'}
                                                    name={'objectOfInsurance.details.person.address'}/>
                                            </Col>

                                        </> : <>
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
                                                <Label>{t("Получить данные")}</Label>
                                                <Button block type={'button'}
                                                        onClick={() => getOrgInfo()}>{t("Получить")}</Button>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{required: true}}
                                                       defaultValue={get(organization, 'name')}
                                                       label={t("Наименование")} type={'input'}
                                                       name={'objectOfInsurance.details.organization.name'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={t("Руководитель")} type={'input'}
                                                       name={'objectOfInsurance.details.organization.representativeName'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={t("Должность")} type={'input'}
                                                       name={'objectOfInsurance.details.organization.position'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={t("Email")} type={'input'}
                                                       defaultValue={get(organization, 'email')}
                                                       name={'objectOfInsurance.details.organization.email'}/>
                                            </Col>
                                            <Col xs={4} className={'mb-25'}>
                                                <Field params={{
                                                    required: true
                                                }}
                                                       defaultValue={get(organization, 'phone')}
                                                       property={{
                                                           placeholder: '998XXXXXXXXX', pattern: {
                                                               value: /^998[0-9]{9}$/,
                                                               message: 'Invalid format'
                                                           }
                                                       }}
                                                       label={t("Телефон")} type={'input'}
                                                       name={'objectOfInsurance.details.organization.phone'}/>
                                            </Col>
                                            <Col xs={4}><Field
                                                defaultValue={get(organization, 'oked')}
                                                label={t("Oked")} params={{required: true, valueAsString: true}}
                                                type={'input'}
                                                name={'objectOfInsurance.details.organization.oked'}/></Col>

                                            <Col xs={4} className={'mb-25'}>
                                                <Field label={t("Расчетный счет")} type={'input'}
                                                       name={'objectOfInsurance.details.organization.checkingAccount'}/>
                                            </Col>
                                            <Col xs={4}><Field label={t("Форма собственности")}
                                                               options={ownershipFormList}
                                                               type={'select'}
                                                               name={'objectOfInsurance.details.organization.ownershipForm'}/></Col>

                                            <Col xs={4} className={'mb-25'}>
                                                <Field
                                                    defaultValue={get(organization, 'address')}
                                                    noMaxWidth
                                                    params={{required: true}}
                                                    label={t("Address")}
                                                    type={'input'}
                                                    name={'objectOfInsurance.details.organization.address'}/>
                                            </Col>

                                        </>
                                    }
                                    <Col xs={4}>
                                        <Field
                                            type={'input'}
                                            name={`objectOfInsurance.details.insuranceCredit.creditAgreementNum`}
                                            label={t('Номер кред. договора')}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'datepicker'}
                                            name={`objectOfInsurance.details.insuranceCredit.dateCreditAgreement`}
                                            label={t('Дата кред. договора')}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'input'}
                                            name={`objectOfInsurance.details.insuranceCredit.currencyCreditAgreement`}
                                            label={t('Валюта кред. договора')}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'number-format-input'}
                                            name={`objectOfInsurance.details.insuranceCredit.creditSum`}
                                            label={t('Сумма кредита')}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'input'}
                                            property={{type: 'number', max: 1000000000}}
                                            name={`objectOfInsurance.details.insuranceCredit.waitingPeriod`}
                                            label={t('Период ожидания')}
                                            params={{valueAsNumber: true}}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'input'}
                                            property={{type: 'number', max: 1000000000}}
                                            name={`objectOfInsurance.details.exportContractInsurance.contractNumber`}
                                            label={t('Номер контракта')}
                                            params={{valueAsNumber: true}}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'datepicker'}
                                            name={`objectOfInsurance.details.exportContractInsurance.contractDate`}
                                            label={t('Дата контракта')}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'input'}
                                            name={`objectOfInsurance.details.exportContractInsurance.contractCurrency`}
                                            label={t('Валюта контракта')}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'number-format-input'}
                                            name={`objectOfInsurance.details.exportContractInsurance.contractSum`}
                                            label={t('Сумма контракта')}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'input'}
                                            name={`objectOfInsurance.details.exportContractInsurance.contractServices`}
                                            label={t('Товары (услуги) по контракту')}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'input'}
                                            property={{type: 'number', max: 1000000000}}
                                            name={`objectOfInsurance.details.exportContractInsurance.creditPeriod`}
                                            label={t('Кредитный период')}
                                            params={{valueAsNumber: true}}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            type={'input'}
                                            property={{type: 'number', max: 1000000000}}
                                            name={`objectOfInsurance.details.exportContractInsurance.creditLimit`}
                                            label={t('Кредитный лимит')}
                                            params={{valueAsNumber: true}}
                                        />
                                    </Col>
                                </>
                            }
                            {
                                isEqual(get(_modalFields, 'objectOfInsurance.type'), INSURANCE_OBJECT_TYPES.VEHICLE) && <>
                                    <Col xs={4}>
                                        <Field
                                            options={get(agreement,'pledgersSelect',[])}
                                            type={'select'}
                                            name={`objectOfInsurance.details.owner`}
                                            label={t('Owner')}
                                        />
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Регистрационный номер")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.registrationNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Серия тех.паспорта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.techPassportSeries'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Номер тех.паспорта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.techPassportNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Label>{t("Получить данные")}</Label>
                                        <Button block type={'button'}
                                                onClick={() => getVehicleInfo()}>{t("Получить")}</Button>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={residentTypeList}
                                            label={t("Resident type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.residency'}/>
                                    </Col>

                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Марка ТС")}
                                            type={'input'}

                                            name={'objectOfInsurance.details.carMake'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Модель ТС")}
                                            defaultValue={get(vehicle, 'modelName')}
                                            type={'input'}
                                            name={'objectOfInsurance.details.carModel'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            options={vehicleTypeList}
                                            params={{required: true}}
                                            label={t("Vehicle type")}
                                            defaultValue={get(vehicle, 'vehicleTypeId')}
                                            type={'select'}
                                            name={'objectOfInsurance.details.carType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            options={engineTypeList}
                                            params={{required: true}}
                                            label={'Тип двигателя'}
                                            defaultValue={get(vehicle, 'engineType')}
                                            type={'select'}
                                            name={'objectOfInsurance.details.engineType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Год выпуска")}
                                            defaultValue={get(vehicle, 'techPassportIssueDate')}
                                            type={'datepicker'}
                                            name={'objectOfInsurance.details.manufactureYear'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Номер кузова")}
                                            defaultValue={get(vehicle, 'bodyNumber')}
                                            type={'input'}
                                            name={'objectOfInsurance.details.bodyNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Номер двигателя")}
                                            defaultValue={get(vehicle, 'engineNumber')}
                                            type={'input'}
                                            name={'objectOfInsurance.details.engineNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true, valueAsNumber: true}}
                                            property={{type: 'number', max: 10000000000}}
                                            label={t("Грузоподъемность")}
                                            defaultValue={get(vehicle, 'emptyWeight')}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoCapacity'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true, valueAsNumber: true, validate: (value) => Number.isInteger(value) || "Only integers allowed",}}
                                            property={{type: 'number',step:1}}
                                            label={t("Количество мест сидения")}
                                            defaultValue={parseInt(get(vehicle, 'seats',0))}
                                            type={'input'}
                                            name={'objectOfInsurance.details.seatNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Серия тех.паспорта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.techPassportSeries'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Номер тех.паспорта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.techPassportNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{valueAsNumber: true}}
                                            label={t("Страховая стоимость")}
                                            type={'number-format-input'}
                                            name={'objectOfInsurance.details.insuredValue'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{valueAsNumber: true}}
                                            label={t("Страховая стоимость в валюте")}
                                            type={'number-format-input'}
                                            name={'objectOfInsurance.details.insuredForeignValue'}/>
                                    </Col>

                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Водители")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cascoInsurance.drivers'}/>
                                    </Col>
                                </>}
                            {
                                isEqual(get(_modalFields, 'objectOfInsurance.type'), INSURANCE_OBJECT_TYPES.PROPERTY) && <>
                                    <Col xs={4}>
                                        <Field
                                            options={get(agreement,'pledgersSelect',[])}
                                            type={'select'}
                                            name={`objectOfInsurance.details.owner`}
                                            label={t('Owner')}
                                        />
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Кадастровый номер")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cadastralNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Label>{t("Получить данные")}</Label>
                                        <Button block type={'button'}
                                                onClick={() => getPropertyInfo()}>{t("Получить")}</Button>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            options={propertyRightTypeList}
                                            label={t("Property right type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.propertyRightType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={residentTypeList}
                                            label={t("Resident type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.ownerResidency'}/>
                                    </Col>

                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Дата кадастрового документа")}
                                            type={'datepicker'}
                                            name={'objectOfInsurance.details.cadastralDocDate'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={propertyTypeList}
                                            label={t("Property type")}
                                            defaultValue={parseInt(get(property, 'tip'))}
                                            type={'select'}
                                            name={'objectOfInsurance.details.propertyClassification'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Описание имущества")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.propertyDescription'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Почтовый индекс")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.postcode'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Адрес имущества")}
                                            type={'input'}
                                            defaultValue={get(property, 'address')}
                                            name={'objectOfInsurance.details.address'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{valueAsNumber: true}}
                                            label={t("Страховая стоимость")}
                                            type={'number-format-input'}
                                            name={'objectOfInsurance.details.insuredValue'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{valueAsNumber: true}}
                                            label={t("Страховая стоимость в валюте")}
                                            type={'number-format-input'}
                                            name={'objectOfInsurance.details.insuredForeignValue'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{valueAsNumber: true}}
                                            label={t("Номер контракта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoInsurance.contractNumber'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Сопровождающие документы")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoInsurance.accompanyingDocuments'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Наименование груза")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoInsurance.cargoName'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Вид транспорта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoInsurance.carType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Грузоперевозчик")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoInsurance.cargoCarrier'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Пункт отправления")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoInsurance.departurePoint'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Пункт назначения")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoInsurance.destination'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t('Места перегрузок')}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoInsurance.transshipmentPoints'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Условия страхования")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.cargoInsurance.insuranceConditions'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Код типа ОПО")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.opo.code'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Местонахождение ОПО")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.opo.location'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Наименование строительства")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.smr.constructionName'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Место строительства")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.smr.constructionPlace'}/>
                                    </Col>
                                </>}

                            {
                                isEqual(get(_modalFields, 'objectOfInsurance.type'), INSURANCE_OBJECT_TYPES.AGRICULTURE) && <>
                                    <Col xs={4}>
                                        <Field
                                            options={get(agreement,'pledgersSelect',[])}
                                            type={'select'}
                                            name={`objectOfInsurance.details.owner`}
                                            label={t('Owner')}
                                        />
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={residentTypeList}
                                            label={t("Resident type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.ownerResidency'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={agriculturalTypeList}
                                            label={t("Agricultural type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.agriculturalObjectType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Наименование объекта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.objectName'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Описание объекта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.objectDescription'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={measurementTypeList}
                                            label={t("Measurement type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.measurementType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Объем страхования")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.insuranceVolume'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Почтовый индекс")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.postcode'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Адрес имущества")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.address'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true, valueAsNumber: true}}
                                            label={t("Страховая стоимость")}
                                            type={'number-format-input'}
                                            name={'objectOfInsurance.details.insuredValue'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{valueAsNumber: true}}
                                            label={t("Страховая стоимость в валюте")}
                                            type={'number-format-input'}
                                            name={'objectOfInsurance.details.insuredForeignValue'}/>
                                    </Col>
                                </>}
                            {
                                isEqual(get(_modalFields, 'objectOfInsurance.type'), "GTKOBJECT") && <>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t('Polis turi')}
                                            type={'input'}
                                            name={'objectOfInsurance.details.policyType'}/>
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            options={policyUseTypeList}
                                            params={{required: true}}
                                            type={'select'}
                                            name={`objectOfInsurance.details.policyMultiUse`}
                                            label={t('Policy use type')}
                                        />
                                    </Col>
                                    <Col xs={4} >
                                        <Field
                                            params={{required: true}}
                                            label={t('Polisni qo\'llash maqsadi')}
                                            type={'input'}
                                            name={'objectOfInsurance.details.policyIntent'}/>
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            options={policyIntentTypeList}
                                            params={{required: true}}
                                            type={'select'}
                                            name={`objectOfInsurance.details.policyIntentType`}
                                            label={t('Policy intent type')}
                                        />
                                    </Col>
                                    <Col xs={4} >
                                        <Field
                                            options={gtkRegionList}
                                            params={{required: true}}
                                            label={t('Hududiy bojxona boshqarmasi kodi')}
                                            type={'select'}
                                            name={'objectOfInsurance.details.policyUgtk'}/>
                                    </Col>
                                    <Col xs={4}>
                                        <Field
                                            options={get(agreement,'pledgersSelect',[])}
                                            type={'select'}
                                            name={`objectOfInsurance.details.owner`}
                                            label={t('Owner')}
                                        />
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={residentTypeList}
                                            label={t("Resident type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.ownerResidency'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={otherObjectTypeList}
                                            label={t("Object type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.objectType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Наименование объекта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.objectName'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Описание объекта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.objectDescription'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={measurementTypeList}
                                            label={t("Measurement type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.measurementType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Объем страхования")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.insuranceVolume'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Почтовый индекс")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.postcode'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Адрес имущества")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.address'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true, valueAsNumber: true}}
                                            label={t("Страховая стоимость")}
                                            type={'number-format-input'}
                                            name={'objectOfInsurance.details.insuredValue'}/>
                                    </Col>
                                </>}

                            {
                                isEqual(get(_modalFields, 'objectOfInsurance.type'), "OTHEROBJECT") && <>
                                    <Col xs={4}>
                                        <Field
                                            options={get(agreement,'pledgersSelect',[])}
                                            type={'select'}
                                            name={`objectOfInsurance.details.owner`}
                                            label={t('Owner')}
                                        />
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={residentTypeList}
                                            label={t("Resident type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.ownerResidency'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={otherObjectTypeList}
                                            label={t("Object type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.objectType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Наименование объекта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.objectName'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Описание объекта")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.objectDescription'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            options={measurementTypeList}
                                            label={t("Measurement type")}
                                            type={'select'}
                                            name={'objectOfInsurance.details.measurementType'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Объем страхования")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.insuranceVolume'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            label={t("Почтовый индекс")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.postcode'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            label={t("Адрес имущества")}
                                            type={'input'}
                                            name={'objectOfInsurance.details.address'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{required: true, valueAsNumber: true}}
                                            label={t("Страховая стоимость")}
                                            type={'number-format-input'}
                                            name={'objectOfInsurance.details.insuredValue'}/>
                                    </Col>
                                    <Col xs={4} className={'mb-25'}>
                                        <Field
                                            params={{valueAsNumber: true}}
                                            label={t("Страховая стоимость в валюте")}
                                            type={'number-format-input'}
                                            name={'objectOfInsurance.details.insuredForeignValue'}/>
                                    </Col>
                                </>}
                            <Col xs={4}>
                                <Field
                                    type={'number-format-input'}
                                    name={`objectOfInsurance.insuranceSum`}
                                    label={t('Страховая сумма')}
                                    params={{valueAsNumber: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    type={'number-format-input'}
                                    name={`objectOfInsurance.insuranceForeignSum`}
                                    label={t('Страховая сумма в валюте')}
                                    params={{valueAsNumber: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    options={get(agreement, 'product.risk', []).map(_risk => ({
                                        value: get(_risk, '_id'),
                                        label: get(_risk, 'name')
                                    }))}
                                    type={'select'}
                                    isMulti
                                    name={`objectOfInsurance.risk`}
                                    label={t('К каким рискам относится')}
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
                            <Col xs={4}>
                                <Field
                                    defaultValue={false}
                                    label={"Ведется ли по объекту страхование гражданской ответственности?"}
                                    type={"switch"}
                                    name={"objectOfInsurance.isDefault"}
                                    params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    label={t("Территория страхования")}
                                    type={"input"}
                                    name={"objectOfInsurance.territoryInsurance"}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    label={t("Специальные условия")}
                                    type={"input"}
                                    name={"objectOfInsurance.specialConditions"}
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
