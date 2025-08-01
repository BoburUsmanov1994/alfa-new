import React, {useEffect, useMemo, useState} from 'react';
import {useSettingsStore, useStore} from "../../../../store";
import {find, get, head, isEmpty, isEqual, isNil, round, upperCase} from "lodash";
import Panel from "../../../../components/panel";
import Search from "../../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../../components/section";
import Title from "../../../../components/ui/title";
import Button from "../../../../components/ui/button";
import Form from "../../../../containers/form/form";
import Flex from "../../../../components/flex";
import Field from "../../../../containers/form/field";
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import {OverlayLoader} from "../../../../components/loader";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const getEndDateByInsuranceTerm = (term, startDate) => {
    if (!isNil(term)) {
        if (get(term, 'prefix') == 'day') {
            return dayjs(startDate).add(get(term, 'value') - 1, get(term, 'prefix')).toDate()
        }
        if (get(term, 'prefix') == 'month') {
            return dayjs(startDate).add(get(term, 'value'), get(term, 'prefix')).subtract(1, 'day').toDate()
        }
        if (get(term, 'prefix') == 'year') {
            return dayjs(startDate).add(get(term, 'value'), get(term, 'prefix')).subtract(1, 'day').toDate()
        }

    }
    return dayjs()
}

const CreateContainer = ({...rest}) => {
    const [person, setPerson] = useState(null)
    const [agentId, setAgentId] = useState(null)
    const [organization, setOrganization] = useState(null)
    const [insurant, setInsurant] = useState('person')
    const [passportSeries, setPassportSeries] = useState(null)
    const [passportNumber, setPassportNumber] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    const [inn, setInn] = useState(null)
    const [regionId, setRegionId] = useState(null)
    const [agencyId, setAgencyId] = useState(null)
    const [insuranceTerm, setInsuranceTerm] = useState(null)
    const [policeStartDate, setPoliceStartDate] = useState(dayjs())
    const [policeEndDate, setPoliceEndDate] = useState(dayjs())
    const [oked, setOked] = useState(null)
    const [fotSum, setFotSum] = useState(0)
    const [risk, setRisk] = useState(null)
    const [insurancePremium, setInsurancePremium] = useState(0)
    const [_funeralExpensesSum, _setFuneralExpensesSum] = useState(0)
    const [rpmPercent, setRpmPercent] = useState(5)
    const [rewardPercent, setRewardPercent] = useState(0)
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const navigate = useNavigate();
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'ОСГОР', path: '/insurance/osgor',
    }, {
        id: 2, title: 'Добавить ОСГОР', path: '/insurance/osgor/create',
    }], [])

    const {t} = useTranslation()

    const user = useStore((state) => get(state, 'user'))


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const {data: filials, isLoading: isLoadingFilials} = useGetAllQuery({
        key: KEYS.branches,
        url: `${URLS.branches}/list`
    })
    const filialList = getSelectOptionsListFromData(get(filials, `data.data`, []), '_id', 'branchName')

    const {data: insuranceTerms, isLoading: isLoadingInsuranceTerms} = useGetAllQuery({
        key: KEYS.insuranceTerms, url: URLS.insuranceTerms
    })
    const insuranceTermsList = getSelectOptionsListFromData(get(insuranceTerms, `data.data`, []), 'id', 'name')

    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries, url: `${URLS.countries}/list`
    })
    const countryList = getSelectOptionsListFromData(get(country, `data.data`, []), 'id', 'name')

    const {data: region, isLoading: isLoadingRegion} = useGetAllQuery({
        key: KEYS.regions, url: `${URLS.regions}/list`
    })
    const regionList = getSelectOptionsListFromData(get(region, `data.data`, []), '_id', 'name')

    const {data: genders} = useGetAllQuery({
        key: KEYS.genders, url: `${URLS.genders}/list`
    })
    const genderList = getSelectOptionsListFromData(get(genders, `data.data`, []), '_id', 'name')

    const {data: residentTypes} = useGetAllQuery({
        key: KEYS.residentTypes, url: `${URLS.residentTypes}/list`
    })
    const residentTypeList = getSelectOptionsListFromData(get(residentTypes, `data.data`, []), 'id', 'name')

    const {data: okeds} = useGetAllQuery({
        key: KEYS.okeds, url: `${URLS.okeds}`
    })
    const okedList = get(okeds, `data`, []).map(_item => ({value: _item, label: _item}))

    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: `${URLS.ownershipForms}/list`
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.data`, []), '_id', 'name')

    const {data: areaTypes} = useGetAllQuery({
        key: KEYS.areaTypes, url: URLS.areaTypes
    })
    const areaTypesList = getSelectOptionsListFromData(get(areaTypes, `data.data`, []), 'id', 'name')

    const {data: district} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: `${URLS.districts}/list`,
        params: {
            params: {
                region: regionId
            }
        },
        enabled: !!(regionId || get(person, 'regionId'))
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.data`, []), '_id', 'name')

    const {data: agents} = useGetAllQuery({
        key: [KEYS.agents, agencyId],
        url: `${URLS.agents}/list`,
        params: {
            params: {
                branch: agencyId
            }
        },
        enabled: !!(agencyId)
    })
    const agentsList = getSelectOptionsListFromData(get(agents, `data.data`, []), '_id', ['organization.nameoforganization', 'person.secondname', 'person.name'])

    const {data: activity} = useGetAllQuery({
        key: [KEYS.activityAndRisk, oked],
        url: URLS.activityAndRisk,
        params: {
            params: {
                oked
            }
        },
        enabled: !!(oked)
    })
    console.log('activity', activity)
    const activityList = getSelectOptionsListFromData([{
        oked: get(activity, `data.oked`),
        name: get(activity, `data.name`)
    }], 'oked', 'name')

    const {
        mutate: getPersonalInfoRequest, isLoading: isLoadingPersonalInfo
    } = usePostQuery({listKeyId: KEYS.personalInfoProvider})

    const {
        mutate: getOrganizationInfoRequest, isLoading: isLoadingOrganizationInfo
    } = usePostQuery({listKeyId: KEYS.organizationInfoProvider})

    const {
        mutate: calculatePremiumRequest
    } = usePostQuery({listKeyId: KEYS.osgorCalculate, hideSuccessToast: true})
    const {
        mutate: createRequest
    } = usePostQuery({listKeyId: KEYS.osgorCreate})

    const getInfo = () => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes: {
                    birthDate: dayjs(birthDate).format('YYYY-MM-DD'), passportSeries, passportNumber
                }
            },
            {
                onSuccess: ({data}) => {
                    setPerson(data)
                }
            }
        )
    }
    const getOrgInfo = () => {
        getOrganizationInfoRequest({
                url: URLS.organizationInfoProvider, attributes: {
                    inn
                }
            },
            {
                onSuccess: ({data}) => {
                    setOrganization(data)
                }
            }
        )
    }
    const calculatePremium = () => {
        calculatePremiumRequest({
                url: URLS.osgorCalculate, attributes: insuranceTerm === 6 ? {
                    risk,
                    insuranceSum: fotSum,
                    insuranceTermId: insuranceTerm,
                    startDate: dayjs(policeStartDate).format("YYYY-MM-DD"),
                    endDate: dayjs(policeEndDate).format("YYYY-MM-DD")
                } : {
                    risk,
                    insuranceSum: fotSum,
                    insuranceTermId: insuranceTerm
                }
            },
            {
                onSuccess: ({data}) => {
                    setInsurancePremium(get(data, 'insurancePremium'))
                    _setFuneralExpensesSum(get(data, 'funeralExpensesSum'))
                }
            }
        )
    }
    const getFieldData = (name, value) => {
        if (isEqual(name, 'insurant.person.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'policies[0].insuranceTermId')) {
            setInsuranceTerm(value)
        }
        if (isEqual(name, 'insurant.organization.oked')) {
            setOked(value)
        }
        if (isEqual(name, 'policies[0].risk')) {
            setRisk(value)
        }
        if (isEqual(name, 'policies[0].rpm')) {
            setRpmPercent(value)
        }
        if (isEqual(name, 'policies[0].agentReward')) {
            setRewardPercent(value)
        }
        if (isEqual(name, 'insurant.person.oked')) {
            setOked(value)
        }
        if (isEqual(name, 'branch')) {
            setAgencyId(value)
        }
        if (isEqual(name, 'agent')) {
            setAgentId(value)
        }
        if (isEqual(name, 'policies[0].endDate')) {
            setPoliceEndDate(value)
        }
    }
    const create = ({data}) => {
        const {
            activityRisk,
            birthDate,
            fot,
            funeralExpensesSum,
            passportNumber,
            passportSeries,
            rewardPercent,
            rewardSum,
            risk,
            rpmPercent,
            rpmSum,
            policies,
            agent,
            insurant: insurantType,
            ...rest
        } = data
        createRequest({
                url: URLS.osgorCreate, attributes: {
                    agent: String(agent),
                    regionId: parseInt(isEqual(insurant, 'person') ? get(insurantType, 'person.regionId') : get(insurantType, 'organization.regionId')),
                    sum: get(head(policies), 'insuranceSum', 0),
                    contractStartDate: get(head(policies), 'startDate'),
                    contractEndDate: get(head(policies), 'endDate'),
                    insurant: isEqual(insurant, 'person') ? {
                        person: {
                            passportData: get(insurantType, 'person.passportData'),
                            fullName: get(insurantType, 'person.fullName'),
                            regionId: parseInt(get(insurantType, 'person.regionId')),
                            gender: get(insurantType, 'person.gender'),
                            birthDate: get(insurantType, 'person.birthDate'),
                            address: get(insurantType, 'person.address'),
                            residentType: get(insurantType, 'person.residentType'),
                            countryId: get(insurantType, 'person.countryId'),
                            phone: get(insurantType, 'person.phone'),
                            email: isEmpty(get(insurantType, 'person.email')) ? undefined : get(insurantType, 'person.email'),
                            oked: String(get(insurantType, 'person.oked')),
                        }
                    } : {
                        organization: {
                            ...get(insurantType, 'organization'),
                            oked: String(get(insurantType, 'organization.oked')),
                            email: isEmpty(get(insurantType, 'organization.email')) ? undefined : get(insurantType, 'organization.email'),
                            regionId: parseInt(get(insurantType, 'organization.regionId')),
                        }
                    },
                    policies: [
                        {
                            ...head(policies),
                            insuranceRate: get(data, 'comission', 0),
                            fot: fotSum,
                            funeralExpensesSum: parseInt(funeralExpensesSum),
                            agentReward: parseInt(get(head(policies), 'agentReward', 0)),
                            risk: parseInt(get(head(policies), 'risk', 0))
                        }
                    ],
                    ...rest
                }
            },
            {
                onSuccess: ({data: response}) => {
                    if (get(response, 'osgor_formId')) {
                        navigate(`/insurance/osgor/view/${get(response, 'osgor_formId')}`);
                    } else {
                        navigate(`/insurance/osgor`);
                    }
                },
            }
        )
    }
    useEffect(() => {
        if (risk && fotSum && insuranceTerm) {
            calculatePremium()
        }
    }, [risk, fotSum, insuranceTerm, policeEndDate])
    if (isLoadingFilials || isLoadingInsuranceTerms || isLoadingCountry || isLoadingRegion) {
        return <OverlayLoader/>
    }


    return (<>
        {(isLoadingPersonalInfo || isLoadingOrganizationInfo) && <OverlayLoader/>}
        <Panel>
            <Row>
                <Col xs={12}>
                    <Search/>
                </Col>
            </Row>
        </Panel>
        <Section>
            <Row>
                <Col xs={12}>
                    <Title>Параметры полиса</Title>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Form formRequest={create} getValueFromField={(value, name) => getFieldData(name, value)}
                          footer={<Flex className={'mt-32'}><Button type={'submit'}
                                                                    className={'mr-16'}>Сохранить</Button><Button
                              type={'button'} gray className={'mr-16'}>Подтвердить
                              оплату</Button><Button type={'button'} gray className={'mr-16'}>Отправить в Фонд</Button></Flex>}>
                        <Row gutterWidth={60} className={'mt-32'}>
                            <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Статус</Col>
                                    <Col xs={7}><Button green>Новый</Button></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Филиал </Col>
                                    <Col xs={7}><Field isDisabled defaultValue={get(user, 'branch._id')}
                                                       label={'Filial'} params={{required: true}} options={filialList}
                                                       property={{hideLabel: true}} type={'select'}
                                                       name={'branch'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Серия договора:</Col>
                                    <Col xs={7}><Field property={{hideLabel: true}} type={'input'}
                                                       name={'seria'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер договора: </Col>
                                    <Col xs={7}><Field params={{required: true}} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'number'}/></Col>
                                </Row>


                            </Col>
                            <Col xs={4}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая сумма: </Col>
                                    <Col xs={7}><Field params={{required: true}} defaultValue={fotSum}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'number-format-input'}
                                                       name={'policies[0].insuranceSum'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая премия: </Col>
                                    <Col xs={7}><Field params={{required: true}} defaultValue={insurancePremium}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'number-format-input'}
                                                       name={'policies[0].insurancePremium'}/></Col>
                                </Row>


                            </Col>
                            <Col xs={4}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Срок страхования:</Col>
                                    <Col xs={7}><Field options={insuranceTermsList} params={{required: true}}
                                                       label={'Insurance term'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'policies[0].insuranceTermId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата начала покрытия: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{
                                            hideLabel: true,
                                            onChange: (val) => setPoliceStartDate(val),
                                            dateFormat: 'dd.MM.yyyy'
                                        }}
                                        type={'datepicker'}
                                        name={'policies[0].startDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дача окончания покрытия: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        defaultValue={insuranceTerm != 6 ? getEndDateByInsuranceTerm(find(get(insuranceTerms, `data.data`, []), (_insuranceTerm) => get(_insuranceTerm, 'id') == insuranceTerm), policeStartDate) : null}
                                        disabled={!isEqual(insuranceTerm, 6)}
                                        property={{
                                            hideLabel: true,
                                            // onChange: (val) => setPoliceEndDate(val),
                                            dateFormat: 'dd.MM.yyyy'
                                        }} type={'datepicker'}
                                        name={'policies[0].endDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата выдачи полиса: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                                       type={'datepicker'}
                                                       name={'policies[0].issueDate'}/></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Страхователь</Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Страхователь</h4>
                                            <Button onClick={() => setInsurant('person')}
                                                    gray={!isEqual(insurant, 'person')} className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setInsurant('organization')}
                                                    gray={!isEqual(insurant, 'organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(insurant, 'person') && <Flex justify={'flex-end'}>
                                            <Field
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true,
                                                    mask: 'aa',
                                                    placeholder: 'AA',
                                                    upperCase: true,
                                                    maskChar: '_',
                                                    onChange: (val) => setPassportSeries(upperCase(val))
                                                }}
                                                name={'passportSeries'}
                                                type={'input-mask'}
                                            />
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setPassportNumber(val)
                                            }} name={'passportNumber'} type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setBirthDate(e)
                                                   }}
                                                   name={'birthDate'} type={'datepicker'}/>
                                            <Button onClick={getInfo} className={'ml-15'} type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(insurant, 'organization') && <Flex justify={'flex-end'}>
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_',
                                                onChange: (val) => setInn(val)
                                            }} name={'inn'} type={'input-mask'}/>

                                            <Button onClick={getOrgInfo} className={'ml-15'} type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {isEqual(insurant, 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(person, 'firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'insurant.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(person, 'lastNameLatin')}
                                           label={'Lastname'} type={'input'}
                                           name={'insurant.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(person, 'middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'insurant.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(person, 'pinfl')} label={'ПИНФЛ'} type={'input'}
                                           name={'insurant.person.passportData.pinfl'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} property={{
                                        mask: 'aa',
                                        placeholder: 'AA',
                                        maskChar: '_'
                                    }} defaultValue={passportSeries} label={'Passport seria'} type={'input-mask'}
                                           name={'insurant.person.passportData.seria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} property={{
                                        mask: '9999999',
                                        placeholder: '1234567',
                                        maskChar: '_'
                                    }} defaultValue={passportNumber} label={'Passport number'} type={'input-mask'}
                                           name={'insurant.person.passportData.number'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={dayjs(get(person, 'birthDate')).toDate()}
                                           label={'Birth date'}
                                           type={'datepicker'}
                                           name={'insurant.person.birthDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(person, 'gender')}
                                           options={genderList}
                                           label={'Gender'}
                                           type={'select'}
                                           name={'insurant.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={countryList}
                                        defaultValue={'210'}
                                        label={'Country'}
                                        type={'select'}
                                        name={'insurant.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={regionList}
                                        params={{valueAsNumber: true}}
                                        defaultValue={get(person, 'regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'insurant.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={districtList}
                                        defaultValue={get(person, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'insurant.person.districtId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(person, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           options={residentTypeList}
                                           defaultValue={get(person, 'residentType')}
                                           label={'Resident type'}
                                           type={'select'}
                                           name={'insurant.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(person, 'address')}
                                           label={'Address'}
                                           type={'input'}
                                           name={'insurant.person.address'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{
                                            required: true,
                                            pattern: {
                                                value: /^998[0-9]{9}$/,
                                                message: 'Invalid format'
                                            }
                                        }}
                                        defaultValue={get(person, 'phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'insurant.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(person, 'email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'insurant.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={okedList}
                                        params={{required: true}}
                                        label={'Oked'}
                                        type={'select'}
                                        name={'insurant.person.oked'}/>
                                </Col>
                            </>}
                            {isEqual(insurant, 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} label={'INN'} defaultValue={inn} property={{
                                        mask: '999999999',
                                        placeholder: 'Inn',
                                        maskChar: '_'
                                    }} name={'insurant.organization.inn'} type={'input-mask'}/>

                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(organization, 'name')}
                                           label={'Наименование'} type={'input'}
                                           name={'insurant.organization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Руководитель'} type={'input'}
                                           name={'insurant.organization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Должность'} type={'input'}
                                           name={'insurant.organization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(person, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(organization, 'address')} params={{required: true}}
                                           label={'Address'} type={'input'}
                                           name={'insurant.organization.address'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(organization, 'phone')} params={{
                                        required: true,
                                        pattern: {
                                            value: /^998[0-9]{9}$/,
                                            message: 'Invalid format'
                                        }
                                    }}
                                           label={'Телефон'} type={'input'}
                                           name={'insurant.organization.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(organization, 'email')} label={'Email'} type={'input'}
                                           name={'insurant.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           options={okedList}
                                           defaultValue={get(organization, 'oked')}
                                           label={'ОКЭД'}
                                           type={'select'}
                                           name={'insurant.organization.oked'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Расчетный счет'} type={'input'}
                                           name={'insurant.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field label={'Область'} params={{required: true}} options={regionList}
                                                   type={'select'}
                                                   name={'insurant.organization.regionId'}/></Col>
                                <Col xs={3}><Field label={'Форма собственности'} params={{required: true}}
                                                   options={ownershipFormList}
                                                   type={'select'}
                                                   name={'insurant.organization.ownershipFormId'}/></Col>
                            </>}
                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Вид деятельности</Title></Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    options={activityList}
                                    defaultValue={get(activity, 'data.oked')}
                                    label={'Вид деятельности (по правилам)'}
                                    type={'select'}
                                    name={'activityRisk'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    params={{required: true, valueAsNumber: true}}
                                    defaultValue={get(activity, 'data.risks[0].number')}
                                    label={'Класс проф. риска'}
                                    type={'input'}
                                    name={'policies[0].risk'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(activity, 'data.risks[0].coeficient')}
                                    property={{disabled: true}}
                                    label={'Коэффициент страхового тарифа'}
                                    type={'input'}
                                    name={'comission'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={_funeralExpensesSum}
                                    property={{disabled: true}}
                                    params={{required: true, valueAsNumber: true}}
                                    label={'Расходы на погребение'}
                                    type={'input'}
                                    name={'funeralExpensesSum'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    property={{onChange: (val) => setFotSum(val)}}
                                    label={'Фонд оплаты труда'}
                                    type={'number-format-input'}
                                    name={'fot'}/>
                            </Col>
                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Агентсткое вознограждение и РПМ</Title></Col>
                            <Col xs={6}>
                                <Row>
                                    <Col xs={12} className={'mb-25'}>
                                        <Field
                                            disabled
                                            defaultValue={'662a2c60577082fb291c0000'}
                                            options={[...agentsList]}
                                            label={'Агент'}
                                            type={'select'}
                                            name={'agent'}/>
                                    </Col>

                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            property={{
                                                type: 'number',
                                                disabled: isEqual(agentId, '662a2c60577082fb291c0000')
                                            }}
                                            defaultValue={isEqual(agentId, '662a2c60577082fb291c0000') ? 0 : 25}
                                            label={'Вознограждение %'}
                                            type={'input'}
                                            name={'policies[0].agentReward'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            params={{required: true}}
                                            defaultValue={5}
                                            property={{disabled: true}}
                                            label={'Отчисления в РПМ  %'}
                                            type={'input'}
                                            name={'policies[0].rpm'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={round(rewardPercent * insurancePremium / 100, 2)}
                                            property={{disabled: true}}
                                            label={'Сумма'}
                                            type={'number-format-input'}
                                            name={'rewardSum'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={round(rpmPercent * insurancePremium / 100, 2)}
                                            property={{disabled: true}}
                                            label={'Сумма'}
                                            type={'number-format-input'}
                                            name={'rpmSum'}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Section>
    </>);
};

export default CreateContainer;
