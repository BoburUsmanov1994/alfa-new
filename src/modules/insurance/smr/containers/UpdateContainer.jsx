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
import {useGetAllQuery, usePostQuery, usePutQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {OverlayLoader} from "../../../../components/loader";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {getSelectOptionsListFromData} from "../../../../utils";


const UpdateContainer = ({contract_id = null}) => {
    const [inn, setInn] = useState(null)
    const [organization, setOrganization] = useState(null)
    const [current_year_price, set_current_year_price] = useState(null)
    const [regionId, setRegionId] = useState(null)
    const [calcData, setCalcData] = useState({})
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const navigate = useNavigate();
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'SMR', path: '/smr',
    }, {
        id: 2, title: 'Добавить SMR', path: '/smr/create',
    }], [])

    const {t} = useTranslation()

    const username = useSettingsStore(state => get(state, 'username', {}))

    const {data, isLoading} = useGetAllQuery({
        key: KEYS.osgorView,
        url: URLS.osgorView,
        params: {
            params: {
                contract_id: contract_id
            }
        },
        enabled: !!(contract_id)
    })

    const {data: branches, isLoading: isLoadingBranches} = useGetAllQuery({
        key: KEYS.branches,
        url: URLS.branches,
    })

    const branchesList = getSelectOptionsListFromData(get(branches, `data.data`, []), 'id', 'name')

    const {data: okeds, isLoading: isLoadingOkeds} = useGetAllQuery({
        key: KEYS.okeds,
        url: URLS.okeds,
    })

    const okedList = getSelectOptionsListFromData(get(okeds, `data.data`, []), 'id', 'name')

    const {data: areaTypes, isLoading: isLoadingAreaTypes} = useGetAllQuery({
        key: KEYS.areaTypes,
        url: URLS.areaTypes,
    })

    const areaTypesList = getSelectOptionsListFromData(get(areaTypes, `data.data`, []), 'id', 'name')

    const {data: ownershipForms, isLoading: isLoadingOwnershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms,
        url: URLS.ownershipForms,
    })

    const ownershipFormsList = getSelectOptionsListFromData(get(ownershipForms, `data.data`, []), 'id', 'name')

    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries,
        url: URLS.countries,
    })

    const countryList = getSelectOptionsListFromData(get(country, `data.data`, []), 'id', 'name')

    const {data: regions, isLoading: isLoadingRegion} = useGetAllQuery({
        key: KEYS.regions,
        url: URLS.regions,
    })

    const regionsList = getSelectOptionsListFromData(get(regions, `data.data`, []), 'id', 'name')

    const {data: districts} = useGetAllQuery({
        key: KEYS.districts,
        url: URLS.districts,
        params: {
            params: {
                region: regionId
            }
        },
        enabled: !!(regionId)
    })

    const districtList = getSelectOptionsListFromData(get(districts, `data.data`, []), 'id', 'name')

    const {
        mutate: updateRequest, isLoading: isLoadingPatch
    } = usePutQuery({listKeyId: KEYS.osgorEdit})

    const {
        mutate: getOrganizationInfoRequest, isLoading: isLoadingOrganizationInfo
    } = usePostQuery({listKeyId: KEYS.organizationInfoProvider})
    const {
        mutate: calculateRequest
    } = usePostQuery({listKeyId: KEYS.calculate, hideSuccessToast: true})

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


    const getFieldData = (name, value) => {
        if (isEqual(name, 'building.current_year_price')) {
            set_current_year_price(value)
        }
        if (isEqual(name, 'insurant.regionId')) {
            setRegionId(value)
        }
    }

    const calculate = (val) => {
        calculateRequest({
                url: URLS.calculate,
                attributes: {current_year_price: parseFloat(val)}
            },
            {
                onSuccess:({data:response})=>{
                    setCalcData(response)
                }
            }
        )
    }

    const update = ({data}) => {
        const {insurant, agent_comission, branch_id, ...rest} = data;
        updateRequest({
                url: URLS.osgorEdit, attributes: {
                    branch_id: String(branch_id),
                    agent_comission: parseFloat(agent_comission),
                    insurant: {...insurant, phone: `${get(insurant, 'phone')}`, oked: String(get(insurant, 'oked'))},
                    ...rest,
                    contract_id: parseInt(contract_id)
                }
            },
            {
                onSuccess: ({data: response}) => {
                    if (get(response, 'data.contract_id')) {
                        navigate(`/smr/view/${get(response, 'data.contract_id')}`);
                    } else {
                        navigate(`/smr`);
                    }
                },
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
                onSuccess: ({data: response}) => {
                    setOrganization(response)
                }
            }
        )
    }

    useEffect(() => {
        if (!isNil(current_year_price)) {
            calculate(current_year_price)
        }
    }, [current_year_price])

    if (isLoading || isLoadingBranches || isLoadingOkeds || isLoadingOwnershipForms || isLoadingAreaTypes || isLoadingCountry || isLoadingRegion) {
        return <OverlayLoader/>
    }

    return (<>
        {(isLoadingPatch || isLoadingOrganizationInfo) && <OverlayLoader/>}
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
                    <Form formRequest={update} getValueFromField={(value, name) => getFieldData(name, value)}
                          footer={<Flex className={'mt-32'}><Button type={'submit'}
                                                                    className={'mr-16'}>Сохранить</Button><Button
                              onClick={() => navigate('/smr')} type={'button'} danger
                              className={'mr-16'}>Отменить</Button></Flex>}>
                        <Row gutterWidth={60} className={'mt-32'}>
                            <Col xs={5}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Статус</Col>
                                    <Col xs={7}><Button green>{get(data, 'data.data.status')}</Button></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Филиал </Col>
                                    <Col xs={7}><Field disabled defaultValue={721}
                                                       options={branchesList}
                                                       label={'Filial'}
                                                       property={{hideLabel: true}} type={'select'}
                                                       name={'branch_id'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Номер договора
                                        страхования: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.contract_number')}
                                                       params={{required: true}} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'contract_number'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата договора страхования: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.contract_date')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                                       type={'datepicker'}
                                                       name={'contract_date'}/></Col>
                                </Row>

                            </Col>
                            <Col xs={5}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Серия полиса: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.policy.seria')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'policy.seria'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Номер полиса: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.policy.number')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true,disabled:true}}
                                                       type={'input'}
                                                       name={'policy.number'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата выдачи полиса: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.policy.issue_date')}
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
                                        defaultValue={get(data, 'data.data.policy.s_date')}
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'policy.s_date'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата окончания: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.policy.e_date')}
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
                                            <Field defaultValue={inn ?? get(data, 'data.data.insurant.inn')} property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_',
                                                onChange: (val) => setInn(val)
                                            }} name={'inn'} type={'input-mask'}/>

                                            <Button onClick={getOrgInfo} className={'ml-15'} type={'button'}>Получить
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
                                           defaultValue={inn ?? get(data, 'data.data.insurant.inn')} property={{
                                        mask: '999999999',
                                        placeholder: 'Inn',
                                        maskChar: '_'
                                    }} name={'insurant.inn'} type={'input-mask'}/>

                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(organization, 'data.name', get(data, 'data.data.insurant.name'))}
                                           label={'Наименование'} type={'input'}
                                           name={'insurant.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(organization, 'data.dir_name', get(data, 'data.data.insurant.dir_name'))}
                                        params={{required: true}} label={'Руководитель'} type={'input'}
                                        name={'insurant.dir_name'}/>
                                </Col>


                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(organization, 'data.phone', get(data, 'data.data.insurant.phone'))}
                                        params={{
                                            required: true
                                        }}
                                        label={'Телефон'} type={'input'}
                                        name={'insurant.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={parseInt(get(organization, 'data.oked', get(data, 'data.data.insurant.oked'))) || null}
                                        params={{required: true}}
                                        options={okedList}
                                        label={'ОКЭД'}
                                        type={'select'}
                                        name={'insurant.oked'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.data.insurant.bank_name')}
                                           params={{required: true}} label={'Bank'} type={'input'}
                                           name={'insurant.bank_name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.data.insurant.mfo')} params={{required: true}}
                                           label={'Bank mfo'} type={'input'}
                                           name={'insurant.mfo'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.data.insurant.bank_rs')}
                                           params={{required: true}} label={'Расчетный счет'} type={'input'}
                                           name={'insurant.bank_rs'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required:true}}
                                        defaultValue={parseInt(get(organization, 'data.ownershipFormId', get(data, 'data.data.insurant.ownershipFormId'))) || null}
                                        options={ownershipFormsList}
                                        label={'Форма собственности'}
                                        type={'select'}
                                        name={'insurant.ownershipFormId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={210}
                                        options={countryList}
                                        label={'Страна'}
                                        type={'select'}
                                        name={'insurant.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required:true}}
                                        defaultValue={parseInt(get(organization, 'data.regionId', get(data, 'data.data.insurant.regionId'))) || null}
                                        options={regionsList}
                                        label={'Область'}
                                        type={'select'}
                                        name={'insurant.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required:true}}
                                        defaultValue={parseInt(get(organization, 'data.districtId', get(data, 'data.data.insurant.districtId'))) || null}
                                        options={districtList}
                                        label={'Район'}
                                        type={'select'}
                                        name={'insurant.districtId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required:true}}
                                        defaultValue={parseInt(get(organization, 'data.areaTypeId', get(data, 'data.data.insurant.areaTypeId'))) || null}
                                        options={areaTypesList}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'insurant.areaTypeId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(organization, 'data.address', get(data, 'data.data.insurant.address'))}
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
                                        defaultValue={get(data, 'data.data.building.lot_id')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.lot_id'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Номер контакта строительства: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.building.dog_num')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.dog_num'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата договора строительства: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.building.dog_date')}
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'building.dog_date'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Название объекта: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.building.stroy_name')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.stroy_name'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Адрес и место
                                        расположение объекта: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.building.stroy_address')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.stroy_address'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Страховая стоимость: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.building.current_year_price')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
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
                                        defaultValue={get(calcData,'ins_sum',0)}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'policy.ins_sum'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Общая страховая премия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(calcData,'ins_premium',0)}
                                        params={{required: true}}
                                        property={{hideLabel: true, disabled: true}} type={'number-format-input'}
                                        name={'policy.ins_premium'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Страховая сумма по Разделу 1
                                        (страхование строительно-
                                        монтажных работ):</Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(calcData,'ins_sum_smr',0)}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'policy.ins_sum_smr'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Страховая премия по Разделу 1: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(calcData,'ins_premium_smr',0)}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'policy.ins_premium_smr'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Страховая сумма по Разделу 2
                                        (страхование гражданской
                                        ответственности перед третьими
                                        лицами):</Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(calcData,'ins_sum_otv',0)}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'policy.ins_sum_otv'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Страховая премия по Разделу 2: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(calcData,'ins_premium_otv',0)}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
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
                                    <Col xs={7}><Field defaultValue={username}
                                                       property={{hideLabel: true, disabled: true}} type={'input'}
                                                       name={'agent_id'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Комиссия агента: </Col>
                                    <Col xs={7}><Field
                                        params={{max: get(calcData,'ins_premium',0)/4}}
                                        defaultValue={get(calcData,'ins_premium',0)/4}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'agent_comission'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Оплаченная страховая
                                        премия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.policy.ins_premium_paid', 0)}
                                        params={{required: true}}
                                        property={{hideLabel: true,disabled:true}} type={'number-format-input'}
                                        name={'policy.ins_premium_paid'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col className={'text-right'} xs={5}>Дата и время оплаты: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.policy.payment_date')}
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                        type={'datepicker'}
                                        name={'policy.payment_date'}/></Col>
                                </Row>
                            </Col>
                            {/*<Col xs={4}>*/}
                            {/*    <Row align={'center'} className={'mb-25'}>*/}
                            {/*        <Col className={'text-right'} xs={5}>Прикрепить полис: </Col>*/}
                            {/*        <Col xs={7}><Field*/}
                            {/*            params={{required: true}}*/}
                            {/*            property={{*/}
                            {/*                hideLabel: true,*/}
                            {/*                contract_id,*/}
                            {/*                seria: get(data, 'data.data.policy.seria'),*/}
                            {/*                number: get(data, 'data.data.policy.number')*/}
                            {/*            }} type={'dropzone'}*/}
                            {/*            name={'policy.file_id'}/></Col>*/}
                            {/*    </Row>*/}
                            {/*</Col>*/}
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Section>
    </>);
};

export default UpdateContainer;