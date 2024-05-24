import React, {useEffect, useMemo, useState} from 'react';
import {find, get,  isEqual, isNil, round} from "lodash";
import Panel from "../../../../components/panel";
import Search from "../../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../../components/section";
import Title from "../../../../components/ui/title";
import Button from "../../../../components/ui/button";
import Form from "../../../../containers/form/form";
import Flex from "../../../../components/flex";
import Field from "../../../../containers/form/field";
import {useDeleteQuery, useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import {OverlayLoader} from "../../../../components/loader";
import {useNavigate} from "react-router-dom";
import {useStore} from "../../../../store";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import Checkbox from "rc-checkbox";
import Table from "../../../../components/table";
import NumberFormat from "react-number-format";
import {Eye} from "react-feather";
import Modal from "../../../../components/modal";


const ViewContainer = ({osgop_formId = null}) => {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [vehicle, setVehicle] = useState(null)
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'ОСГОП', path: '/insurance/osgop',
    }, {
        id: 2, title: 'ОСГОП', path: '/insurance/osaga',
    }], [])


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])
    const {data, isLoading} = useGetAllQuery({
        key: KEYS.osgopView,
        url: URLS.osgopView,
        params: {
            params: {
                osgop_formId: osgop_formId
            }
        },
        enabled: !!(osgop_formId)
    })

    const {data: filials} = useGetAllQuery({key: KEYS.branches, url: `${URLS.branches}/list`})
    const filialList = getSelectOptionsListFromData(get(filials, `data.data`, []), '_id', 'branchName')

    const {data: insuranceTerms, isLoading: isLoadingInsuranceTerms} = useGetAllQuery({
        key: KEYS.insuranceTerms, url: URLS.insuranceTerms
    })
    const insuranceTermsList = getSelectOptionsListFromData(get(insuranceTerms, `data.data`, []), 'id', 'name')


    const {data: region, isLoading: isLoadingRegion} = useGetAllQuery({
        key: KEYS.regions, url: `${URLS.regions}/list`
    })
    const regionList = getSelectOptionsListFromData(get(region, `data.data`, []), 'id', 'name')

    const {data: genders} = useGetAllQuery({
        key: KEYS.genders, url: `${URLS.genders}/list`
    })
    const genderList = getSelectOptionsListFromData(get(genders, `data.data`, []), '_id', 'name')

    const {data: residentTypes} = useGetAllQuery({
        key: KEYS.residentTypes, url: `${URLS.residentTypes}/list`
    })
    const residentTypeList = getSelectOptionsListFromData(get(residentTypes, `data.data`, []), '_id', 'name')


    const {data: vehicleTypes} = useGetAllQuery({
        key: KEYS.vehicleTypes, url: `${URLS.vehicleTypes}/list`
    })
    const vehicleTypeList = getSelectOptionsListFromData(get(vehicleTypes, `data.data`, []), '_id', 'name')

    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: `${URLS.ownershipForms}/list`
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.data`, []), '_id', 'name')


    const {data: agents} = useGetAllQuery({
        key: [KEYS.agents, get(data, 'data.agent')],
        url: `${URLS.agents}/list`,
        params: {
            params: {
                branch: get(data, 'data.agent')
            }
        },
        enabled: !!(get(data, 'data.agent'))
    })
    const agentsList = getSelectOptionsListFromData(get(agents, `data.data`, []), '_id', ['organization.nameoforganization', 'person.secondname', 'person.name'])

    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries, url: `${URLS.countries}/list`
    })
    const countryList = getSelectOptionsListFromData(get(country, `data.data`, []), '_id', 'name')

    const {data: okeds} = useGetAllQuery({
        key: KEYS.okeds, url: URLS.okeds
    })
    const okedList = get(okeds, `data`, []).map(_item => ({value: _item, label: _item}))

    const {data: areaTypes} = useGetAllQuery({
        key: KEYS.areaTypes, url: URLS.areaTypes
    })
    const areaTypesList = getSelectOptionsListFromData(get(areaTypes, `data.data`, []), 'id', 'name')

    const {data: district} = useGetAllQuery({
        key: [KEYS.districts, get(data, 'data.regionId')],
        url: `${URLS.districts}/list`,
        params: {
            params: {
                region: get(data, 'data.regionId')
            }
        },
        enabled: !!(get(data, 'data.regionId'))
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.data`, []), '_id', 'name')


    const {
        mutate: sendFond, isLoading: isLoadingFond
    } = usePostQuery({listKeyId: KEYS.osgopView})
    const {
        mutate: confirmPayedRequest, isLoading: isLoadingConfirmPayed
    } = usePostQuery({listKeyId: KEYS.osgopView})

    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.osgopDelete})

    const send = () => {
        sendFond({
                url: `${URLS.osgopSendFond}?osgop_formId=${osgop_formId}`, attributes: {}
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }

    const confirmPayed = () => {
        confirmPayedRequest({
                url: URLS.osgopConfirmPayment, attributes: {
                    uuid: get(data, 'data.uuid'),
                    paidAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    insurancePremium: get(data, 'data.premium', 0),
                    startDate: get(data, 'data.contractStartDate'),
                    endDate: get(data, 'data.contractEndDate')
                }
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }

    const remove = () => {
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
                deleteRequest({url: `${URLS.osgopDelete}?osgop_formId=${osgop_formId}`}, {
                    onSuccess: () => {
                        navigate('/insurance/osgop')
                    }
                })
            }
        });
    }

    if (isLoading || isLoadingRegion || isLoadingInsuranceTerms || isLoadingCountry) {
        return <OverlayLoader/>
    }

    return (<>
        {(isLoadingFond || deleteLoading || isLoadingConfirmPayed) && <OverlayLoader/>}
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
            <Form footer={!isEqual(get(data, 'data.status'), 'payed') && <Flex
                className={'mt-32'}>{(isEqual(get(data, 'data.status'), 'new') || isEqual(get(data, 'data.status'), 'edited')) && <>
                <Button onClick={remove}
                        danger type={'button'}
                        className={'mr-16'}>Удалить</Button>
                {/*<Button onClick={() => navigate(`/osgop/update/${osgop_formId}`)} yellow type={'button'}*/}
                {/*        className={'mr-16'}>Изменить</Button>*/}
            </>}
                <Button
                    onClick={(isEqual(get(data, 'data.status'), 'new') || isEqual(get(data, 'data.status'), 'edited')) ? () => send() : () => {
                    }}
                    gray={!(isEqual(get(data, 'data.status'), 'new') || isEqual(get(data, 'data.status'), 'edited'))}
                    type={'button'} className={'mr-16'}>Отправить в
                    Фонд</Button>
                <Button onClick={isEqual(get(data, 'data.status'), 'sent') ? () => confirmPayed() : () => {
                }}
                        type={'button'} gray={!isEqual(get(data, 'data.status'), 'sent')} className={'mr-16'}>Подтвердить
                    оплату</Button></Flex>}>
                <Row gutterWidth={60} className={'mt-32'}>
                    <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Статус</Col>
                            <Col xs={7}><Button green>{get(data, 'data.status')}</Button></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Филиал </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.branch')} isDisabled
                                               params={{required: true}} options={filialList}
                                               property={{hideLabel: true}} type={'select'}
                                               name={'agencyId'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Серия договора:</Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.seria')}
                                               property={{hideLabel: true, disabled: true}} type={'input'}
                                               name={'seria'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Номер договора: </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.number')}
                                               params={{required: true}}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'number'}/></Col>
                        </Row>

                    </Col>
                    <Col xs={4}>

                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Страховая сумма: </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.sum', 0)}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'number-format-input'}
                                               name={'policies[0].insuranceSum'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Страховая премия: </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.premium', 0)}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'number-format-input'}
                                               name={'policies[0].insurancePremium'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Оплачено: </Col>
                            <Col xs={7}><Field params={{required: true}}
                                               defaultValue={get(data, 'data.premium', 0) - get(data, 'data.unpaid', 0)}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'number-format-input'}
                                               name={'premium'}/></Col>
                        </Row>
                    </Col>
                    <Col xs={4}>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Срок страхования:</Col>
                            <Col xs={7}><Field isDisabled
                                               defaultValue={get(data, 'data.insuranceTermId')}
                                               options={insuranceTermsList} params={{required: true}}
                                               label={'Insurance term'} property={{hideLabel: true}}
                                               type={'select'}
                                               name={'policies[0].insuranceTermId'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Дата начала покрытия: </Col>
                            <Col xs={7}><Field
                                defaultValue={get(data, 'data.contractStartDate')} disabled
                                property={{
                                    hideLabel: true,
                                    dateFormat: 'dd.MM.yyyy'
                                }}
                                type={'datepicker'}
                                name={'policies[0].startDate'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Дача окончания покрытия: </Col>
                            <Col xs={7}><Field
                                defaultValue={get(data, 'data.contractEndDate')} disabled
                                property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                name={'policies[0].endDate'}/></Col>
                        </Row>

                    </Col>
                </Row>
                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-25'}><Title>Собственник </Title></Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={4}>
                                <Flex>
                                    <h4 className={'mr-16'}>Собственник </h4>
                                    <Button
                                        gray={!get(data, 'data.insurant.person')} className={'mr-16'}
                                        type={'button'}>Физ. лицо</Button>
                                    <Button
                                        gray={!get(data, 'data.insurant.organization')} type={'button'}>Юр.
                                        лицо</Button>
                                </Flex>
                            </Col>
                            <Col xs={8} className={'text-right'}>
                                {get(data, 'data.insurant.person') && <Flex justify={'flex-end'}>
                                    <Field
                                        defaultValue={get(data, 'data.insurant.person.passportData.seria')}
                                        disabled
                                        className={'mr-16'} style={{width: 75}}
                                        property={{
                                            hideLabel: true,
                                            mask: 'aa',
                                            placeholder: 'AA',
                                            maskChar: '_',
                                            disabled: true
                                        }}
                                        name={'passportSeries'}
                                        type={'input-mask'}
                                    />
                                    <Field
                                        defaultValue={get(data, 'data.insurant.person.passportData.number')}
                                        disabled
                                        property={{
                                            hideLabel: true,
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_'
                                        }} name={'passportNumber'} type={'input-mask'}/>

                                    <Field className={'ml-15'}
                                           defaultValue={get(data, 'data.insurant.person.birthDate')}
                                           disabled
                                           property={{
                                               hideLabel: true,
                                               placeholder: 'Дата рождения',
                                           }}
                                           name={'birthDate'} type={'datepicker'}/>
                                </Flex>}
                                {get(data, 'data.insurant.organization') && <Flex justify={'flex-end'}>
                                    <Field disabled defaultValue={get(data, 'data.insurant.organization.inn')}
                                           property={{
                                               hideLabel: true,
                                               mask: '999999999',
                                               placeholder: 'Inn',
                                               maskChar: '_'
                                           }} name={'inn'} type={'input-mask'}/>
                                </Flex>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <hr className={'mt-15 mb-15'}/>
                    </Col>
                    {get(data, 'data.insurant.person') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(data, 'data.insurant.person.fullName.firstname')}
                                label={'Firstname'}
                                type={'input'}
                                name={'insurant.person.fullName.firstname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.insurant.person.fullName.lastname')}
                                   label={'Lastname'}
                                   type={'input'}
                                   name={'insurant.person.fullName.lastname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.insurant.person.fullName.middlename')}
                                   params={{required: true}}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'insurant.person.fullName.middlename'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}}
                                   defaultValue={get(data, 'data.insurant.person.passportData.startDate')}
                                   label={'Дата выдачи паспорта'}
                                   type={'datepicker'}
                                   name={'insurant.person.passportData.startDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} property={{disabled: true}}
                                   defaultValue={get(data, 'data.insurant.person.passportData.issuedBy')}
                                   label={'Кем выдан'}
                                   type={'input'}
                                   name={'insurant.person.passportData.issuedBy'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                isDisabled
                                defaultValue={get(data, 'data.insurant.person.gender')}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'insurant.person.gender'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.insurant.person.passportData.pinfl')}
                                   label={'ПИНФЛ'} type={'input'}
                                   name={'insurant.person.passportData.pinfl'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(data, 'data.insurant.person.phone')}
                                label={'Phone'}
                                type={'input'}
                                name={'insurant.person.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.insurant.person.email')}
                                label={'Email'}
                                type={'input'}
                                name={'insurant.person.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                isDisabled
                                options={residentTypeList}
                                defaultValue={get(data, 'data.insurant.person.residentType')}
                                label={'Resident type'}
                                type={'select'}
                                name={'insurant.person.residentType'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.insurant.person.driverLicenseSeria')}
                                property={{disabled: true}}
                                label={'Серия вод. удостоверения'}
                                type={'input'}
                                name={'insurant.person.driverLicenseSeria'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.insurant.person.driverLicenseNumber')}
                                property={{disabled: true}}
                                label={'Номер вод. удостоверения'}
                                type={'input'}
                                name={'insurant.person.driverLicenseNumber'}/>
                        </Col>

                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                defaultValue={get(data, 'data.insurant.person.countryId')}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'insurant.person.countryId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={regionList}
                                defaultValue={String(get(data, 'data.insurant.person.regionId'))}
                                label={'Region'}
                                type={'select'}
                                name={'insurant.person.regionId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(data, 'data.insurant.person.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'insurant.person.districtId'}/>
                        </Col>

                        <Col xs={3}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={areaTypesList}
                                defaultValue={get(data, 'data.areaTypeId')}
                                label={'Тип местности'}
                                type={'select'}
                                name={'insurant.person.areaTypeId'}/>
                        </Col>
                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.insurant.person.address')}
                                label={'Address'}
                                type={'input'}
                                name={'insurant.person.address'}/>
                        </Col>

                    </>}
                    {get(data, 'data.insurant.organization') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.insurant.organization.name')}
                                   label={'Наименование'} type={'input'}
                                   name={'insurant.organization.name'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.insurant.organization.representativeName')}
                                   label={'Руководитель'} type={'input'}
                                   name={'insurant.organization.representativeName'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.insurant.organization.position')}
                                   label={'Должность'} type={'input'}
                                   name={'insurant.organization.position'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.insurant.organization.email')} label={'Email'}
                                   type={'input'}
                                   name={'insurant.organization.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.insurant.organization.phone')}
                                   params={{required: true}}
                                   label={'Телефон'} type={'input'}
                                   name={'insurant.organization.phone'}/>
                        </Col>
                        <Col xs={3}><Field

                            disabled
                            defaultValue={get(data, 'data.insurant.organization.oked')}
                            label={'Oked'} params={{required: true}}
                            options={okedList}
                            type={'select'}
                            name={'insurant.organization.oked'}/>
                        </Col>

                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.insurant.organization.checkingAccount')}
                                   label={'Расчетный счет'} type={'input'}
                                   name={'insurant.organization.checkingAccount'}/>
                        </Col>
                        <Col xs={3}><Field disabled
                                           defaultValue={get(data, 'data.insurant.organization.ownershipFormId')}
                                           label={'Форма собственности'} params={{required: true}}
                                           options={ownershipFormList}
                                           type={'select'}
                                           name={'insurant.organization.ownershipFormId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                defaultValue={get(data, 'data.insurant.organization.countryId')}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'owner.organization.countryId'}/>
                        </Col>
                        <Col xs={3}><Field defaultValue={String(get(data, 'data.insurant.organization.regionId'))}
                                           disabled
                                           label={'Область'} params={{required: true}} options={regionList}
                                           type={'select'}
                                           name={'insurant.organization.regionId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(data, 'data.insurant.organization.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'owner.organization.districtId'}/>
                        </Col>


                        <Col xs={3}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={areaTypesList}
                                defaultValue={get(data, 'data.areaTypeId')}
                                label={'Тип местности'}
                                type={'select'}
                                name={'insurant.organization.areaTypeId'}/>
                        </Col>
                        <Col xs={6} className={'mb-25'}>

                            <Field
                                noMaxWidth
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.insurant.organization.address')}
                                label={'Address'}
                                type={'input'}
                                name={'insurant.organization.address'}/>
                        </Col>

                    </>}
                    <Col xs={12} className={'mt-15'}><Checkbox disabled
                                                               checked={get(data, 'data.insurantIsOwner')}
                                                               className={'mr-5'}/><strong>Собственник является
                        Страхователем</strong></Col>
                </Row>
                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-25'}><Title>Страхователь </Title></Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={4}>
                                <Flex>
                                    <h4 className={'mr-16'}>Страхователь </h4>
                                    <Button
                                        gray={!get(data, 'data.owner.person')} className={'mr-16'}
                                        type={'button'}>Физ. лицо</Button>
                                    <Button
                                        gray={!get(data, 'data.owner.organization')} type={'button'}>Юр.
                                        лицо</Button>
                                </Flex>
                            </Col>
                            <Col xs={8} className={'text-right'}>
                                {get(data, 'data.owner.person') && <Flex justify={'flex-end'}>
                                    <Field
                                        defaultValue={get(data, 'data.owner.person.passportData.seria')}
                                        disabled
                                        className={'mr-16'} style={{width: 75}}
                                        property={{
                                            hideLabel: true,
                                            mask: 'aa',
                                            placeholder: 'AA',
                                            maskChar: '_',
                                            disabled: true
                                        }}
                                        name={'passportSeries'}
                                        type={'input-mask'}
                                    />
                                    <Field
                                        defaultValue={get(data, 'data.owner.person.passportData.number')}
                                        disabled
                                        property={{
                                            hideLabel: true,
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_'
                                        }} name={'passportNumber'} type={'input-mask'}/>

                                    <Field className={'ml-15'}
                                           defaultValue={get(data, 'data.owner.person.birthDate')}
                                           disabled
                                           property={{
                                               hideLabel: true,
                                               placeholder: 'Дата рождения',
                                           }}
                                           name={'birthDate'} type={'datepicker'}/>
                                </Flex>}
                                {get(data, 'data.owner.organization') && <Flex justify={'flex-end'}>
                                    <Field disabled defaultValue={get(data, 'data.owner.organization.inn')}
                                           property={{
                                               hideLabel: true,
                                               mask: '999999999',
                                               placeholder: 'Inn',
                                               maskChar: '_'
                                           }} name={'inn'} type={'input-mask'}/>
                                </Flex>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <hr className={'mt-15 mb-15'}/>
                    </Col>
                    {get(data, 'data.owner.person') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(data, 'data.owner.person.fullName.firstname')}
                                label={'Firstname'}
                                type={'input'}
                                name={'insurant.person.fullName.firstname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.owner.person.fullName.lastname')}
                                   label={'Lastname'}
                                   type={'input'}
                                   name={'insurant.person.fullName.lastname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.owner.person.fullName.middlename')}
                                   params={{required: true}}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'insurant.person.fullName.middlename'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}}
                                   defaultValue={get(data, 'data.owner.person.passportData.startDate')}
                                   label={'Дата выдачи паспорта'}
                                   type={'datepicker'}
                                   name={'insurant.person.passportData.startDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} property={{disabled: true}}
                                   defaultValue={get(data, 'data.owner.person.passportData.issuedBy')}
                                   label={'Кем выдан'}
                                   type={'input'}
                                   name={'insurant.person.passportData.issuedBy'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                defaultValue={get(data, 'data.owner.person.gender')}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'insurant.person.gender'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.owner.person.passportData.pinfl')}
                                   label={'ПИНФЛ'} type={'input'}
                                   name={'insurant.person.passportData.pinfl'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(data, 'data.owner.person.phone')}
                                label={'Phone'}
                                type={'input'}
                                name={'insurant.person.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.owner.person.email')}
                                label={'Email'}
                                type={'input'}
                                name={'insurant.person.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                options={residentTypeList}
                                defaultValue={get(data, 'data.owner.person.residentType')}
                                label={'Resident type'}
                                type={'select'}
                                name={'insurant.person.residentType'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.owner.person.driverLicenseSeria')}
                                property={{disabled: true}}
                                label={'Серия вод. удостоверения'}
                                type={'input'}
                                name={'insurant.person.driverLicenseSeria'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.owner.person.driverLicenseNumber')}
                                property={{disabled: true}}
                                label={'Номер вод. удостоверения'}
                                type={'input'}
                                name={'insurant.person.driverLicenseNumber'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                defaultValue={get(data, 'data.owner.person.countryId')}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'insurant.person.countryId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={regionList}
                                defaultValue={get(data, 'data.owner.person.regionId')}
                                label={'Region'}
                                type={'select'}
                                name={'insurant.person.regionId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(data, 'data.owner.person.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'owner.person.districtId'}/>
                        </Col>


                        <Col xs={3}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={areaTypesList}
                                defaultValue={get(data, 'data.areaTypeId')}
                                label={'Тип местности'}
                                type={'select'}
                                name={'insurant.person.areaTypeId'}/>
                        </Col>
                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.owner.person.address')}
                                label={'Address'}
                                type={'input'}
                                name={'insurant.person.address'}/>
                        </Col>

                    </>}
                    {get(data, 'data.owner.organization') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.owner.organization.name')}
                                   label={'Наименование'} type={'input'}
                                   name={'insurant.organization.name'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.owner.organization.representativeName')}
                                   label={'Руководитель'} type={'input'}
                                   name={'insurant.organization.representativeName'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.owner.organization.position')}
                                   label={'Должность'} type={'input'}
                                   name={'insurant.organization.position'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.owner.organization.email')} label={'Email'}
                                   type={'input'}
                                   name={'insurant.organization.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.owner.organization.phone')}
                                   params={{required: true}}
                                   label={'Телефон'} type={'input'}
                                   name={'insurant.organization.phone'}/>
                        </Col>
                        <Col xs={3}><Field disabled
                                           defaultValue={parseInt(get(data, 'data.owner.organization.oked'))}
                                           label={'Oked'} params={{required: true}}
                                           options={okedList}
                                           type={'select'}
                                           name={'insurant.organization.oked'}/></Col>

                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.owner.organization.checkingAccount')}
                                   label={'Расчетный счет'} type={'input'}
                                   name={'insurant.organization.checkingAccount'}/>
                        </Col>
                        <Col xs={3}><Field disabled
                                           defaultValue={get(data, 'data.owner.organization.ownershipFormId')}
                                           label={'Форма собственности'} params={{required: true}}
                                           options={ownershipFormList}
                                           type={'select'}
                                           name={'insurant.organization.ownershipFormId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                defaultValue={get(data, 'data.owner.organization.countryId')}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'owner.organization.countryId'}/>
                        </Col>
                        <Col xs={3}><Field defaultValue={String(get(data, 'data.owner.organization.regionId'))} disabled
                                           label={'Область'} params={{required: true}} options={regionList}
                                           type={'select'}
                                           name={'insurant.organization.regionId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(data, 'data.owner.organization.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'owner.organization.districtId'}/>
                        </Col>


                        <Col xs={3}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={areaTypesList}
                                defaultValue={get(data, 'data.areaTypeId')}
                                label={'Тип местности'}
                                type={'select'}
                                name={'insurant.organization.areaTypeId'}/>
                        </Col>
                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.owner.organization.address')}
                                label={'Address'}
                                type={'input'}
                                name={'insurant.organization.address'}/>
                        </Col>

                    </>}
                </Row>
                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-15'}><Title>Объекты страхования</Title></Col>
                    <Col xs={12}>
                        <div className={'horizontal-scroll mt-15 mb-25'}>
                            <Table bordered hideThead={false}
                                   thead={['№ ', 'Вид ТС', 'Модель ТС', 'Гос.номер', 'Страховая премия', 'Страховая сумма', 'Серия полиса', 'Номер полиса', 'Action']}>
                                {
                                    get(data, 'data.policies', []).map((item, index) => <tr>
                                        <td>{index + 1}</td>
                                        <td>{get(find(vehicleTypeList, (_vehicle) => get(_vehicle, 'value') == get(item, 'objects[0].vehicle.vehicleTypeId')), 'label', '-')}</td>
                                        <td>{get(item, 'objects[0].vehicle.modelCustomName')}</td>
                                        <td>{get(item, 'objects[0].vehicle.govNumber')}</td>
                                        <td><NumberFormat value={get(item, 'insurancePremium', 0)}
                                                          displayType={'text'} thousandSeparator={' '}/></td>
                                        <td><NumberFormat value={get(item, 'insuranceSum', 0)}
                                                          displayType={'text'} thousandSeparator={' '}/></td>
                                        <td>{get(item, 'seria')}</td>
                                        <td>{get(item, 'number')}</td>
                                        <td><Eye onClick={() => setVehicle(item)} className={'cursor-pointer'}/></td>

                                    </tr>)
                                }
                            </Table>
                        </div>
                    </Col>
                </Row>

                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-25'}><Title>Агентсткое вознограждение и РПМ</Title></Col>
                    <Col xs={6}>
                        <Row>
                            <Col xs={12} className={'mb-25'}>
                                <Field
                                    disabled
                                    defaultValue={get(data, 'data.agent')}
                                    options={[...agentsList]}
                                    label={'Агент'}
                                    type={'select'}
                                    name={'agentId'}/>
                            </Col>

                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    property={{type: 'number', disabled: true}}
                                    defaultValue={get(data, 'data.agentReward', 20)}
                                    label={'Вознограждение %'}
                                    type={'input'}
                                    name={'agentReward'}/>
                            </Col>
                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    defaultValue={get(data, 'data.rpm', 5)}
                                    property={{disabled: true}}
                                    label={'Отчисления в РПМ  %'}
                                    type={'input'}
                                    name={'rpmPercent'}/>
                            </Col>
                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    defaultValue={get(data, 'data.comission', 0)}
                                    property={{disabled: true}}
                                    label={'Сумма'}
                                    type={'number-format-input'}
                                    name={'rewardSum'}/>
                            </Col>
                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    defaultValue={round(get(data, 'data.rpm', 5) * get(data, 'data.premium', 0) / 100, 2)}
                                    property={{disabled: true}}
                                    label={'Сумма'}
                                    type={'number-format-input'}
                                    name={'rpmSum'}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
            <Modal title={'Oбъекта страхования'} hide={() => setVehicle(null)} visible={!isNil(vehicle)}>
                <Form
                >
                    <Row align={'end'}>
                        <Col xs={9} className={' mt-15'}>
                            <Flex align={'items-end'}>
                                <Field
                                    defaultValue={get(vehicle, 'objects[0].vehicle.govNumber')}
                                    property={{disabled: true}}
                                    params={{required: true}}
                                    className={'mr-16'}
                                    label={'Гос.номер'}
                                    name={'vehicle.objects[0].vehicle.govNumber'}
                                    type={'input'}
                                />
                                <Field params={{required: true}} className={'mr-16'}
                                       defaultValue={get(vehicle, 'objects[0].vehicle.techPassport.seria')}
                                       property={{disabled: true}}
                                       name={'vehicle.objects[0].vehicle.techPassport.seria'}
                                       type={'input'}
                                       label={'Серия тех.паспорта'}
                                />

                                <Field params={{required: true}}
                                       defaultValue={get(vehicle, 'objects[0].vehicle.techPassport.number')}
                                       property={{disabled: true}}
                                       name={'vehicle.objects[0].vehicle.techPassport.number'} type={'input'}
                                       label={'Номер тех.паспорта'}
                                />

                            </Flex></Col>
                        <Col xs={12}>
                            <hr className={'mt-15'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={vehicleTypeList}
                                defaultValue={get(vehicle, 'objects[0].vehicle.vehicleTypeId', 0)} label={'Вид ТС'}
                                type={'select'}
                                name={'vehicle.objects[0].vehicle.vehicleTypeId'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                property={{disabled: true}}
                                params={{required: true}}
                                defaultValue={get(vehicle, 'objects[0].vehicle.modelCustomName')} label={'Модель ТС'}
                                type={'input'}
                                name={'vehicle.objects[0].vehicle.modelCustomName'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(vehicle, 'objects[0].vehicle.bodyNumber')}
                                   label={'Номер кузова (шасси)'}
                                   type={'input'}
                                   name={'vehicle.objects[0].vehicle.bodyNumber'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                defaultValue={get(vehicle, 'objects[0].vehicle.liftingCapacity')}
                                label={'Грузоподъемность'}
                                property={{type: 'number', disabled: true}}
                                type={'input'}
                                name={'vehicle.objects[0].vehicle.liftingCapacity'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{required: true, valueAsNumber: true}}
                                defaultValue={get(vehicle, 'objects[0].vehicle.numberOfSeats')}
                                label={'Количество мест сидения'}
                                property={{type: 'number', disabled: true}}
                                type={'input'}
                                name={'vehicle.objects[0].vehicle.numberOfSeats'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(vehicle, 'objects[0].vehicle.issueYear')}
                                   label={'Год выпуска'} type={'input'}
                                   name={'vehicle.objects[0].vehicle.issueYear'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(vehicle, 'objects[0].vehicle.engineNumber')}
                                   label={'Номер двигателя'} type={'input'}
                                   name={'vehicle.objects[0].vehicle.engineNumber'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                defaultValue={get(vehicle, 'objects[0].vehicle.isForeign', false)}
                                disabled
                                label={'Иностранный'} type={'switch'}
                                name={'vehicle.objects[0].vehicle.isForeign'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field disabled params={{required: true}}
                                   options={regionList}
                                   defaultValue={String(get(vehicle, 'objects[0].vehicle.regionId'))}
                                   label={'Регион регистрации'}
                                   type={'select'}
                                   name={'vehicle.objects[0].vehicle.regionId'}/>
                        </Col>
                        <Col xs={12} className={'mt-15'}>
                            <hr/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{required: true}}
                                property={{disabled: true}}
                                defaultValue={get(vehicle, 'objects[0].vehicle.passengerCapacity', 0)}
                                label={'Пассажировместимость ТС'}
                                type={'number-format-input'}
                                name={'vehicle.passengerCapacity'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{required: true}}
                                property={{disabled: true}}
                                defaultValue={get(vehicle, 'insuranceSum', 0)}
                                label={'Страховая сумма'}
                                type={'number-format-input'}
                                name={'vehicle.insuranceSum'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{required: true}}
                                property={{disabled: true}}
                                defaultValue={get(vehicle, 'annualBaseRate', 0)}
                                label={'Годовая базовая ставка'}
                                type={'number-format-input'}
                                name={'vehicle.insuranceRate'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{required: true}}
                                property={{disabled: true}}
                                defaultValue={get(vehicle, 'insurancePremium', 0)}
                                label={'Страховая премия'}
                                type={'number-format-input'}
                                name={'vehicle.insurancePremium'}/>
                        </Col>
                        <Col xs={12}>
                            <hr className={'mt-15'}/>
                        </Col>

                        <Col xs={4} className={'mt-15'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(vehicle, 'seria')}
                                   label={'Серия полиса'}
                                   type={'input'}
                                   name={'vehicle.objects[0].vehicle.seria'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(vehicle, 'number')}
                                   label={'Номер полиса'}
                                   type={'input'}
                                   name={'vehicle.objects[0].vehicle.number'}/>
                        </Col>
                        {get(data, 'data.sentDate') && <Col xs={4} className={'mt-15'}>
                            <Field disabled params={{required: true}}
                                   defaultValue={get(data, 'data.sentDate')}
                                   label={'Дата отправки в фонд'}
                                   type={'datepicker'}
                                   name={'vehicle.objectsvehicle.sendDate'}/>
                        </Col>}
                    </Row>
                </Form>
            </Modal>
        </Section>
    </>);
};

export default ViewContainer;