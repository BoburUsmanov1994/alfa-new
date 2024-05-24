import React, {useEffect, useMemo, useState} from 'react';
import {find, get, head, isEqual, isNil, round} from "lodash";
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


const ViewContainer = ({form_id = null}) => {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'ОСГОР ', path: '/insurance/osgor',
    }, {
        id: 2, title: 'ОСГОР', path: '/insurance/osgor',
    }], [])


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])
    const {data, isLoading} = useGetAllQuery({
        key: KEYS.osgorView,
        url: URLS.osgorView,
        params: {
            params: {
                osgor_formId: form_id
            }
        },
        enabled: !!(form_id)
    })

    const {data: filials, isLoading: isLoadingFilials} = useGetAllQuery({
        key: KEYS.branches,
        url: `${URLS.branches}/list`
    })
    const filialList = getSelectOptionsListFromData(get(filials, `data.data`, []), '_id', 'branchName')

    const {data: insuranceTerms, isLoading: isLoadingInsuranceTerms} = useGetAllQuery({
        key: KEYS.insuranceTerms, url: URLS.insuranceTerms
    })
    const insuranceTermsList = getSelectOptionsListFromData(get(insuranceTerms, `data.data`, []), 'id', 'name')

    const {data: okeds} = useGetAllQuery({
        key: KEYS.okeds, url: URLS.okeds
    })
    const okedList = get(okeds, `data`, []).map(_item => ({value: _item, label: _item}))

    const {data: region, isLoading: isLoadingRegion} = useGetAllQuery({
        key: KEYS.regions, url: `${URLS.regions}/list`
    })
    const regionList = getSelectOptionsListFromData(get(region, `data.data`, []), 'id', 'name')

    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: `${URLS.ownershipForms}/list`
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.data`, []), '_id', 'name')

    const {data: genders} = useGetAllQuery({
        key: KEYS.genders, url: `${URLS.genders}/list`
    })
    const genderList = getSelectOptionsListFromData(get(genders, `data.data`, []), '_id', 'name')

    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries, url: `${URLS.countries}/list`
    })
    const countryList = getSelectOptionsListFromData(get(country, `data.data`, []), 'id', 'name')

    const {data: residentTypes} = useGetAllQuery({
        key: KEYS.residentTypes, url: `${URLS.residentTypes}/list`
    })
    const residentTypeList = getSelectOptionsListFromData(get(residentTypes, `data.data`, []), 'id', 'name')

    const {data: agents} = useGetAllQuery({
        key: [KEYS.agents, get(data, 'data.branch')],
        url: `${URLS.agents}/list`,
        params: {
            params: {
                branch: get(data, 'data.branch')
            }
        },
        enabled: !!(get(data, 'data.branch'))
    })
    const agentsList = getSelectOptionsListFromData(get(agents, `data.data`, []), '_id', ['organization.nameoforganization', 'person.secondname', 'person.name'])

    const {data: activity} = useGetAllQuery({
        key: [KEYS.activityAndRisk],
        url: URLS.activityAndRisk,
        params: {
            params: {
                oked: get(data, 'data.insurant.organization.oked') ?? get(data, 'data.insurant.person.oked')
            }
        },
        enabled: !!(get(data, 'data.insurant.organization.oked') || get(data, 'data.insurant.person.oked'))
    })
    const activityList = getSelectOptionsListFromData([{
        oked: get(activity, `data.oked`),
        name: get(activity, `data.name`)
    }], 'oked', 'name')

    const {
        mutate: sendFond, isLoading: isLoadingFond
    } = usePostQuery({listKeyId: KEYS.osgorView})
    const {
        mutate: confirmPayedRequest, isLoading: isLoadingConfirmPayed
    } = usePostQuery({listKeyId: KEYS.osgorView})

    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.osgorDelete})

    const send = () => {
        sendFond({
                url: `${URLS.osgorSendFond}?osgor_formId=${form_id}`, attributes: {}
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }

    const confirmPayed = () => {
        confirmPayedRequest({
                url: URLS.osgorConfirmPayment, attributes: {
                    uuid: get(data, 'data.uuid'),
                    polisUuid: get(head(get(data, 'data.policies', [])), 'uuid'),
                    paidAt: dayjs(get(head(get(data, 'data.policies', [])), 'issueDate')).format("YYYY-MM-DD HH:mm:ss"),
                    insurancePremium: get(head(get(data, 'data.policies', [])), 'insurancePremium'),
                    startDate: get(head(get(data, 'data.policies', [])), 'startDate'),
                    endDate: get(head(get(data, 'data.policies', [])), 'endDate')
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
                deleteRequest({url: `${URLS.osgorDelete}?osgor_formId=${form_id}`}, {
                    onSuccess: () => {
                        navigate('/insurance/osgor')
                    }
                })
            }
        });
    }

    if (isLoading || isLoadingFilials || isLoadingInsuranceTerms || isLoadingRegion || isLoadingCountry) {
        return <OverlayLoader/>
    }

    console.log('data', data)
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
            <Row>
                <Col xs={12}>
                    <Form
                        footer={!isEqual(get(data, 'data.status'), 'payed') && <Flex
                            className={'mt-32'}>{(isEqual(get(data, 'data.status'), 'new') || isEqual(get(data, 'data.status'), 'edited')) && <>
                            <Button onClick={remove}
                                    danger type={'button'}
                                    className={'mr-16'}>Удалить</Button>
                            {/*<Button onClick={() => navigate(`/osgor/update/${form_id}`)} yellow type={'button'}*/}
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
                                    type={'button'} gray={!isEqual(get(data, 'data.status'), 'sent')}
                                    className={'mr-16'}>Подтвердить
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
                                {
                                    isEqual(get(data, 'data.status'), 'payed') && <>
                                        <Row align={'center'} className={'mb-25'}>
                                            <Col xs={5}>Серия полиса: </Col>
                                            <Col xs={7}><Field defaultValue={get(data, 'data.policies[0].seria')}
                                                               params={{required: true}}
                                                               property={{hideLabel: true, disabled: true}}
                                                               type={'input'}
                                                               name={'data.result.policies[0].seria'}/></Col>
                                        </Row>
                                        <Row align={'center'} className={'mb-25'}>
                                            <Col xs={5}>Номер полиса: </Col>
                                            <Col xs={7}><Field defaultValue={get(data, 'data.policies[0].number')}
                                                               params={{required: true}}
                                                               property={{hideLabel: true, disabled: true}}
                                                               type={'input'}
                                                               name={'data.result.policies[0].number'}/></Col>
                                        </Row>
                                    </>
                                }
                                {
                                    (isEqual(get(data, 'data.status'), 'sent') || isEqual(get(data, 'data.status'), 'payed')) && <>
                                        <Row align={'center'} className={'mb-25'}>
                                            <Col xs={5}>Дата отправки в Фонд: </Col>
                                            <Col xs={7}><Field
                                                defaultValue={get(data, 'data.sentDate')} disabled
                                                property={{
                                                    hideLabel: true,
                                                    dateFormat: 'yyyy-MM-dd'
                                                }}
                                                type={'datepicker'}
                                                name={'policies[0].sentDate'}/></Col>
                                        </Row>

                                    </>
                                }

                            </Col>
                            <Col xs={4}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая сумма: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.policies[0].insuranceSum')}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'number-format-input'}
                                                       name={'policies[0].insuranceSum'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая премия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.policies[0].insurancePremium')}
                                        property={{hideLabel: true, disabled: true}}
                                        type={'number-format-input'}
                                        name={'policies[0].insurancePremium'}/></Col>
                                </Row>
                                {
                                    isEqual(get(data, 'data.status'), 'payed') &&
                                    <Row align={'center'} className={'mb-25'}>
                                        <Col xs={5}>Оплачено: </Col>
                                        <Col xs={7}><Field
                                            defaultValue={get(data, 'data.policies[0].insurancePremium')}
                                            property={{hideLabel: true, disabled: true}}
                                            type={'number-format-input'}
                                            name={'policies[0].insurancePremium'}/></Col>
                                    </Row>
                                }


                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Срок страхования:</Col>
                                    <Col xs={7}><Field isDisabled
                                                       defaultValue={get(data, 'data.policies[0].insuranceTermId')}
                                                       options={insuranceTermsList} params={{required: true}}
                                                       label={'Insurance term'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'policies[0].insuranceTermId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата начала покрытия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.policies[0].startDate')} disabled
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
                                        defaultValue={get(data, 'data.policies[0].endDate')} disabled
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'policies[0].endDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата выдачи полиса: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.policies[0].issueDate')}
                                                       disabled property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                                       type={'datepicker'}
                                                       name={'policies[0].issueDate'}/></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Страхователь</Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={12}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Страхователь</h4>
                                            <Button
                                                gray={!get(data, 'data.insurant.person')} className={'mr-16'}
                                                type={'button'}>Физ. лицо</Button>
                                            <Button
                                                gray={!get(data, 'data.insurant.organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>

                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {get(data, 'data.insurant.person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.person.fullName.firstname')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'insurant.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.person.fullName.lastname')}
                                           label={'Lastname'} type={'input'}
                                           name={'insurant.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.person.fullName.middlename')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'insurant.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.person.passportData.pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'insurant.person.passportData.pinfl'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field disabled property={{
                                        mask: 'aa',
                                        placeholder: 'AA',
                                        maskChar: '_'
                                    }} defaultValue={get(data, 'data.insurant.person.passportData.seria')}
                                           label={'Passport seria'} type={'input-mask'}
                                           name={'insurant.person.passportData.seria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field disabled property={{
                                        mask: '9999999',
                                        placeholder: '1234567',
                                        maskChar: '_',
                                    }} defaultValue={get(data, 'data.insurant.person.passportData.number')}
                                           label={'Passport number'} type={'input-mask'}
                                           name={'insurant.person.passportData.number'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={get(data, 'data.insurant.person.birthDate')}
                                        label={'Birth date'}
                                        type={'datepicker'}
                                        name={'insurant.person.birthDate'}/>
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
                                    <Field
                                        isDisabled
                                        options={countryList}
                                        defaultValue={get(data, 'data.insurant.person.countryId')}
                                        label={'Country'}
                                        type={'select'}
                                        name={'insurant.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        isDisabled
                                        options={regionList}
                                        defaultValue={String(get(data, 'data.insurant.person.regionId'))}
                                        label={'Region'}
                                        type={'select'}
                                        name={'insurant.person.regionId'}/>
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
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.insurant.person.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'insurant.person.address'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
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
                                        defaultValue={get(data, 'data.insurant.person.oked')}
                                        options={okedList}
                                        label={'Oked'}
                                        type={'select'}
                                        name={'insurant.person.oked'}/>
                                </Col>

                            </>}
                            {get(data, 'data.insurant.organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field disabled props={{required: true}} label={'INN'}
                                           defaultValue={get(data, 'data.insurant.organization.inn')} property={{
                                        mask: '999999999',
                                        placeholder: 'Inn',
                                        maskChar: '_'
                                    }} name={'insurant.organization.inn'} type={'input-mask'}/>

                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}} props={{required: true}}
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
                                           defaultValue={get(data, 'data.insurant.organization.phone')}
                                           props={{required: true}}
                                           label={'Телефон'} type={'input'}
                                           name={'insurant.organization.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.organization.email')}
                                           label={'Email'} type={'input'}
                                           name={'insurant.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        isDisabled
                                        options={okedList}
                                        defaultValue={get(data, 'data.insurant.organization.oked')}
                                        label={'ОКЭД'}
                                        type={'select'}
                                        name={'insurant.organization.oked'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.organization.checkingAccount')}
                                           label={'Расчетный счет'} type={'input'}
                                           name={'insurant.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field isDisabled
                                                   defaultValue={String(get(data, 'data.insurant.organization.regionId'))}
                                                   label={'Область'} params={{required: true}} options={regionList}
                                                   type={'select'}
                                                   name={'insurant.organization.regionId'}/></Col>
                                <Col xs={3}><Field isDisabled
                                                   defaultValue={get(data, 'data.insurant.organization.ownershipFormId')}
                                                   label={'Форма собственности'} params={{required: true}}
                                                   options={ownershipFormList}
                                                   type={'select'}
                                                   name={'insurant.organization.ownershipFormId'}/></Col>
                            </>}
                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Вид деятельности</Title></Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    isDisabled
                                    defaultValue={get(head(activityList), 'value')}
                                    options={activityList}
                                    label={'Вид деятельности (по правилам)'}
                                    type={'select'}
                                    name={'activityRisk'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    isDisabled
                                    defaultValue={get(data, 'data.policies[0].risk')}
                                    options={getSelectOptionsListFromData(get(activity, 'data.risks', []), 'number', 'number')}
                                    label={'Класс проф. риска'}
                                    type={'select'}
                                    name={'risk'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(data, 'data.policies[0].insuranceRate', 0)}
                                    property={{disabled: true}}
                                    label={'Коэффициент страхового тарифа'}
                                    type={'input'}
                                    name={'comission'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    property={{disabled: true}}
                                    defaultValue={get(data, 'data.policies[0].funeralExpensesSum', 0)}
                                    label={'Расходы на погребение'}
                                    type={'number-format-input'}
                                    name={'funeralExpensesSum'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    property={{disabled: true}}
                                    defaultValue={get(data, 'data.policies[0].fot', 0)}
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
                                            isDisabled
                                            defaultValue={get(data, 'data.agent')}
                                            options={[...agentsList]}
                                            label={'Агент'}
                                            type={'select'}
                                            name={'agent'}/>
                                    </Col>

                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={get(data, 'data.policies[0].agentReward', 25)}
                                            property={{disabled: true}}
                                            label={'Вознограждение %'}
                                            type={'input'}
                                            name={'policies[0].agentReward'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={5}
                                            property={{disabled: true}}
                                            label={'Отчисления в РПМ  %'}
                                            type={'input'}
                                            name={'policies[0].rpm'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={round(get(data, 'data.agent') == '0' ? 0 : 25 * get(data, 'data.policies[0].insurancePremium') / 100, 2)}
                                            property={{disabled: true}}
                                            label={'Сумма'}
                                            type={'number-format-input'}
                                            name={'rewardSum'}/>
                                    </Col>
                                    <Col xs={6} className={'mb-25'}>
                                        <Field
                                            defaultValue={round(5 * get(data, 'data.policies[0].insurancePremium') / 100, 2)}
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

export default ViewContainer;