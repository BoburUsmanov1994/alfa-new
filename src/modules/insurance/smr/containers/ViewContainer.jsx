import React, {useEffect, useMemo, useState} from 'react';
import {useSettingsStore, useStore} from "../../../../store";
import {get, isEqual, isNil} from "lodash";
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
import {ContentLoader, OverlayLoader} from "../../../../components/loader";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Swal from "sweetalert2";
import {getSelectOptionsListFromData} from "../../../../utils";
import dayjs from "dayjs";
import Table from "../../../../components/table";
import Checkbox from "rc-checkbox";
import NumberFormat from "react-number-format";
import Modal from "../../../../components/modal";
import {Download, Upload} from "react-feather";


const ViewContainer = ({contract_id = null}) => {
    const [inn, setInn] = useState(null)
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [transactionId, setTransactionId] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const navigate = useNavigate();
    const username = useSettingsStore(state => get(state, 'username', {}))
    const user = useStore(state => get(state, 'user'))
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'СМР', path: '/insurance/smr',
    }], [])

    const {t} = useTranslation()

    const role = useSettingsStore(state => get(state, 'role', 'admin'))

    const {data, isLoading} = useGetAllQuery({
        key: KEYS.smrView,
        url: URLS.smrView,
        params: {
            params: {
                contract_id: contract_id
            }
        },
        enabled: !!(contract_id)
    })
    const {data: imgData, isLoading: isLoadingImgData} = useGetAllQuery({
        key: KEYS.getPolisFile,
        url: URLS.getPolisFile,
        params: {
            params: {
                contract_id: contract_id
            }
        },
        enabled: !!(contract_id)
    })

    const {data: branches, isLoading: isLoadingBranches} = useGetAllQuery({
        key: KEYS.branches,
        url: `${URLS.branches}/list`,
    })

    const branchesList = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')

    const {data: okeds, isLoading: isLoadingOkeds} = useGetAllQuery({
        key: KEYS.okeds,
        url: URLS.okeds,
    })

    const okedList = get(okeds, `data`, []).map(_item => ({value: _item, label: _item}))

    const {data: areaTypes, isLoading: isLoadingAreaTypes} = useGetAllQuery({
        key: KEYS.areaTypes,
        url: URLS.areaTypes,
    })

    const areaTypesList = getSelectOptionsListFromData(get(areaTypes, `data.data`, []), 'id', 'name')

    const {data: ownershipForms, isLoading: isLoadingOwnershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms,
        url: `${URLS.ownershipForms}/list`,
    })

    const ownershipFormsList = getSelectOptionsListFromData(get(ownershipForms, `data.data`, []), '_id', 'name')

    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries,
        url: `${URLS.countries}/list`,
    })

    const countryList = getSelectOptionsListFromData(get(country, `data.data`, []), 'id', 'name')

    const {data: regions, isLoading: isLoadingRegion} = useGetAllQuery({
        key: KEYS.regions,
        url: `${URLS.regions}/list`,
    })

    const regionsList = getSelectOptionsListFromData(get(regions, `data.data`, []), 'id', 'name')

    const {data: districts, isLoading: isLoadingDistrict} = useGetAllQuery({
        key: KEYS.districts,
        url: `${URLS.districts}/list`,
        params: {
            params: {
                region: get(data, 'data.insurant.regionId')
            }
        },
        enabled: !!(get(data, 'data.insurant.regionId'))
    })

    const districtList = getSelectOptionsListFromData(get(districts, `data.data`, []), 'id', 'name')
    let {data: transactions, isLoading: _isLoading} = useGetAllQuery({
        key: KEYS.transactions, url: `${URLS.transactions}/list`, params: {
            params: {
                branch: get(user, 'branch._id'),
                limit: 100
            }
        }
    })
    const {
        mutate: confirmPayedRequest, isLoading: isLoadingConfirmPayed
    } = usePostQuery({listKeyId: KEYS.smrView})
    const {
        mutate: sendFondRequest, isLoading: isLoadingSendFond
    } = usePostQuery({listKeyId: KEYS.smrView})
    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.smrDelete})

    const {mutate: attachRequest, isLoading: isLoadingAttach} = usePostQuery({listKeyId: KEYS.smrView})

    const confirmPayed = () => {
        confirmPayedRequest({
                url: URLS.smrConfirmPayment, attributes: {
                    contract_id: parseInt(contract_id),
                    payment_date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    ins_premium: String(get(data, 'data.policy.ins_premium'))
                }
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }

    const sendFond = () => {
        sendFondRequest({
                url: `${URLS.smrSendFond}?contract_id=${parseInt(contract_id)}`
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }

    const attach = ({data}) => {
        const {attachmentSum} = data;
        attachRequest({
            url: `${URLS.smrAttach}?contract_id=${contract_id}`,
            attributes: {
                attach: true,
                transaction: transactionId,
                attachmentSum,
            }
        }, {
            onSuccess: () => {
                setTransactionId(null)
                setOpenModal(false)
            },
            onError: () => {

            }
        })
    }

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


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
                deleteRequest({url: `${URLS.smrDelete}?contract_id=${contract_id}`}, {
                    onSuccess: () => {
                        navigate('/insurance/smr')
                    }
                })
            }
        });
    }


    if (isLoading || isLoadingImgData || isLoadingBranches || isLoadingOkeds || isLoadingOwnershipForms || isLoadingAreaTypes || isLoadingCountry || isLoadingRegion) {
        return <OverlayLoader/>
    }

    return (<>
        {(deleteLoading || isLoadingConfirmPayed || isLoadingSendFond) && <OverlayLoader/>}
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
                    <Title>СМР</Title>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Form
                        footer={!isEqual(role, 'user') && !isEqual(get(data, 'data.status'), 'sent') && !isEqual(get(data, 'data.status'), 'policy issued') && !isEqual(get(data, 'data.status'), 'policy sent') &&
                        <Flex
                            className={'mt-32'}>{(isEqual(get(data, 'data.status'), 'new') || isEqual(get(data, 'data.status'), 'edited')) && <>
                            <Button onClick={remove}
                                    danger type={'button'}
                                    className={'mr-16'}>Удалить</Button>
                            <Button onClick={() => navigate(`/insurance/smr/update/${contract_id}`)} dark  type={'button'}
                                    className={'mr-16'}>Edit</Button>
                            <Button onClick={() => setOpenModal(true)} yellow type={'button'}
                                    className={'mr-16'}>Attach</Button>
                        </>}
                            <Button gray={isEqual(get(data, 'data.status'), 'paid')}
                                    onClick={(isEqual(get(data, 'data.status'), 'paid') || isEqual(get(data, 'data.status'), 'sent')) ? () => {
                                    } : confirmPayed}
                                    type={'button'} className={'mr-16'}>Подтвердить
                                оплату</Button>
                            <Button gray={!isEqual(get(data, 'data.status'), 'paid')}
                                    onClick={isEqual(get(data, 'data.status'), 'paid') ? sendFond : () => {
                                    }}
                                    type={'button'} className={'mr-16'}>Отправить в Фонд </Button>
                        </Flex>}>
                        <Row gutterWidth={60} className={'mt-32'}>
                            <Col xs={5}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Статус</Col>
                                    <Col xs={7}><Button green>{get(data, 'data.status')}</Button></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Филиал </Col>
                                    <Col xs={7}><Field disabled
                                                       defaultValue={parseInt(get(data, 'data.branch_id', 721))}
                                                       label={'Filial'}
                                                       options={branchesList}
                                                       property={{hideLabel: true, disabled: true}} type={'select'}
                                                       name={'branch_id'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Номер договора
                                        страхования: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.contract_number')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'input'}
                                                       name={'contract_number'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата договора страхования: </Col>
                                    <Col xs={7}><Field disabled defaultValue={get(data, 'data.contract_date')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                                       type={'datepicker'}
                                                       name={'contract_date'}/></Col>
                                </Row>

                            </Col>
                            <Col xs={5}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Серия полиса: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.policy.seria')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'input'}
                                                       name={'policy.seria'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Номер полиса: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.policy.number')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true, disabled: true}}
                                                       type={'input'}
                                                       name={'policy.number'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата выдачи полиса: </Col>
                                    <Col xs={7}><Field
                                        disabled
                                        defaultValue={get(data, 'data.policy.issue_date')}
                                        params={{required: true}}
                                        property={{
                                            hideLabel: true,
                                            dateFormat: 'dd.MM.yyyy'
                                        }}
                                        type={'datepicker'}
                                        name={'policy.issue_date'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата начала: </Col>
                                    <Col xs={7}><Field
                                        disabled
                                        defaultValue={get(data, 'data.policy.s_date')}
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'policy.s_date'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата окончания: </Col>
                                    <Col xs={7}><Field disabled defaultValue={get(data, 'data.policy.e_date')}
                                                       property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                                       type={'datepicker'}
                                                       name={'policy.e_date'}/></Col>
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
                                            <Button
                                                type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        <Flex justify={'flex-end'}>
                                            <Field defaultValue={get(data, 'data.insurant.inn')} disabled
                                                   property={{
                                                       disabled: true,
                                                       hideLabel: true,
                                                       mask: '999999999',
                                                       placeholder: 'Inn',
                                                       maskChar: '_',
                                                       onChange: (val) => setInn(val)
                                                   }} name={'inn'} type={'input-mask'}/>

                                            <Button className={'ml-15'} type={'button'}>Получить
                                                данные</Button>
                                        </Flex>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} label={'INN'}
                                           disabled
                                           defaultValue={get(data, 'data.insurant.inn')}
                                           property={{
                                               mask: '999999999',
                                               placeholder: 'Inn',
                                               maskChar: '_'
                                           }} name={'insurant.inn'} type={'input-mask'}/>

                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}} params={{required: true}}
                                           defaultValue={get(data, 'data.insurant.name')}
                                           label={'Наименование'} type={'input'}
                                           name={'insurant.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.dir_name')}
                                           params={{required: true}} label={'Руководитель'} type={'input'}
                                           name={'insurant.dir_name'}/>
                                </Col>


                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}} d
                                           defaultValue={get(data, 'data.insurant.phone')} params={{
                                        required: true
                                    }}
                                           label={'Телефон'} type={'input'}
                                           name={'insurant.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={String(get(data, 'data.insurant.oked'))}
                                        params={{required: true}}
                                        options={okedList}
                                        label={'ОКЭД'}
                                        type={'select'}
                                        name={'insurant.oked'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.bank_name')}
                                           params={{required: true}} label={'Bank'} type={'input'}
                                           name={'insurant.bank_name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.mfo')} params={{required: true}}
                                           label={'Bank mfo'} type={'input'}
                                           name={'insurant.mfo'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.bank_rs')}
                                           params={{required: true}} label={'Расчетный счет'} type={'input'}
                                           name={'insurant.bank_rs'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={parseInt(get(data, 'data.insurant.ownershipFormId'))}
                                        options={ownershipFormsList}
                                        label={'Форма собственности'}
                                        type={'select'}
                                        name={'insurant.ownershipFormId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={'210'}
                                        options={countryList}
                                        label={'Страна'}
                                        type={'select'}
                                        name={'insurant.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={String(get(data, 'data.insurant.regionId'))}
                                        options={regionsList}
                                        label={'Область'}
                                        type={'select'}
                                        name={'insurant.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={String(get(data, 'data.insurant.districtId'))}
                                        options={districtList}
                                        label={'Район'}
                                        type={'select'}
                                        name={'insurant.districtId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={parseInt(get(data, 'data.insurant.areaTypeId'))}
                                        options={areaTypesList}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'insurant.areaTypeId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.insurant.address')}
                                           params={{required: true}}
                                           label={'Address'} type={'input'}
                                           name={'insurant.address'}/>
                                </Col>
                            </>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                        </Row>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Номер лота: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.building.lot_id')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'input'}
                                        name={'building.lot_id'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Номер контакта строительства: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.building.dog_num')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'input'}
                                        name={'building.dog_num'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата договора строительства: </Col>
                                    <Col xs={7}><Field
                                        disabled
                                        defaultValue={get(data, 'data.building.dog_date')}
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'building.dog_date'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Название объекта: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.building.stroy_name')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'input'}
                                        name={'building.stroy_name'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Адрес и место
                                        расположение объекта: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.building.stroy_address')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'input'}
                                        name={'building.stroy_address'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Страховая стоимость: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.building.current_year_price')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'building.current_year_price'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                        </Row>
                        <Row className={'mt-15'}>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Общая страховая сумма: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.policy.ins_sum')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'policy.ins_sum'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Общая страховая премия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.policy.ins_premium')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'policy.ins_premium'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Страховая сумма по Разделу 1(страхование
                                        строительно-монтажных
                                        работ): </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.policy.ins_sum_smr')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'policy.ins_sum_smr'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Страховая премия по Разделу 1: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.policy.ins_premium_smr')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'policy.ins_premium_smr'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Страховая сумма по Разделу 2
                                        (страхование гражданской
                                        ответственности перед третьими
                                        лицами): </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.policy.ins_sum_otv')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'policy.ins_sum_otv'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Страховая премия по Разделу 2: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.policy.ins_premium_otv')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'policy.ins_premium_otv'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                        </Row>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Агент (автоматически): </Col>
                                    <Col xs={7}><Field defaultValue={username ? get(data, 'data.agent_id', '') : ''}
                                                       property={{hideLabel: true, disabled: true}} type={'input'}
                                                       name={'agent_id'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Комиссия агента: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.agent_comission')}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'agent_comission'}/></Col>
                                </Row>
                            </Col>

                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Оплаченная страховая
                                        премия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.policy.ins_premium_paid')}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'policy.ins_premium_paid'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата и время оплаты: </Col>
                                    <Col xs={7}><Field disabled
                                                       defaultValue={get(data, 'data.policy.payment_date')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                                       type={'datepicker'}
                                                       name={'policy.payment_date'}/></Col>
                                </Row>
                            </Col>
                            {get(imgData, 'data.data.url') && <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Скачать полис: </Col>
                                    <Col xs={7}>
                                        <a style={{color: '#1774FF', textDecoration: 'underline', cursor: 'pointer'}}
                                           target={"_blank"}
                                           href={get(imgData, 'data.data.url','#')}>
                                            <Download />
                                        </a>
                                    </Col>
                                </Row>
                            </Col>
                            }
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Section>
        <Modal title={'Распределение к полису'} visible={openModal}
               hide={() => setOpenModal(false)}>
            {
                isLoadingAttach && <ContentLoader/>
            }
            {
                <Table bordered hideThead={false}
                       thead={['', '№', 'Дата п/п', 'Наименоменование отправителя', 'Сумма поступления', 'Available sum']}>{get(transactions, 'data.data', []).map((item, i) =>
                    <tr key={get(item, '_id')}>
                        <td><Checkbox disabled={!get(item, 'available_sum', 0)}
                                      checked={isEqual(transactionId, get(item, '_id'))} onChange={(e) => {
                            if (e.target?.checked) {
                                setTransactionId(get(item, '_id'))
                            } else {
                                setTransactionId(null)
                            }
                        }}/></td>
                        <td>{i + 1}</td>
                        <td>{dayjs(get(item, 'payment_order_date')).format("DD.MM.YYYY")}</td>
                        <td>{get(item, 'sender_name')}</td>
                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                          value={get(item, 'payment_amount', 0)}/></td>
                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                          value={get(item, 'available_sum', 0)}/></td>
                    </tr>)}</Table>}
            {transactionId && <Form formRequest={attach} footer={<Button className={'mt-15'} type={'submit'}>Прикрепить</Button>}>
                <Row className={'mt-15'}>
                    <Col xs={6}>
                        <Field defaultValue={get(data, 'data.policy.ins_premium', 0)}
                               label={'Сумма оплаты по полису:'} property={{disabled: true}}
                               type={'number-format-input'} name={'sumInsurancePremium'}/>
                    </Col>
                    <Col xs={6}>
                        <Field defaultValue={get(data, 'attachedSum', 0)} property={{disabled: true}}
                               type={'number-format-input'}
                               name={'attachedSum'} label={'Сумма прикреплённых средств:'}/>
                    </Col>
                    <Col xs={6}>
                        <Field type={'number-format-input'} name={'attachmentSum'} label={'Сумма к прикреплению:'}/>
                    </Col>
                </Row>
            </Form>}
        </Modal>
    </>);
};

export default ViewContainer;