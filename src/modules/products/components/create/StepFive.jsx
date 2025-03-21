import React from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {get, includes, isEqual} from "lodash"
import Title from "../../../../components/ui/title";
import Table from "../../../../components/table";
import {useGetAllQuery, usePostQuery, usePutQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {OverlayLoader} from "../../../../components/loader";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import FilePreview from "../../../../components/file-preview";
import { useTranslation } from 'react-i18next';

const StepFive = ({id = null, ...props}) => {

    const setProduct = useSettingsStore(state => get(state, 'setProduct', () => {
    }))
    const {t} = useTranslation()
    const resetProduct = useSettingsStore(state => get(state, 'resetProduct', () => {
    }))
    const resetRiskList = useSettingsStore(state => get(state, 'resetRiskList', []))
    const product = useSettingsStore(state => get(state, 'product', {}))

    const {mutate: createProduct, isLoading} = usePostQuery({listKeyId: KEYS.products})
    const {mutate: updateProduct, isLoading: updateLoading} = usePutQuery({listKeyId: KEYS.products})

    let {data: groups} = useGetAllQuery({key: KEYS.groupsofproducts, url: `${URLS.groupsofproducts}/list`})
    groups = getSelectOptionsListFromData(get(groups, `data.data`, []), '_id', 'name')

    let {data: subGroups} = useGetAllQuery({key: KEYS.subgroupsofproducts, url: `${URLS.subgroupsofproducts}/list`})
    subGroups = getSelectOptionsListFromData(get(subGroups, `data.data`, []), '_id', 'name')


    let {data: status} = useGetAllQuery({key: KEYS.statusofproduct, url: `${URLS.statusofproduct}/list`})
    status = getSelectOptionsListFromData(get(status, `data.data`, []), '_id', 'name')

    let {data: polices} = useGetAllQuery({key: KEYS.typeofpolice, url: `${URLS.policyType}/list`})
    polices = getSelectOptionsListFromData(get(polices, `data.data`, []), '_id', 'name')

    let {data: persons} = useGetAllQuery({key: KEYS.typeofpersons, url: `${URLS.personType}/list`})
    persons = getSelectOptionsListFromData(get(persons, `data.data`, []), '_id', 'name')

    let {data: payments} = useGetAllQuery({key: KEYS.typeofpayment, url: `${URLS.typeofpayment}/list`})
    payments = getSelectOptionsListFromData(get(payments, `data.data`, []), '_id', 'name')

    let {data: policyformats} = useGetAllQuery({key: KEYS.policyformats, url: `${URLS.policyFormat}/list`})
    policyformats = getSelectOptionsListFromData(get(policyformats, `data.data`, []), '_id', 'name')

    let {data: applicationformdocs} = useGetAllQuery({
        key: KEYS.applicationformdocs,
        url: `${URLS.applicationForm}/list`
    })
    applicationformdocs = getSelectOptionsListFromData(get(applicationformdocs, `data.data`, []), '_id', 'url')

    let {data: contractform} = useGetAllQuery({key: KEYS.contractform, url: `${URLS.contractForm}/list`})
    contractform = getSelectOptionsListFromData(get(contractform, `data.data`, []), '_id', 'url')

    let {data: additionaldocuments} = useGetAllQuery({
        key: KEYS.additionaldocuments,
        url: `${URLS.additionaldocuments}/list`
    })
    additionaldocuments = getSelectOptionsListFromData(get(additionaldocuments, `data.data`, []), '_id', 'url')


    const findItem = (items = [], id, multiple = false) => {
        if (!multiple) {
            return items.find(item => isEqual(get(item, 'value'), id)) || {}
        } else {
            return items.filter(item => includes(id, get(item, 'value'))).map(({label}) => label).join(" , ") || "-"
        }
    }

    const nextStep = () => {
        if (id) {
            updateProduct({url: `${URLS.product}/${id}`, attributes: product}, {
                onSuccess: () => {
                    resetRiskList();
                    resetProduct();
                    props.nextStep();
                },
                onError: () => {

                }
            })
        } else {
            const {riskData, ...rest} = product
            createProduct({url: URLS.productCreate, attributes: {...rest}}, {
                onSuccess: () => {
                    resetRiskList();
                    resetProduct();
                    props.nextStep();
                },
                onError: () => {

                }
            })
        }

    }


    const prevStep = () => {
        props.previousStep();
    }

    const reset = () => {
        resetRiskList();
        resetProduct();
        props.firstStep();
    }
    console.log('product', product)

    return (<>
            {(isLoading || updateLoading) && <OverlayLoader/>}
            <Row>
                <Col xs={12}>
                    <StepNav step={5}/>
                </Col>
                <Col xs={12}>
                    <Form formRequest={nextStep}>
                        <Row>
                            <Col xs={12}>
                                <Title>{t("Проверьте данные")} </Title>
                            </Col>
                        </Row>
                        <Row className={'mb-25'}>
                            <Col xs={6}>
                                <Table thead={['1', '2']}>
                                    <tr>
                                        <td>{t("Категория")}</td>
                                        <td>
                                            <strong>{get(findItem(groups, get(product, 'group', null)), 'label', '-')}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Под категория")}</td>
                                        <td>
                                            <strong>{get(findItem(subGroups, get(product, 'subGroup', null)), 'label', '-')}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Код назначения")}</td>
                                        <td><strong>{get(product, 'code', '-')}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Работа по версии продукта (Версия продукта)")}</td>
                                        <td><strong>{get(product, 'version', '-')}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Тип страховщика")}</td>
                                        <td>
                                            <strong>{findItem(persons, get(product, 'personType', []), true)}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Наименование продукта")}</td>
                                        <td><strong>{get(product, 'name', '-')}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Статус договора")}</td>
                                        <td>
                                            <strong>{get(findItem(status, get(product, 'status', null)), 'label', '-')}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Требует разрешения")}</td>
                                        <td><strong>{get(product, 'isRequirePermission', false) ? 'Да' : 'Нет'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Тип полиса")}</td>
                                        <td>
                                            <strong>{findItem(polices, get(product, 'policyTypes', null), true)}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Разрешить несколько агентов")}</td>
                                        <td><strong>{get(product, 'allowMultipleAgents', false) ? 'Да' : 'Нет'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Имеет фиксированный превентивных мероприятий")}</td>
                                        <td>
                                            <strong>{get(product, 'fixedPreventiveMeasures', false) ? 'Да' : 'Нет'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Разрешить иностранную валюту")}</td>
                                        <td>
                                            <strong>{get(product, 'allowForeignCurrency', false) ? 'Да' : 'Нет'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Разрешение изменение франшизы")}</td>
                                        <td>
                                            <strong>{get(product, 'allowChangeFranchise', false) ? 'Да' : 'Нет'}</strong>
                                        </td>
                                    </tr>
                                </Table>
                            </Col>
                            <Col xs={6}>
                                <Table thead={['1', '2']}>
                                    {get(product, 'applicationForm') && <tr>
                                        <td>{t("Форма анкеты")}</td>

                                        <td>{get(product, 'applicationForm') && <FilePreview fileId={get(product, 'applicationForm')} />}</td>
                                    </tr>}
                                    {get(product, 'contractForm') && <tr>
                                        <td>{t("Договор")}</td>
                                        <td>
                                            {get(product, 'contractForm') && <FilePreview fileId={get(product, 'applicationForm')} />}
                                            </td>
                                    </tr>}
                                    {get(product, 'additionalDocuments') && <tr>
                                        <td>{t("Приложения")}</td>
                                        <td>
                                            {get(product, 'additionalDocuments') && <FilePreview fileId={get(product, 'applicationForm')} />}
                                           </td>
                                    </tr>}
                                    <tr>
                                        <td>{t("Имеет фиксированного страхователя")}</td>
                                        <td>
                                            <strong>{get(product, 'hasFixedPolicyHolder', false) ? 'Да' : 'Нет'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Имеет выгодоприобретеля")}</td>
                                        <td><strong>{get(product, 'hasBeneficary', false) ? 'Да' : 'Нет'}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Имеет фиксированного выгодоприобретеля")}</td>
                                        <td><strong>{get(product, 'hasFixedBeneficary', false) ? 'Да' : 'Нет'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Имеет фиксированную страховую сумму")}</td>
                                        <td><strong>{get(product, 'hasFixedFee', false) ? 'Да' : 'Нет'}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Разрешить полис без оплаты")}</td>
                                        <td>
                                            <strong>{get(product, 'allowPolicyWithoutPayment', false) ? 'Да' : 'Нет'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Тип оплаты")}</td>
                                        <td>
                                            <strong>{findItem(payments, get(product, 'paymentType', null), true)}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Имеет фиксированную комиссию")}</td>
                                        <td><strong>{get(product, 'hasFixedFee', false) ? 'Да' : 'Нет'}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Имеет диапазон ставок")}</td>
                                        <td><strong>{get(product, 'hasBettingRange', false) ? 'Да' : 'Нет'}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Имеет франшизу")}</td>
                                        <td>
                                            <strong>{get(product, 'allowChangeFranchise', false) ? 'Да' : 'Нет'}</strong>
                                        </td>
                                    </tr>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} className={'mt-32'}>
                                <Button className={'mr-16'} type={'button'} onClick={reset} danger outlined
                                        back>{t("Отменить")}</Button>
                                <Button dark className={'mr-16'} type={'button'} onClick={prevStep}
                                        outlined>{t("Назад")}</Button>
                                <Button type={'submit'} success>{t("Подтвердить")}</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default StepFive;
