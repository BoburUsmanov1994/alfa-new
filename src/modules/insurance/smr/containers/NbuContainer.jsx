import React, {useEffect, useMemo, useState} from "react";
import {useStore} from "../../../../store";
import {get, includes} from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import {useTranslation} from "react-i18next";
import NumberFormat from "react-number-format";
import {Download, FileText, Filter, Trash} from "react-feather";
import Form from "../../../../containers/form/form";
import {Col, Row} from "react-grid-system";
import config from "../../../../config";
import Button from "../../../../components/ui/button";
import Flex from "../../../../components/flex";
import {useNavigate} from "react-router-dom";
import {useGetAllQuery} from "../../../../hooks/api";
import {getSelectOptionsListFromData, saveFile} from "../../../../utils";

const NbuContainer = () => {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const user = useStore(state => get(state, 'user', null))
    const [filter,setFilter] = useState({})
    const [branch, setBranch] = useState(null);
    const setBreadcrumbs = useStore((state) =>
        get(state, "setBreadcrumbs", () => {
        })
    );
    const breadcrumbs = useMemo(
        () => [
            {
                id: 1,
                title: "НБУ",
                path: "/insurance/nbu-credits",
            }
        ],
        []
    );
    let {data: branches} = useGetAllQuery({
        key: KEYS.branches, url: `${URLS.branches}/list`, params: {
            params: {
                limit: 100
            }
        }
    })
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')
    let {refetch:report} = useGetAllQuery({
        key: [KEYS.nbuPortfelReport,branch],
        url: URLS.nbuPortfelReport,
        params: {
            params: {
                branch: branch,
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
        setBreadcrumbs(breadcrumbs);
    }, []);

    const ModalBody = ({data, rowId = null}) => (
        <>
            <Field
                name={"name"}
                type={"input"}
                label={"Название продукта"}
                defaultValue={rowId ? get(data, "name") : null}
                params={{required: true}}
            />
        </>
    );
    return (
        <>
            <GridView
                hideDeleteBtn
                extraActions={(_tr)=><a target='_blank' href={get(_tr,'policies.url','#')}><Download /></a>}
                ModalBody={ModalBody}
                extraFilters={<Form formRequest={({data: {group, subGroup, ...rest} = {}}) => {
                    setFilter(rest);
                }}
                                    mainClassName={'mt-15'}>

                    {() => <Row align={'flex-end'}>

                        <Col xs={3}>
                            <Field label={t('client_name')} type={'input'}
                                   name={'client_name'}
                                   defaultValue={get(filter, 'client_name')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('client_pinfl')} type={'input'}
                                   name={'client_pinfl'}
                                   defaultValue={get(filter, 'client_pinfl')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('client_birthday')} type={'datepicker'}
                                   name={'client_birthday'}
                                   defaultValue={get(filter, 'client_birthday')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('credit_name')} type={'input'}
                                   name={'credit_name'}
                                   defaultValue={get(filter, 'credit_name')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('credit_amount_in_cents')} type={'number-format-input-filter'}
                                   name={'credit_amount_in_cents'}
                                   defaultValue={get(filter, 'credit_amount_in_cents', null)}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('begin_credit_date')} type={'datepicker'}
                                   name={'begin_credit_date'}
                                   defaultValue={get(filter, 'begin_credit_date')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('end_credit_date')} type={'datepicker'}
                                   name={'end_credit_date'}
                                   defaultValue={get(filter, 'end_credit_date')}

                            />
                        </Col>


                        <Col xs={3}><Field  property={{onChange: (val) => setBranch(val)}} type={'select'} label={t("Филиал")} name={'branch'}
                                            options={branches} defaultValue={get(filter, 'branch')}
                                            isDisabled={!includes([config.ROLES.admin], get(user, 'role.name'))}/></Col>
                        <Col xs={9}>
                            <div className="mb-25">
                                <Button htmlType={'submit'}><Flex justify={'center'}><Filter size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("ПРИМЕНИТЬ")}</span></Flex></Button>
                                <Button onClick={() => {
                                    navigate(0)
                                }} className={'ml-15'} danger type={'button'}><Flex justify={'center'}><Trash
                                    size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("ОЧИСТИТЬ")}</span></Flex></Button>
                                <Button  className={'ml-15'} onClick={() => {
                                    report()
                                }} green type={'button'}><Flex justify={'center'}><FileText
                                    size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("Report")}</span></Flex></Button>
                            </div>
                        </Col>
                    </Row>}
                </Form>}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'insurant',
                        title: 'Client name',
                        render: (tr) => get(tr, 'insurant.client_name')
                    },
                    {
                        id: 2,
                        key: 'insurant.client_pinfl',
                        title: 'Pnfl',
                    },
                    {
                        id: 3,
                        key: 'insurant.client_birthday',
                        title: 'Birtdate',
                    },
                    {
                        id: 4,
                        key: 'policies.credit_name',
                        title: 'Credit name',
                    },
                    {
                        id: 5,
                        key: 'policies.credit_amount_in_cents',
                        title: 'credit_amount_in_cents',
                        render:(tr)=><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                 value={get(tr, 'policies.credit_amount_in_cents', 0)}/>
                    },
                    {
                        id: 7,
                        key: 'policies.begin_credit_date',
                        title: 'begin_credit_date',
                    },
                    {
                        id: 8,
                        key: 'policies.end_credit_date',
                        title: 'end_credit_date',
                    },
                    {
                        id: 9,
                        key: 'policies.policy_number',
                        title: 'policy_number',
                    },
                    {
                        id: 10,
                        key: 'policies.insurance_amount_in_cents',
                        title: 'insurance_amount_in_cents',
                        render:(tr)=><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                   value={get(tr, 'policies.insurance_amount_in_cents', 0)}/>
                    },
                    {
                        id: 10,
                        key: 'policies.insurance_premium_in_cents',
                        title: 'insurance_premium_in_cents',
                        render:(tr)=><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                   value={get(tr, 'policies.insurance_premium_in_cents', 0)}/>
                    },

                ]}
                keyId={[KEYS.nbuIntegrations,filter]}
                url={URLS.nbuIntegrations}
                title={t('Страхования кредитов НБУ')}
                params={{
                    ...filter
                }}
                responseDataKey={'data.docs'}
                isHideColumn
                hideCreateBtn={true}
                hasUpdateBtn={false}

            />

        </>
    );
};

export default NbuContainer;
