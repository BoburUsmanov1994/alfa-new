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
import {getSelectOptionsListFromData} from "../../../utils";
import Button from "../../../components/ui/button";
import {Filter, Trash} from "react-feather";
import Flex from "../../../components/flex";
import config from "../../../config";

const AgreementsContainer = ({...rest}) => {
    const {t} = useTranslation()
    const user = useStore(state => get(state, 'user'))
    const [productGroupId, setProductGroupId] = useState(null);
    const [productSubGroupId, setProductSubGroupId] = useState(null);
    const [filter, setFilter] = useState({
        branch: get(user, 'branch._id'),
        startOfInsurance: dayjs().subtract(1, 'year').format("YYYY-MM-DD"),
        endOfInsurance: dayjs().add(3, 'year').format("YYYY-MM-DD")
    });
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Agreements',
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
                        title: 'agreementNumber'
                    },
                    {
                        id: 1111,
                        key: 'agreementDate',
                        title: 'agreementDate',
                        render: (val) => dayjs(get(val, 'agreementDate')).format("DD.MM.YYYY")
                    },
                    {
                        id: 11,
                        key: 'startOfInsurance',
                        title: 'startOfInsurance',
                        date: true
                    },
                    {
                        id: 12,
                        key: 'endOfInsurance',
                        title: 'endOfInsurance',
                        date: true
                    },
                    {
                        id: 2,
                        key: 'product.name',
                        title: 'Наименование продукта'
                    },
                    {
                        id: 7,
                        key: 'totalInsuranceSum',
                        title: 'totalInsuranceSum',
                        hasNumberFormat: true
                    },
                    {
                        id: 77,
                        key: 'totalInsurancePremium',
                        title: 'totalInsurancePremium',
                        hasNumberFormat: true
                    },
                    {
                        id: 8,
                        key: 'status',
                        title: 'Status',
                    },
                ]}
                params={{...filter}}
                keyId={[KEYS.agreements, filter]}
                url={URLS.agreements}
                listUrl={`${URLS.agreements}/list`}
                title={t('Agreements')}
                responseDataKey={'data.data'}
                viewUrl={'/agreements/view'}
                createUrl={'/agreements/create'}
                isHideColumn
                extraFilters={<Form formRequest={({data: {group, subGroup, ...rest} = {}}) => {
                    setFilter(rest);
                }}
                                    mainClassName={'mt-15'}><Row align={'flex-end'}>
                    <Col xs={3}>
                        <Field label={t('Выберите категорию')} options={groups} type={'select'}
                               name={'group'}
                               property={{onChange: (val) => setProductGroupId(val)}}
                               defaultValue={productGroupId}
                        />
                    </Col>
                    <Col xs={3}>
                        <Field label={t('Выберите подкатегорию ')} options={subGroups} type={'select'}
                               name={'subGroup'}
                               property={{onChange: (val) => setProductSubGroupId(val)}}
                               defaultValue={productSubGroupId}
                        />
                    </Col>
                    <Col xs={3}>
                        <Field label={t('Выберите продукта')} options={productsList} type={'select'}
                               name={'product'}
                               defaultValue={get(filter, 'product')}
                        />
                    </Col>
                    <Col xs={3}>
                        <Field label={t('agreementnumber')} type={'input'}
                               name={'agreementNumber'}
                               defaultValue={get(filter, 'agreementNumber')}

                        />
                    </Col>
                    <Col xs={3}>
                        <Field label={t('totalInsurancePremium')} type={'number-format-input'}
                               name={'totalInsurancePremium'}
                               defaultValue={get(filter, 'totalInsurancePremium', 0)}
                        />
                    </Col>
                    <Col xs={3}>
                        <Field label={t('totalInsuranceSum')} type={'number-format-input'}
                               name={'totalInsuranceSum'}
                               defaultValue={get(filter, 'totalInsuranceSum', 0)}

                        />
                    </Col>
                    <Col xs={3}>
                        <Field label={t('startOfInsurance')} type={'datepicker'}
                               name={'startOfInsurance'}
                               defaultValue={get(filter, 'startOfInsurance')}

                        />
                    </Col>
                    <Col xs={3}>
                        <Field label={t('endOfInsurance')} type={'datepicker'}
                               name={'endOfInsurance'}
                               defaultValue={get(filter, 'endOfInsurance')}

                        />
                    </Col>
                    <Col xs={3}><Field type={'select'} label={'Филиал'} name={'branch'}
                                       options={branches} defaultValue={get(filter, 'branch')}
                                       isDisabled={!includes([config.ROLES.admin], get(user, 'role.name'))}/></Col>
                    <Col xs={9}>
                        <div className="mb-25">
                            <Button htmlType={'submit'}><Flex justify={'center'}><Filter size={18}/><span
                                style={{marginLeft: '5px'}}>{t("Фильтр")}</span></Flex></Button>
                            <Button onClick={() => {
                                setProductGroupId(null);
                                setProductSubGroupId(null);
                                setFilter({
                                    branch: get(user, 'branch._id'),
                                    startOfInsurance: dayjs().subtract(1, 'year').format("YYYY-MM-DD"),
                                    endOfInsurance: dayjs().add(3, 'year').format("YYYY-MM-DD")
                                });
                            }} className={'ml-15'} danger type={'button'}><Flex justify={'center'}><Trash
                                size={18}/><span
                                style={{marginLeft: '5px'}}>{t("Очистить фильтр")}</span></Flex></Button>
                        </div>
                    </Col>
                </Row></Form>}
            />
        </>
    );
};

export default AgreementsContainer;