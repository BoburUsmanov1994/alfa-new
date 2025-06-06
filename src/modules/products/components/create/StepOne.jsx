import React, {useState, memo, useEffect} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {get, some, values, isEmpty, isEqual, isNil, find} from "lodash"
import {useGetAllQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import Title from "../../../../components/ui/title";
import {toast} from "react-toastify";
import Table from "../../../../components/table";
import {Trash2} from "react-feather";
import {useTranslation} from "react-i18next";
import ReactQuill from "react-quill";

const StepOne = ({id = null, ...props}) => {
    const {t} = useTranslation()
    const reactQuillRef = React.useRef();
    const [riskItem, setRiskItem] = useState({riskType: null, risk: null, classeId: null});
    const [productGroupId, setProductGroupId] = useState(null);
    const [comment, setComment] = useState('');

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
    bcoTypes = getSelectOptionsListFromData(get(bcoTypes, `data.data`, []), '_id', 'policy_type_name')

    useEffect(() => {
        if (id &&  !isEmpty(get(product, 'risk', []))) {
            addRiskList(...get(product, 'risk', []).map(({insuranceClass, _id, riskType}) => ({
                risk: _id,
                riskType: get(riskType, '_id'),
                classeId: get(insuranceClass, '_id'),
            })))
        }
    }, [product])

    const nextStep = ({data}) => {
        const {classeId, risk, riskgroup, riskId, riskType, ...rest} = data
        if (isEmpty(riskList)) {
            toast.warn('You have to add risk')
        } else {
            setProduct({...rest, risk: riskList.map(({risk}) => risk), riskData: riskList,riskComment:comment});
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
    groups = getSelectOptionsListFromData(get(groups, `data.data`, []), '_id', 'name')

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
    subGroups = getSelectOptionsListFromData(get(subGroups, `data.data`, []), '_id', 'name')

    let {data: insurances} = useGetAllQuery({key: KEYS.insuranceForm, url: `${URLS.insuranceForm}/list`})
    insurances = getSelectOptionsListFromData(get(insurances, `data.data`, []), '_id', 'name')

    let {data: sectors} = useGetAllQuery({key: KEYS.typeofsector, url: `${URLS.sectorType}/list`})
    sectors = getSelectOptionsListFromData(get(sectors, `data.data`, []), '_id', 'name')

    let {data: persons} = useGetAllQuery({key: KEYS.typeofpersons, url: `${URLS.personType}/list`})
    persons = getSelectOptionsListFromData(get(persons, `data.data`, []), '_id', 'name')

    let {data: status} = useGetAllQuery({key: KEYS.statusofproduct, url: `${URLS.statusofproduct}/list`})
    status = getSelectOptionsListFromData(get(status, `data.data`, []), '_id', 'name')

    let {data: riskGroups} = useGetAllQuery({key: KEYS.typeofrisk, url: `${URLS.riskType}/list`})
    riskGroups = getSelectOptionsListFromData(get(riskGroups, `data.data`, []), '_id', 'name')

    let {data: risksListData} = useGetAllQuery({key: KEYS.risk, url: `${URLS.risk}/list`})
    let risksList = getSelectOptionsListFromData(get(risksListData, `data.data`, []), '_id', 'name')

    let {data: risksData} = useGetAllQuery({
        id: get(riskItem, 'riskType'),
        key: KEYS.riskFilter,
        url: `${URLS.risk}/list`,
        params: {
            params: {
                riskType: get(riskItem, 'riskType')
            }
        },
        enabled: !!get(riskItem, 'riskType')
    })
    let risks = getSelectOptionsListFromData(get(risksData, `data.data`, []), '_id', 'name')

    let {data: insuranceClassesList} = useGetAllQuery({key: KEYS.classes, url: `${URLS.insuranceClass}/list`})
    let insuranceClasses = getSelectOptionsListFromData(get(insuranceClassesList, `data.data`, []), '_id', 'name')


    const addRiskItem = () => {
        if (some(values(riskItem), val => isNil(val))) {
            toast.warn(t('You have to select all fields'))
        } else {
            addRiskList({...riskItem, id: riskList.length + 1})
            setRiskItem({riskType: null, risk: null,classeId: null})
        }

    }

    const findItem = (list = [], id = null) => {
        return find(list, l => isEqual(get(l, "_id"), id))
    }
    return (
        <Row>
            <Col xs={12}>
                <StepNav step={1}/>
            </Col>
            <Col xs={12}>
                <Form formRequest={nextStep}>
                    <Row>
                        <Col xs={3}>
                            <Field label={t('Выберите категорию')} options={groups} type={'select'}
                                   name={'group'} params={{required: true}}
                                   property={{onChange: (val)=>setProductGroupId(val)}}
                                   defaultValue={id ? get(product, 'group._id') : get(product, 'group')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('Выберите подкатегорию')} options={subGroups} type={'select'}
                                   name={'subGroup'} params={{required: true}}
                                   property={{hasRequiredLabel: true}}
                                   defaultValue={id ? get(product, 'subGroup._id'):get(product, 'subGroup')}
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
                            <Field label={t('Наименование продукта (UZ)')} type={'input'} name={'nameUz'}
                                   property={{placeholder: t('Введите значение')}}
                                   defaultValue={get(product, 'nameUz')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('Наименование продукта (EN)')} type={'input'} name={'nameEng'}
                                   property={{placeholder: t('Введите значение')}}
                                   defaultValue={get(product, 'nameEng')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('Код назначения')}
                                   type={'input'}
                                   name={'code'}
                                   property={{placeholder: t('Введите значение')}}
                                   params={{required: true}}
                                   defaultValue={get(product, 'code', '')}
                            />
                        </Col>
                        <Col xs={6}>
                            <Field
                                label={t('Работа по версии продукта (Версия продукта)')}
                                type={'input'}
                                name={'version'}
                                property={{placeholder: t('Введите значение')}}
                                defaultValue={get(product, 'version', '')}
                            />
                        </Col>
                    </Row>
                    <Row>

                        <Col xs={3}>
                            <Field
                                options={insurances}
                                label={t('Форма страхования')}
                                type={'select'}
                                name={'insuranceForm'}
                                defaultValue={id ? get(product, 'insuranceForm._id'):get(product, 'insuranceForm')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                options={sectors}
                                label={t('Указать сектор')}
                                type={'select'}
                                name={'sectorType'}
                                defaultValue={id ? get(product, 'sectorType._id'):get(product, 'sectorType')}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                options={bcoTypes}
                                label={t('Bco type')}
                                type={'select'}
                                name={'bcoType'}
                                defaultValue={id ? get(product, 'bcoType._id'):get(product, 'bcoType')}
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
                                defaultValue={id ? get(product, 'personType', [])?.map(({_id})=>_id):get(product, 'personType', [])}
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
                                                    placeholder: t('Выберите группу риска'),
                                                    onChange: (val) => setRiskItem(prev => ({...prev, riskType: val}))
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
                                                    placeholder: t('Выберите риск'),
                                                    onChange: (val) => setRiskItem(prev => ({...prev, risk: val}))
                                                }}/>
                                        </Col>
                                        <Col xs={4}>
                                            <Field
                                                isDisabled
                                                options={insuranceClasses}
                                                type={'select'}
                                                name={'classeId'}
                                                defaultValue={get(riskItem, 'risk') ? get(findItem(
                                                    get(risksListData, 'data.data', []), get(riskItem, 'risk')
                                                ), 'insuranceClass._id') : null}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: t('Класс страхования'),
                                                    onChange: (val) => setRiskItem(prev => ({...prev, classeId: val}))
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
                                                        bgColor: get(findItem(get(insuranceClassesList, 'data.data'), get(item, 'classeId')), 'color')
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
                    <Row className={'mb-25'}>
                        <Col xs={12}><Title>{t("Комментарий о риске")}</Title></Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}>
                            <ReactQuill style={{height: 250}} theme="snow" value={comment} onChange={setComment}
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
            </Col>
        </Row>
    );
};

export default memo(StepOne);
