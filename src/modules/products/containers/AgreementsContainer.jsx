import React, {useEffect, useMemo, useState} from 'react';
import {useSettingsStore, useStore} from "../../../store";
import {get, includes} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {Col, Row} from "react-grid-system";
import Form from "../../../containers/form/form";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData, saveFile} from "../../../utils";
import Button from "../../../components/ui/button";
import {FileText, Filter, Trash} from "react-feather";
import Flex from "../../../components/flex";
import config from "../../../config";
import {useNavigate} from "react-router-dom";

const AgreementsContainer = () => {
    const {t} = useTranslation()
    const user = useStore(state => get(state, 'user'))
    const [productGroupId, setProductGroupId] = useState(null);
    const [productSubGroupId, setProductSubGroupId] = useState(null);
    const [createdAtFrom, setCreatedAtFrom] = useState(null);
    const [createdAtTo, setCreatedAtTo] = useState(null);
    const [branch, setBranch] = useState(null);
    const [filter, setFilter] = useState({
        branch: get(user, 'branch._id'),
    });
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Agreements"),
            path: '/agreements',
        },
    ], [])
    const resetInsurer = useSettingsStore(state => get(state, 'resetInsurer', () => {
    }))
    const resetBeneficiary = useSettingsStore(state => get(state, 'resetBeneficiary', () => {
    }))
    const resetAgreement = useSettingsStore(state => get(state, 'resetAgreement', () => {
    }))
    const resetPledger = useSettingsStore(state => get(state, 'resetPledger', () => {
    }))
    const resetObjects = useSettingsStore(state => get(state, 'resetObjects', () => {
    }))

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

    let {data: products} = useGetAllQuery({
        key: [KEYS.productsfilter, productSubGroupId],
        url: URLS.products,
        params: {
            params: {
                subGroup: productSubGroupId
            }
        },
        enabled: !!productSubGroupId
    })
    const productsList = getSelectOptionsListFromData(get(products, `data.data`, []), '_id', 'name')
    let {data: branches} = useGetAllQuery({
        key: KEYS.branches, url: `${URLS.branches}/list`, params: {
            params: {
                limit: 100
            }
        }
    })
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')

    let {refetch} = useGetAllQuery({
        key: KEYS.agreementWeeklyReport,
        url: URLS.agreementWeeklyReport,
        params: {
            params: {
                createdAtFrom: createdAtFrom ? dayjs(createdAtFrom).format("YYYY-MM-DD") : undefined,
                createdAtTo: createdAtTo ? dayjs(createdAtTo).format("YYYY-MM-DD") : undefined,
                branch: includes([config.ROLES.admin], get(user, 'role.name')) ? branch : get(user, 'branch._id'),
            },
            responseType: 'blob'
        },
        enabled: false,
        cb: {
            success: (res) => {
                saveFile(res)
            }
        }
    })

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
        resetInsurer()
        resetBeneficiary()
        resetAgreement()
        resetPledger()
        resetObjects()
    }, [])

    return (
        <>
            <GridView
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'agreementNumber',
                        title: t("agreementNumber")
                    },
                    {
                        id: 2,
                        key: 'agreementDate',
                        title: t("agreementDate"),
                        render: (val) => dayjs(get(val, 'agreementDate')).format("DD.MM.YYYY")
                    },
                    {
                        id: 3,
                        key: 'insurant',
                        title: t("Страхователь"),
                        render: (_tr) => get(_tr, 'insurant.organization.name', `${get(_tr, 'insurant.person.fullName.lastname', '-')} ${get(_tr, 'insurant.person.fullName.firstname', '-')} ${get(_tr, 'insurant.person.fullName.middlename', '-')}`)
                    },
                    {
                        id: 4,
                        key: 'beneficiary',
                        title: t("Выгодоприобретатель"),
                        render: (_tr) => get(_tr, 'beneficiary.organization.name', `${get(_tr, 'beneficiary.person.fullName.lastname', '-')} ${get(_tr, 'beneficiary.person.fullName.firstname', '-')} ${get(_tr, 'beneficiary.person.fullName.middlename', '-')}`)
                    },
                    {
                        id: 5,
                        key: 'startOfInsurance',
                        title: t("startOfInsurance"),
                        date: true
                    },
                    {
                        id: 6,
                        key: 'endOfInsurance',
                        title: t("endOfInsurance"),
                        date: true
                    },
                    {
                        id: 7,
                        key: 'product.name',
                        title: t("Наименование продукта")
                    },
                    {
                        id: 8,
                        key: 'totalInsuranceSum',
                        title: t("totalInsuranceSum"),
                        hasNumberFormat: true
                    },
                    {
                        id: 9,
                        key: 'totalInsurancePremium',
                        title: t("totalInsurancePremium"),
                        hasNumberFormat: true
                    },
                    {
                        id: 10,
                        key: 'status',
                        title: t("Status"),
                    },
                    {
                        id: 11,
                        key: 'createdAt',
                        title: t("Дата ввода в систему"),
                        render: (val) => dayjs(get(val, 'createdAt')).format("DD.MM.YYYY HH:mm")
                    },
                ]}
                params={{...filter}}
                keyId={[KEYS.agreements, filter]}
                url={URLS.agreements}
                listUrl={`${URLS.agreements}/list`}
                title={t('Agreements')}
                responseDataKey={'data.data'}
                viewUrl={'/agreements/view'}
                viewIsTab
                createUrl={'/agreements/create'}
                updateUrl={'/agreements/edit'}
                isHideColumn
                checkStatus
                extraFilters={<Form sm formRequest={({data: {group, subGroup, ...rest} = {}}) => {
                    setFilter(rest);
                }}
                                    mainClassName={'mt-15'}>

                    {() => <Row align={'end'} gutterWidth={10}>
                        <Col xs={1.25}>
                            <Field sm property={{onChange: (val) => setBranch(val)}} type={'select'}
                                   label={t("Филиал")} name={'branch'}
                                   options={branches} defaultValue={get(filter, 'branch')}
                                   isDisabled={!includes([config.ROLES.admin], get(user, 'role.name'))}/>
                            <Field sm label={t('agreementnumber')} type={'input'}
                                   name={'agreementNumber'}
                                   defaultValue={get(filter, 'agreementNumber')}

                            />
                        </Col>
                        <Col xs={1}>
                            <Field sm label={t('Дата соглашения от')} type={'datepicker'}
                                   name={'agreementDateFrom'}
                                   defaultValue={get(filter, 'agreementDateFrom')}

                            />
                            <Field sm label={t('Дата соглашения до')} type={'datepicker'}
                                   name={'agreementDateTo'}
                                   defaultValue={get(filter, 'agreementDateTo')}

                            />
                        </Col>

                        <Col xs={1.5}>
                            <Field sm label={t('Страхователь')} type={'input'}
                                   name={'insurant'}
                                   defaultValue={get(filter, 'insurant')}

                            />
                            <Field  sm label={t('Выгодоприобретатель')} type={'input'}
                                    name={'beneficiary'}
                                    defaultValue={get(filter, 'beneficiary')}

                            />
                        </Col>

                        <Col xs={1}>
                            <Field sm label={t('Начало периода страхования от')} type={'datepicker'}
                                   name={'startOfInsuranceFrom'}
                                   defaultValue={get(filter, 'startOfInsuranceFrom')}

                            />
                            <Field sm label={t('Начало периода страхования до')} type={'datepicker'}
                                   name={'startOfInsuranceTo'}
                                   defaultValue={get(filter, 'startOfInsuranceTo')}

                            />
                        </Col>

                        <Col xs={1}>
                            <Field sm label={t('Конец периода страхования от')} type={'datepicker'}
                                   name={'endOfInsuranceFrom'}
                                   defaultValue={get(filter, 'endOfInsuranceFrom')}

                            />
                            <Field sm label={t('Конец периода страхования до')} type={'datepicker'}
                                   name={'endOfInsuranceTo'}
                                   defaultValue={get(filter, 'endOfInsuranceTo')}

                            />
                        </Col>

                        <Col xs={1.5}>
                            <Field sm label={t('Выберите категорию')} options={groups} type={'select'}
                                   name={'group'}
                                   property={{onChange: (val) => setProductGroupId(val)}}
                                   defaultValue={productGroupId}
                            />
                            <Field sm label={t('Bыберите подкатегорию')} options={subGroups} type={'select'}
                                   name={'subGroup'}
                                   property={{onChange: (val) => setProductSubGroupId(val)}}
                                   defaultValue={productSubGroupId}
                            />
                            <Field sm label={t('Выберите продукта')} options={productsList} type={'select'}
                                   name={'product'}
                                   defaultValue={get(filter, 'product')}
                            />
                        </Col>


                        <Col xs={1.25}>
                            <Field sm label={t('Общая страховая премия от')} type={'number-format-input-filter'}
                                   name={'totalInsurancePremiumFrom'}
                                   defaultValue={get(filter, 'totalInsurancePremiumFrom', null)}
                            />
                            <Field sm label={t('Общая страховая премия до')} type={'number-format-input-filter'}
                                   name={'totalInsurancePremiumTo'}
                                   defaultValue={get(filter, 'totalInsurancePremiumTo', null)}
                            />
                        </Col>
                        <Col xs={1.25}>
                            <Field sm label={t('Общая страховая сумма от')} type={'number-format-input-filter'}
                                   name={'totalInsuranceSumFrom'}
                                   defaultValue={get(filter, 'totalInsuranceSumFrom', null)}

                            />
                            <Field sm label={t('Общая страховая сумма до')} type={'number-format-input-filter'}
                                   name={'totalInsuranceSumTo'}
                                   defaultValue={get(filter, 'totalInsuranceSumTo', null)}
                            />
                        </Col>

                        <Col xs={1.25}>
                            <Field sm type={'select'} label={t("Status")} name={'status'}
                                   options={[{value: 'new', label: 'new'}, {
                                       value: 'partialPaid',
                                       label: 'partialPaid'
                                   }, {value: 'paid', label: 'paid'}, {value: 'sent', label: 'sent'}]}
                                   defaultValue={get(filter, 'status')}
                            />
                            <Field sm property={{onChange: (val) => {
                                    setCreatedAtFrom(val)
                                }}} label={t('Дата создания от')}
                                   type={'datepicker'}
                                   name={'createdAtFrom'}
                                   defaultValue={get(filter, 'createdAtFrom')}

                            />
                            <Field sm property={{onChange: (val) => {
                                    setCreatedAtTo(val)
                                }}} label={t('Дата создания до')}
                                   type={'datepicker'}
                                   name={'createdAtTo'}
                                   defaultValue={get(filter, 'createdAtTo')}

                            />
                        </Col>

                        <Col xs={1}>
                            <div>
                                <Button xs htmlType={'submit'}><Flex justify={'center'}><Filter size={14}/><span
                                    style={{marginLeft: '5px'}}>{t("Применить")}</span></Flex></Button>
                                <Button className={'mt-15'} xs onClick={() => {
                                    setFilter({})
                                }}  danger type={'reset'}><Flex justify={'center'}><Trash
                                    size={14}/><span
                                    style={{marginLeft: '5px'}}>{t("Очистить")}</span></Flex></Button>
                                <Button xs onClick={() => {
                                    refetch()
                                }} className={'mt-15 mb-15'} yellow type={'button'}><Flex justify={'center'}><FileText
                                    size={14}/><span
                                    style={{marginLeft: '5px'}}>{t("Отчет")}</span></Flex></Button>
                            </div>
                        </Col>
                    </Row>}
                </Form>}
            />
        </>
    );
};

export default AgreementsContainer;
