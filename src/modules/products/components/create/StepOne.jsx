import React, {useState, memo, useEffect} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {get, includes, some, values, isEmpty, isEqual, head, isNil} from "lodash"
import {useGetAllQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import Title from "../../../../components/ui/title";
import {toast} from "react-toastify";
import Table from "../../../../components/table";
import {Trash2} from "react-feather";
import {useTranslation} from "react-i18next";

const StepOne = ({id = null, ...props}) => {
    const {t} = useTranslation()

    const [riskItem, setRiskItem] = useState({});
    const [productGroupId, setProductGroupId] = useState(null);
    const [riskTypeId, setRiskTypeId] = useState(null);

    const setProduct = useSettingsStore(state => get(state, 'setProduct', () => {
    }))
    const resetProduct = useSettingsStore(state => get(state, 'resetProduct', () => {
    }))
    const addRiskList = useSettingsStore(state => get(state, 'addRiskList', () => {
    }))
    const removeRiskList = useSettingsStore(state => get(state, 'removeRiskList', () => {
    }))
    const riskList = useSettingsStore(state => get(state, 'riskList', []))
    const resetRiskList = useSettingsStore(state => get(state, 'resetRiskList', []))

    const product = useSettingsStore(state => get(state, 'product', {}))
    let {data: bcoTypes} = useGetAllQuery({key: KEYS.typeofbco, url: `${URLS.bcoType}/list`})
    bcoTypes = getSelectOptionsListFromData(get(bcoTypes, `data`, []), '_id', 'policy_type_name')

    useEffect(() => {
        if (id && isEmpty(riskItem) && !isEmpty(get(product, 'riskId', []))) {
            addRiskList(...get(product, 'riskId', []).map(({classeId, risk, riskgroup}) => ({
                risk: get(risk, '_id'),
                riskgroup: get(riskgroup, '_id'),
                classeId: get(classeId, '_id'),
            })))
        }
    }, [product])

    const nextStep = ({data}) => {
        const {classeId, risk, riskgroup, riskId, riskType, ...rest} = data
        if (isEmpty(riskList)) {
            toast.warn('You have to add risk')
        } else {
            setProduct({...rest, risk: riskList.map(({risk}) => risk), riskData: riskList});
            props.nextStep();
        }
    }

    const prevStep = () => {
        props.previousStep();
    }

    const reset = () => {
        resetProduct();
        resetRiskList();
        props.firstStep();
    }

    let {data: groups} = useGetAllQuery({key: KEYS.groupsofproducts, url: `${URLS.groupsofproducts}/list`})
    groups = getSelectOptionsListFromData(get(groups, `data`, []), '_id', 'name')

    let {data: subGroups} = useGetAllQuery({
        key: KEYS.subgroupsofproductsFilter,
        url: URLS.subgroupsofproductsFilter,
        params: {
            params: {
                group: productGroupId
            }
        },
        enabled: !!productGroupId
    })
    subGroups = getSelectOptionsListFromData(get(subGroups, `data`, []), '_id', 'name')

    let {data: insurances} = useGetAllQuery({key: KEYS.insuranceForm, url: `${URLS.insuranceForm}/list`})
    insurances = getSelectOptionsListFromData(get(insurances, `data`, []), '_id', 'name')

    let {data: sectors} = useGetAllQuery({key: KEYS.typeofsector, url: `${URLS.sectorType}/list`})
    sectors = getSelectOptionsListFromData(get(sectors, `data`, []), '_id', 'name')

    let {data: persons} = useGetAllQuery({key: KEYS.typeofpersons, url: `${URLS.personType}/list`})
    persons = getSelectOptionsListFromData(get(persons, `data`, []), '_id', 'name')

    let {data: status} = useGetAllQuery({key: KEYS.statusofproduct, url: `${URLS.statusofproduct}/list`})
    status = getSelectOptionsListFromData(get(status, `data`, []), '_id', 'name')

    let {data: riskGroups} = useGetAllQuery({key: KEYS.typeofrisk, url: `${URLS.riskType}/list`})
    riskGroups = getSelectOptionsListFromData(get(riskGroups, `data`, []), '_id', 'name')

    let {data: risksListData} = useGetAllQuery({key: KEYS.risk, url: `${URLS.risk}/list`})
    let risksList = getSelectOptionsListFromData(get(risksListData, `data`, []), '_id', 'name')

    let {data: risksData} = useGetAllQuery({
        id: riskTypeId,
        key: KEYS.riskFilter,
        url: `${URLS.risk}/list`,
        params: {
            params: {
                riskType: riskTypeId
            }
        },
        enabled: !!riskTypeId
    })
    let risks = getSelectOptionsListFromData(get(risksData, `data`, []), '_id', 'name')

    let {data: insuranceClassesList} = useGetAllQuery({key: KEYS.classes, url: `${URLS.insuranceClass}/list`})
    let insuranceClasses = getSelectOptionsListFromData(get(insuranceClassesList, `data`, []), '_id', 'name')

    const setRisk = (value, name) => {
        if (includes(['riskType', 'classeId', 'risk'], name)) {
            setRiskItem(prev => ({...prev, [name]: value}))
        }
        if (isEqual(name, 'group')) {
            setProductGroupId(value)
        }
        if (isEqual(name, 'riskType')) {
            setRiskTypeId(value)
        }
    }

    const addRiskItem = () => {
        if (some(values(riskItem), val => isNil(val))) {
            toast.warn('You have to select all fields')
        } else {
            addRiskList({...riskItem, id: riskList.length + 1})
        }
        setRiskItem({riskgroup: null, classeId: null, risk: null})
    }


    const findItem = (list = [], id = null) => {
        return list.find(l => isEqual(get(l, "_id"), id))
    }
    return (
        <Row>
            <Col xs={12}>
                <StepNav step={1}/>
            </Col>
            <Col xs={12}>
                <Form formRequest={nextStep} getValueFromField={setRisk}>
                    <Row>
                        <Col xs={3}>
                            <Field label={t('Выберите категорию')} options={groups} type={'select'}
                                   name={'group'} params={{required: true}}
                                   property={{hasRequiredLabel: true}}
                                   defaultValue={get(product, 'group')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('Выберите подкатегорию ')} options={subGroups} type={'select'}
                                   name={'subGroup'} params={{required: true}}
                                   property={{hasRequiredLabel: true}}
                                   defaultValue={get(product, 'subGroup')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('Наименование продукта')} type={'input'} name={'name'}
                                   params={{required: true}}
                                   property={{hasRequiredLabel: true, placeholder: t('Введите значение')}}
                                   defaultValue={get(product, 'name')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('Код назначения')}
                                   type={'input'}
                                   name={'code'}
                                   property={{placeholder: t('Введите значение')}}
                                   defaultValue={get(product, 'code', '')}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>
                            <Field
                                label={t('Работа по версии продукта (Версия продукта)')}
                                type={'input'}
                                name={'version'}
                                property={{placeholder: t('Введите значение')}}
                                defaultValue={get(product, 'version', '')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                options={insurances}
                                label={t('Форма страхования')}
                                type={'select'}
                                name={'insuranceForm'}
                                defaultValue={get(product, 'insuranceForm')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                options={sectors}
                                label={t('Указать сектор')}
                                type={'select'}
                                name={'sectorType'}
                                defaultValue={get(product, 'sectorType')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                options={bcoTypes}
                                label={t('Bco type')}
                                type={'select'}
                                name={'bcoType'}
                                defaultValue={get(product, 'bcoType')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                label={t('Требуется разрешение')}
                                type={'switch'}
                                name={'isRequirePermission'}
                                defaultValue={get(product, 'isRequirePermission', false)}/>
                        </Col>
                        <Col xs={6}>
                            <Field
                                options={persons}
                                label={t('Выбрать тип страховщика')}
                                type={'checkbox'}
                                name={'personType'}
                                defaultValue={get(product, 'personType', [])}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field options={status}
                                   label={t('Статус продукта')}
                                   type={'switch'}
                                   name={'status'} defaultValue={get(product, 'status', false)}
                                   params={{required: true}}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} className={'mb-15'}>
                            <Title>{t("Добавить риски")}</Title>
                        </Col>
                        <Col xs={12} className={'mb-15'}>
                            <Row>
                                <Col xs={10}>
                                    <Row align={'center'}>
                                        <Col xs={4}>
                                            <Field
                                                options={riskGroups}
                                                type={'select'}
                                                name={'riskType'}
                                                defaultValue={get(riskItem, 'riskType')}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: t('Выберите группу  риска')
                                                }}/>
                                        </Col>
                                        <Col xs={4}>
                                            <Field
                                                options={risks}
                                                type={'select'}
                                                name={'risk'}
                                                defaultValue={get(riskItem, 'risk')}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: t('Выберите риск')
                                                }}/>
                                        </Col>
                                        <Col xs={4}>
                                            <Field
                                                options={insuranceClasses.filter(classItem => isEqual(get(findItem(
                                                    get(risksListData, 'data', []), get(riskItem, 'risk')
                                                ), 'insuranceClass'), get(classItem, 'value')))}
                                                type={'select'}
                                                name={'classeId'}
                                                defaultValue={get(head(insuranceClasses.filter(classItem => isEqual(get(findItem(
                                                    get(risksListData, 'data', []), get(riskItem, 'risk')
                                                ), 'insuranceClass', []), get(classItem, 'value')))), 'value')}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: t('Класс страхования')
                                                }}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={2} className={'text-right'}>
                                    <Button onClick={addRiskItem} type={'button'}>{t("Добавить")}</Button>
                                </Col>
                                {riskList.length > 0 && <Col xs={12}>
                                    <hr/>
                                    <Table hideThead={false}
                                           thead={[t('Тип риска'), t('Риск'), t('Класс страхования'), t('Delete')]}>
                                        {riskList.map((item, i) => <tr key={i + 1}>
                                            <td>
                                                <Field
                                                    type={'select'}
                                                    options={riskGroups} name={`riskId[${i}.riskgroup`}
                                                    isDisabled={true}
                                                    defaultValue={get(item, 'riskType')}
                                                    property={{hideLabel: true}}
                                                />
                                            </td>
                                            <td>
                                                <Field
                                                    type={'select'}
                                                    options={risksList}
                                                    name={`riskId[${i}.risk`}
                                                    isDisabled={true}
                                                    defaultValue={get(item, 'risk')}
                                                    property={{hideLabel: true}}
                                                />
                                            </td>
                                            <td>
                                                <Field
                                                    type={'select'}
                                                    options={insuranceClasses}
                                                    name={`riskId[${i}.classeId`}
                                                    isDisabled={true}
                                                    defaultValue={get(item, 'classeId')}
                                                    property={{
                                                        hideLabel: true,
                                                        bgColor: get(findItem(get(insuranceClassesList, 'data'), get(item, 'classeId')), 'color')
                                                    }}
                                                />
                                            </td>
                                            <td className={'cursor-pointer'}
                                                onClick={() => removeRiskList(get(item, 'id', null))}><Trash2
                                                color={'#dc2626'}/></td>
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
            </Col>
        </Row>
    );
};

export default memo(StepOne);