import React, {useState, memo, useEffect} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {get, includes, some, values, isEmpty, isEqual, head, find, isNil} from "lodash"
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import Title from "../../../../components/ui/title";
import {toast} from "react-toastify";
import Table from "../../../../components/table";
import {Trash2} from "react-feather";
import {useTranslation} from "react-i18next";
import Flex from "../../../../components/flex"
import Modal from "../../../../components/modal";
import {ContentLoader} from "../../../../components/loader";
import {useNavigate} from "react-router-dom";
import {PERSON_TYPE} from "../../../../constants";

const StepOne = ({id = null, ...props}) => {
    const {t} = useTranslation()


    const [riskItem, setRiskItem] = useState({});
    const [riskTypeId, setRiskTypeId] = useState(null);
    const [product, setProduct] = useState({});
    const [pledgerList, setPledgerList] = useState([]);

    const setAgreement = useSettingsStore(state => get(state, 'setAgreement', () => {
    }))
    const setInsurer = useSettingsStore(state => get(state, 'setInsurer', () => {
    }))
    const setBeneficiary = useSettingsStore(state => get(state, 'setBeneficiary', () => {
    }))
    const setPledger = useSettingsStore(state => get(state, 'setPledger', () => {
    }))
    const addPledgers = useSettingsStore(state => get(state, 'addPledgers', () => {
    }))
    const resetAgreement = useSettingsStore(state => get(state, 'resetAgreement', () => {
    }))
    const resetPledger = useSettingsStore(state => get(state, 'resetPledger', () => {
    }))
    const removePledgers = useSettingsStore(state => get(state, 'removePledgers', () => {
    }))
    const resetPledgers = useSettingsStore(state => get(state, 'resetPledgers', () => {
    }))


    const agreement = useSettingsStore(state => get(state, 'agreement', {}))
    const insurer = useSettingsStore(state => get(state, 'insurer', {}))
    const beneficiary = useSettingsStore(state => get(state, 'beneficiary', {}))
    const pledger = useSettingsStore(state => get(state, 'pledger', {}))
    const pledgers = useSettingsStore(state => get(state, 'pledgers', {}))


    const nextStep = ({data}) => {
        const {classeId, risk, riskgroup, ...rest} = data
        if (get(insurer, 'data.id')) {
            setAgreement({
                ...rest,
                product,
                clinets: get(insurer, 'data.id'),
                beneficiary: get(beneficiary, 'data.id'),
                pledgers: pledgers.map(({id}) => id)
            });
            props.nextStep();
        } else {
            toast.warn(t('Пожалуйста, добавьте страхователя'))
        }
    }

    const prevStep = () => {
        props.previousStep();
    }

    const reset = () => {
        resetAgreement();
        resetPledgers();
        props.firstStep();
    }
    let {data: branchList} = useGetAllQuery({
        key: KEYS.branches,
        url: `${URLS.branches}/list`,
    })
    branchList = getSelectOptionsListFromData(get(branchList, `data.data`, []), '_id', 'branchName')

    let {data: products} = useGetAllQuery({
        key: KEYS.productsfilter,
        url: URLS.products,
    })
    const productsList = getSelectOptionsListFromData(get(products, `data.data`, []), '_id', 'name')


    let {data: riskGroups} = useGetAllQuery({key: KEYS.typeofrisk, url: URLS.typeofrisk})
    riskGroups = getSelectOptionsListFromData(get(riskGroups, `data.data`, []), '_id', 'name')


    let {data: risksList} = useGetAllQuery({key: KEYS.risk, url: URLS.risk})
    risksList = getSelectOptionsListFromData(get(risksList, `data.data`, []), '_id', 'name')

    let {data: risksData} = useGetAllQuery({
        key: KEYS.riskFilter,
        url: URLS.riskFilter,
        params: {params: {typeofrisksId: riskTypeId}},
        enabled: !!riskTypeId
    })
    let risks = getSelectOptionsListFromData(get(risksData, `data.data`, []), '_id', 'name')

    let {data: insuranceClassesList} = useGetAllQuery({key: KEYS.classes, url: URLS.classes})
    let insuranceClasses = getSelectOptionsListFromData(get(insuranceClassesList, `data.data`, []), '_id', 'name')


    const {mutate: filterRequest, isLoading: filterLoading} = usePostQuery({})

    const setRisk = (value, name) => {
        if (includes(['riskgroup', 'classeId', 'risk'], name)) {
            setRiskItem(prev => ({...prev, [name]: value}))
        }
        if (isEqual(name, 'riskgroup')) {
            setRiskTypeId(value)
        }
        if (isEqual(name, 'product')) {
            setProduct(find(get(products, 'data.data', []), p => isEqual(get(p, '_id'), value)))
        }
    }


    const findItem = (list = [], id = null) => {
        return find(list, l => isEqual(get(l, "_id"), id))
    }

    const agentFilter = ({data}, type = 'insurer') => {
        filterRequest({
            url: URLS.findOrCreateClient,
            attributes: isEqual(get(type === 'insurer' ? insurer : pledger, 'type'), PERSON_TYPE.organization) ? {
                organization: {
                    inn: get(data, 'organization.inn'),
                },
                type: PERSON_TYPE.organization
            } : {
                person: {
                    birthDate: get(data, 'person.birthDate'),
                    phone: get(data, 'person.phone'),
                    seria: get(data, 'person.seria'),
                    number: get(data, 'person.number'),
                },
                type: PERSON_TYPE.person
            }
        }, {
            onSuccess: (data) => {
                if (isEqual(type, 'insurer')) {
                    if (isEqual(get(insurer, 'type'), PERSON_TYPE.person) && get(data, 'data.person')) {
                        setInsurer({
                            ...insurer, openModal: false, data: {
                                ...get(data, 'data.person'),
                                id: get(data, 'data._id')
                            }
                        })
                    }
                    if (isEqual(get(insurer, 'type'), PERSON_TYPE.organization) && get(data, 'data.organization')) {
                        setInsurer({
                            ...insurer, openModal: false, data: {
                                ...get(data, 'data.organization'),
                                id: get(data, 'data._id')
                            }
                        })
                    }
                    if (isEmpty(get(data, 'data'))) {
                        setInsurer({...insurer, openModal: false, data: null})
                    }
                } else if (isEqual(type, 'beneficiary')) {
                    if (isEqual(get(beneficiary, 'type'), PERSON_TYPE.person) && get(data, 'data.person')) {
                        setBeneficiary({
                            ...beneficiary, openModal: false, data: {
                                ...get(data, 'data.person'),
                                id: get(data, 'data._id')
                            }
                        })
                    }
                    if (isEqual(get(beneficiary, 'type'), PERSON_TYPE.organization) && get(data, 'data.organization')) {
                        setBeneficiary({
                            ...beneficiary, openModal: false, data: {
                                ...get(data, 'data.organization'),
                                id: get(data, 'data._id')
                            }
                        })
                    }
                    if (isEmpty(get(data, 'data'))) {
                        setBeneficiary({...beneficiary, openModal: false, data: null})
                    }
                } else if (isEqual(type, 'pledger')) {
                    if (isEqual(get(pledger, 'type'), PERSON_TYPE.person) && get(data, 'data.person')) {
                        setPledger({
                            ...pledger, data: {
                                ...get(data, 'data.person'),
                                id: get(data, 'data._id')
                            }
                        })
                    }
                    if (isEqual(get(pledger, 'type'), PERSON_TYPE.organization) && get(data, 'data.organization')) {
                        setPledger({
                            ...pledger, openModal: false, data: {
                                ...get(data, 'data.organization'),
                                id: get(data, 'data._id')
                            }
                        })
                    }
                    if (isEmpty(get(data, 'data'))) {
                        setPledger({...pledger, openModal: false, data: null})
                    }
                }
            },
        })
    }

    const addPledgerItem = () => {
        if (get(pledger, 'data')) {
            addPledgers({...get(pledger, 'data'), type: get(pledger, 'type')});
            resetPledger();
        } else {
            toast.warn('Select pledger')
        }
    }

    return (
        <Row>
            <Col xs={12}>
                <StepNav step={1}
                         steps={['Продукт', 'Обязательства', 'Расторжение', 'Документооборот']}/>
            </Col>
            <Col xs={12}>
                <Form formRequest={nextStep} getValueFromField={setRisk}>
                    <Row>
                        <Col xs={4}>
                            <Field label={t('Branch')} options={branchList} type={'select'}
                                   name={'branch'}
                                   defaultValue={get(agreement, 'branch')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field params={{required: true}} name={'agreementNumber'} type={'input'}
                                   label={'Agreement number'}
                                   defaultValue={get(agreement, 'agreementNumber')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field params={{required: true}} name={'agreementDate'} type={'datepicker'}
                                   label={'Agreement date'}
                                   defaultValue={get(agreement, 'agreementDate')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field label={t('Выберите продукта')} options={productsList} type={'select'}
                                   name={'product'} params={{required: true}}
                                   property={{hasRequiredLabel: true}}
                                   defaultValue={get(agreement, 'product')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field params={{required: true}} name={'startOfInsurance'} type={'datepicker'}
                                   label={'Начало страхового покрытия'}
                                   defaultValue={get(agreement, 'startOfInsurance')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field params={{required: true}} name={'endOfInsurance'} type={'datepicker'}
                                   label={'Окончание страхового покрытия'}
                                   defaultValue={get(agreement, 'endOfInsurance')}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} className={'mb-15'}>
                            <Title>{t("Покрываемые риски")}</Title>
                        </Col>
                        <Col xs={12} className={'mb-15'}>
                            <Row>
                                {get(product, 'risk', [])?.length > 0 && <Col xs={12}>
                                    <hr/>
                                    <Table hideThead={false}
                                           thead={[t('Тип риска'), t('Риск'), t('Класс страхования')]}>
                                        {get(product, 'risk', [])?.map((item, i) => <tr key={i + 1}>
                                            <td>
                                                {get(item, 'riskType.name')}
                                            </td>
                                            <td>
                                                {get(item, 'name')}
                                            </td>
                                            <td>
                                                {get(item, 'insuranceClass.name')}
                                            </td>
                                        </tr>)}
                                    </Table>
                                </Col>}
                            </Row>
                        </Col>
                        <Col xs={12} className={'mb-15'}>
                            <Title>{t("Страхователь")}</Title>
                        </Col>
                        <Col xs={12}>
                            <Row>
                                <Col xs={12}>
                                    <Flex className={'mb-15'}>
                                        <Button type={'button'} gray={isEqual(get(insurer, 'type'), PERSON_TYPE.person)}
                                                transparent={!isEqual(get(insurer, 'type'), PERSON_TYPE.person)}
                                                onClick={() => setInsurer(({
                                                    ...insurer,
                                                    type: PERSON_TYPE.person
                                                }))}>{t("Физическое лицо")}</Button>
                                        <Button type={'button'}
                                                gray={isEqual(get(insurer, 'type'), PERSON_TYPE.organization)}
                                                transparent={!isEqual(get(insurer, 'type'), PERSON_TYPE.organization)}
                                                onClick={() => setInsurer(({
                                                    ...insurer,
                                                    type: PERSON_TYPE.organization
                                                }))}
                                                className={'ml-15'}>{t("Юридическое лицо")}</Button>
                                    </Flex>
                                    <Flex>
                                        <Field params={{required: true}} type={'input'} name={`insurant`} property={{
                                            placeholder: 'Выбрать',
                                            disabled: true,
                                            hideLabel: true,
                                        }}
                                               defaultValue={`${get(insurer, 'data.fullName.lastname', '')} ${get(insurer, 'data.fullName.firstname', '')} ${get(insurer, 'data.name', '')}`}
                                        /><Button type={'button'}
                                                  onClick={() => setInsurer({...insurer, openModal: true})}
                                                  className={'mb-25 ml-15'}
                                                  success>{t('Выбрать')}</Button>
                                    </Flex>

                                </Col>
                            </Row>
                        </Col>
                        {get(product, 'hasFixedBeneficary', false) && <><Col xs={12} className={'mb-15'}>
                            <Title>{t("Выгодоприобритатель")}</Title>
                        </Col>
                            <Col xs={12}>

                                <Row>
                                    <Col xs={12}>
                                        <Flex className={'mb-15'}>
                                            <Button type={'button'}
                                                    gray={isEqual(get(beneficiary, 'type'), PERSON_TYPE.person)}
                                                    transparent={!isEqual(get(beneficiary, 'type'), PERSON_TYPE.person)}
                                                    onClick={() => setBeneficiary(({
                                                        ...beneficiary,
                                                        type: PERSON_TYPE.person
                                                    }))}>{t("Физическое лицо")}</Button>
                                            <Button type={'button'}
                                                    gray={isEqual(get(beneficiary, 'type'), PERSON_TYPE.organization)}
                                                    transparent={!isEqual(get(beneficiary, 'type'), PERSON_TYPE.organization)}
                                                    onClick={() => setBeneficiary(({
                                                        ...beneficiary,
                                                        type: PERSON_TYPE.organization
                                                    }))}
                                                    className={'ml-15'}>{t("Юридическое лицо")}</Button>
                                        </Flex>
                                        <Flex>
                                            <Field type={'input'} name={`beneficiary`} property={{
                                                placeholder: 'Выбрать',
                                                disabled: true,
                                                hideLabel: true,
                                            }}
                                                   defaultValue={`${get(beneficiary, 'data.fullName.lastname', '')} ${get(beneficiary, 'data.fullName.firstname', '')} ${get(beneficiary, 'data.name', '')}`}
                                            /><Button type={'button'}
                                                      onClick={() => setBeneficiary({...beneficiary, openModal: true})}
                                                      className={'mb-25 ml-15'}
                                                      success>{t('Выбрать')}</Button>
                                        </Flex>

                                    </Col>
                                </Row>
                            </Col>
                        </>}

                        <Col xs={12} className={'mb-15'}>
                            <Title>{t("Залогодатель")}</Title>
                        </Col>
                        <Col xs={12}>
                            <Row>
                                <Col xs={12}>
                                    <Flex className={'mb-15'}>
                                        <Button type={'button'} gray={isEqual(get(pledger, 'type'), PERSON_TYPE.person)}
                                                transparent={!isEqual(get(pledger, 'type'), PERSON_TYPE.person)}
                                                onClick={() => setPledger(({
                                                    ...pledger,
                                                    type: PERSON_TYPE.person
                                                }))}>{t("Физическое лицо")}</Button>
                                        <Button type={'button'}
                                                gray={isEqual(get(pledger, 'type'), PERSON_TYPE.organization)}
                                                transparent={!isEqual(get(pledger, 'type'), PERSON_TYPE.organization)}
                                                onClick={() => setPledger(({
                                                    ...pledger,
                                                    type: PERSON_TYPE.organization
                                                }))}
                                                className={'ml-15'}>{t("Юридическое лицо")}</Button>
                                    </Flex>
                                    <Flex>
                                        <Field type={'input'} name={`pledgers`} property={{
                                            placeholder: 'Выбрать',
                                            disabled: true,
                                            hideLabel: true,
                                        }}
                                               defaultValue={`${get(pledger, 'data.fullName.lastname', '')} ${get(pledger, 'data.fullName.firstname', '')} ${get(pledger, 'data.name', '')}`}
                                        /><Button type={'button'}
                                                  className={'mb-25 ml-15'}
                                                  success onClick={() => setPledger({
                                        ...pledger,
                                        openModal: true
                                    })}>{t('Выбрать')}</Button><Button onClick={addPledgerItem} type={'button'}
                                                                       className={'mb-25 ml-15'}
                                                                       success>{t('Добавить')}</Button>
                                    </Flex>

                                </Col>
                                {pledgers?.length > 0 && <Col xs={12}>
                                    <hr/>
                                    <Table hideThead={false}
                                           thead={[t('Тype'), t('FullName'), t('Delete')]}>
                                        {pledgers.map((item, i) => <tr key={i + 1}>
                                            <td>
                                                {
                                                    get(item, 'type')
                                                }
                                            </td>
                                            <td>
                                                {
                                                    `${get(item, 'name', '')} ${get(item, 'secondname', '')}`
                                                }
                                            </td>

                                            <td className={'cursor-pointer'}
                                                onClick={() => removePledgers(get(item, 'id', null))}>
                                                <Trash2 color={'#dc2626'}/>
                                            </td>
                                        </tr>)}
                                    </Table>
                                </Col>}
                            </Row>
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
                <Modal title={'Выберите тип страхователя'} visible={get(insurer, 'openModal', false)}
                       hide={(val) => setInsurer({...insurer, openModal: val})}>
                    {filterLoading && <ContentLoader/>}
                    <Button type={'button'} className={'mt-15'}
                            yellow={isEqual(get(insurer, 'type'), PERSON_TYPE.person)}
                            transparent={!isEqual(get(insurer, 'type'), PERSON_TYPE.person)}
                            onClick={() => setInsurer({...insurer, type: PERSON_TYPE.person})}>Физическое лицо</Button>
                    <Button type={'button'} className={'ml-15'}
                            yellow={isEqual(get(insurer, 'type'), PERSON_TYPE.organization)}
                            transparent={!isEqual(get(insurer, 'type'), PERSON_TYPE.organization)}
                            onClick={() => setInsurer({...insurer, type: PERSON_TYPE.organization})}>Юридическое
                        лицо</Button>
                    <Form formRequest={(data) => agentFilter(data, 'insurer')}
                          footer={<><Button>{t("Найдите или добавьте")}</Button></>}>
                        {isEqual(get(insurer, 'type'), PERSON_TYPE.person) ? <Row className={'mt-15'}>

                            <Col xs={4}>
                                <Field params={{required: true}} type={'input-mask'} name={`person.seria`} property={{
                                    placeholder: 'Серия паспорта',
                                    hideLabel: true,
                                    mask: 'aa',
                                    maskChar: '_',
                                    hideErrorMsg: true
                                }}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field params={{required: true}} type={'input-mask'} name={`person.number`} property={{
                                    placeholder: 'Номер паспорта',
                                    hideLabel: true,
                                    mask: '9999999',
                                    maskChar: '_',
                                    hideErrorMsg: true
                                }}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field property={{
                                    hideLabel: true,
                                }} name={'person.birthDate'} type={'datepicker'}
                                       label={'birthDate'}
                                       params={{required: true}}
                                />
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
                                    property={{placeholder: '998XXXXXXXXX', hideErrorMsg: true}}
                                    name={'person.phone'}/>
                            </Col>

                        </Row> : <Row className={'mt-15'}>

                            <Col xs={6}>
                                <Field
                                    params={{required: true}}
                                    type={'input-mask'}
                                    name={`organization.inn`}
                                    property={{
                                        placeholder: 'ИНН',
                                        hideLabel: true,
                                        mask: '999999999',
                                        maskChar: '_',
                                        hideErrorMsg: true
                                    }}
                                />
                            </Col>
                        </Row>}

                    </Form>
                </Modal>

                <Modal title={'Выберите тип выгодоприобритатель'} visible={get(beneficiary, 'openModal', false)}
                       hide={(val) => setBeneficiary({...beneficiary, openModal: val})}>
                    {filterLoading && <ContentLoader/>}
                    <Button type={'button'} className={'mt-15'}
                            yellow={isEqual(get(beneficiary, 'type'), PERSON_TYPE.person)}
                            transparent={!isEqual(get(beneficiary, 'type'), PERSON_TYPE.person)}
                            onClick={() => setBeneficiary({...beneficiary, type: PERSON_TYPE.person})}>Физическое
                        лицо</Button>
                    <Button type={'button'} className={'ml-15'}
                            yellow={isEqual(get(beneficiary, 'type'), PERSON_TYPE.organization)}
                            transparent={!isEqual(get(beneficiary, 'type'), PERSON_TYPE.organization)}
                            onClick={() => setBeneficiary({...beneficiary, type: PERSON_TYPE.organization})}>Юридическое
                        лицо</Button>
                    <Form formRequest={(data) => agentFilter(data, 'beneficiary')}
                          footer={<><Button>{t("Найти")}</Button></>}>
                        {isEqual(get(beneficiary, 'type'), PERSON_TYPE.person) ? <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Field params={{required: true}} type={'input-mask'} name={`person.seria`} property={{
                                    placeholder: 'Серия паспорта',
                                    hideLabel: true,
                                    mask: 'aa',
                                    maskChar: '_',
                                    hideErrorMsg: true
                                }}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field params={{required: true}} type={'input-mask'} name={`person.number`} property={{
                                    placeholder: 'Номер паспорта',
                                    hideLabel: true,
                                    mask: '9999999',
                                    maskChar: '_',
                                    hideErrorMsg: true
                                }}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field property={{
                                    hideLabel: true,
                                }} name={'person.birthDate'} type={'datepicker'}
                                       label={'birthDate'}
                                       params={{required: true}}
                                />
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
                                    property={{placeholder: '998XXXXXXXXX', hideErrorMsg: true}}
                                    name={'person.phone'}/>
                            </Col>

                        </Row> : <Row className={'mt-15'}>

                            <Col xs={6}>
                                <Field
                                    params={{required: true}}
                                    type={'input-mask'}
                                    name={`organization.inn`}
                                    property={{
                                        placeholder: 'ИНН',
                                        hideLabel: true,
                                        mask: '999999999',
                                        maskChar: '_',
                                        hideErrorMsg: true
                                    }}
                                />
                            </Col>
                        </Row>}

                    </Form>
                </Modal>


                <Modal title={'Выберите  залогодатель'} visible={get(pledger, 'openModal', false)}
                       hide={(val) => setPledger({...pledger, openModal: val})}>
                    {filterLoading && <ContentLoader/>}
                    <Button type={'button'} className={'mt-15'} yellow={isEqual(get(pledger, 'type'), 'physical')}
                            transparent={!isEqual(get(pledger, 'type'), PERSON_TYPE.person)}
                            onClick={() => setPledger({...pledger, type: PERSON_TYPE.person})}>Физическое лицо</Button>
                    <Button type={'button'} className={'ml-15'} yellow={isEqual(get(pledger, 'type'), 'juridical')}
                            transparent={!isEqual(get(pledger, 'type'), PERSON_TYPE.organization)}
                            onClick={() => setPledger({...pledger, type: PERSON_TYPE.organization})}>Юридическое
                        лицо</Button>
                    <Form formRequest={(data) => agentFilter(data, 'pledger')}
                          footer={<><Button>{t("Найдите или добавьте")}</Button></>}>
                        {isEqual(get(pledger, 'type'), PERSON_TYPE.person) ? <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Field params={{required: true}} type={'input-mask'} name={`passportSeries`} property={{
                                    placeholder: 'Серия паспорта',
                                    hideLabel: true,
                                    mask: 'aa',
                                    maskChar: '_',
                                    hideErrorMsg: true
                                }}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field params={{required: true}} type={'input-mask'} name={`passportNumber`} property={{
                                    placeholder: 'Номер паспорта',
                                    hideLabel: true,
                                    mask: '9999999',
                                    maskChar: '_',
                                    hideErrorMsg: true
                                }}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field params={{required: true}} type={'input-mask'} name={`pinfl`} property={{
                                    placeholder: 'ПИНФЛ',
                                    hideLabel: true,
                                    mask: '99999999999999',
                                    maskChar: '_',
                                    hideErrorMsg: true
                                }}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field property={{
                                    hideLabel: true,
                                }} name={'birthDate'} type={'datepicker'}
                                       label={'birthDate'}
                                       params={{required: true}}
                                />
                            </Col>
                        </Row> : <Row className={'mt-15'}>
                            <Col xs={6}>
                                <Field
                                    params={{required: true}}
                                    type={'input-mask'}
                                    name={`inn`}
                                    property={{
                                        placeholder: 'ИНН',
                                        hideLabel: true,
                                        mask: '999999999',
                                        maskChar: '_',
                                        hideErrorMsg: true
                                    }}
                                />
                            </Col>
                        </Row>}
                    </Form>
                </Modal>
            </Col>
        </Row>
    );
};

export default memo(StepOne);