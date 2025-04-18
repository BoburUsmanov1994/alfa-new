import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {find, get, isEqual,includes} from "lodash";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import Table from "../../../components/table";
import Field from "../../../containers/form/field";
import Flex from "../../../components/flex";
import Form from "../../../containers/form/form";
import Section from "../../../components/section";
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import {useTranslation} from "react-i18next";
import Button from "../../../components/ui/button";
import {getSelectOptionsListFromData} from "../../../utils";
import {toast} from "react-toastify";
import {ContentLoader} from "../../../components/loader";
import EmptyPage from "../../auth/pages/EmptyPage";
import config from "../../../config";

const AgentsCommissionContainer = () => {
    const {t} = useTranslation()
    const [productGroupId, setProductGroupId] = useState(null);
    const [productSubGroupId, setProductSubGroupId] = useState(null);
    const [productId, setProductId] = useState(null);
    const [branchId, setBranchId] = useState(null);
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const user = useStore(state => get(state, 'user'))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Агенты"),
            path: '/agents',
        },
        {
            id: 2,
            title: t("Страховые агенты"),
            path: '/agents/insurance-agents',
        }
    ], [])

    let { data: branches } = useGetAllQuery({
        key: KEYS.branches,
        url: `${URLS.branches}/list`,
    });
    branches = getSelectOptionsListFromData(
        get(branches, `data.data`, []),
        "_id",
        "branchName"
    );
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
        key: [KEYS.productsfilter,productSubGroupId],
        url: URLS.products,
        params: {
            params: {
                subGroup: productSubGroupId
            }
        },
        enabled: !!productSubGroupId
    })
    const productsList = getSelectOptionsListFromData(get(products, `data.data`, []), '_id', 'name')
    const {data: agents} = useGetAllQuery({
        key: KEYS.agents, url: `${URLS.agents}/list`,
        params: {
            params: {
                branch:!includes([config.ROLES.admin],get(user,'role.name')) ? get(user, 'branch._id') : branchId,
                limit: 1000
            }
        }
    })
    const {data: commissionList, isLoading: isLoadingCommissionList} = useGetAllQuery({
        key: KEYS.agentCommission, url: `${URLS.agentCommission}/list`,
        params: {
            params: {
                product: productId,
                limit: 1000
            }
        }
    })
    const {mutate: commissionSetRequest, isLoading:isLoadingCommissionSetRequest} = usePostQuery({listKeyId: [KEYS.agents,KEYS.agentCommission]})
    const commissionSet = (attrs) => {
        if(productId) {
            commissionSetRequest({url: URLS.agentCommission, attributes: get(attrs, 'data.agent')})
        }else{
            toast.warn(t("Please select product!"))
        }
    }
    const getByAgentId = (_id) =>{
        return find(get(commissionList,'data.data',[]),(item)=>isEqual(get(item,'agent._id'),_id))
    }
    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])
    return (
        <Section>
            {isLoadingCommissionSetRequest && <ContentLoader/>}
            <Row className={''} align={'center'}>
                <Col xs={12} className={'mb-15'}>
                    <Title>{t('Комиссия и РПМ')}</Title>
                </Col></Row>

            <Row>
                <Col xs={12} >
                    <Col xs={12}>
                        <Form>
                            <Row>
                                <Col xs={3}>
                                    <Field property={{onChange:(val)=>setBranchId(val)}} type={'select'} name={'branch'} options={branches} label={t("Branch")} defaultValue={get(user,'branch._id')} disabled={!includes([config.ROLES.admin],get(user,'role.name'))} />
                                </Col>
                                <Col xs={3}>
                                    <Field label={t('Выберите категорию')} options={groups} type={'select'}
                                           name={'group'}
                                           property={{onChange: (val)=>setProductGroupId(val)}}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field label={t('Выберите подкатегорию')} options={subGroups} type={'select'}
                                           name={'subGroup'}
                                           property={{onChange: (val)=>setProductSubGroupId(val)}}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field label={t('Выберите продукта')} options={productsList} type={'select'}
                                           name={'product'} params={{required: true}}
                                           property={{onChange: (val)=>setProductId(val)}}

                                    />
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    {!productId ? <EmptyPage  /> :
                        <Form formRequest={commissionSet} footer={ <Button className={'mt-30'} type={"submit"} lg>{t("Установить выбранным")}
                    </Button>}>
                        <div className={'horizontal-scroll'}>
                        <Table hideThead={false}
                               thead={['Наименование агента', 'Агентское вознаграждение(минимум (%))', 'Агентское вознаграждение(максимум (%))', 'управлять удержанием при расторжении (y/n)', 'удерживать при расторжении (y/n)', 'Отчисление в РПМ(минимум (%))', 'Отчисление в РПМ(максимум (%))', 'можно изменять (y/n)','Штраф за порчу бланка (сум)','Штраф за утерю бланка (сум)']}>
                            {get(agents, 'data.data', []).map((item, i) => <tr key={i + 1}>
                                <td>
                                    <Field
                                        name={`agent.[${i}].agent`}
                                        type={'input'}
                                        property={{
                                            hideLabel: true,
                                            placeholder: 'ввод значения',
                                            type:'hidden'
                                        }}
                                        defaultValue={get(item,'_id')}
                                    />
                                    <Field
                                        name={`agent.[${i}].product`}
                                        type={'input'}
                                        property={{
                                            hideLabel: true,
                                            placeholder: 'ввод значения',
                                            type:'hidden'
                                        }}
                                        defaultValue={productId}
                                    />
                                    {get(item, 'person.name') ? `${get(item, 'person.secondname')} ${get(item, 'person.name')} ${get(item, 'person.middlename')}` : get(item, 'organization.nameoforganization')}
                                </td>

                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent.[${i}].commission.minimumPercent`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={get(getByAgentId(get(item,'_id')),'commission.minimumPercent',0)}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent.[${i}].commission.maximumPercent`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={get(getByAgentId(get(item,'_id')),'commission.maximumPercent',0)}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent.[${i}].commission.isManageWithholdingOnTermination`}
                                            type={'switch'}
                                            property={{
                                                hideLabel:true
                                            }}
                                            defaultValue={get(getByAgentId(get(item,'_id')),'commission.isManageWithholdingOnTermination',false)}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent.[${i}].commission.isWithholdOnTermination`}
                                            type={'switch'}
                                            property={{
                                                hideLabel:true
                                            }}
                                            defaultValue={get(getByAgentId(get(item,'_id')),'commission.isWithholdOnTermination',false)}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent.[${i}].rpm.minimumPercent`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={get(getByAgentId(get(item,'_id')),'rpm.minimumPercent',0)}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent.[${i}].rpm.maximumPercent`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={get(getByAgentId(get(item,'_id')),'rpm.maximumPercent',0)}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent.[${i}].rpm.allowChangePercents`}
                                            type={'switch'}
                                            property={{
                                                hideLabel:true
                                            }}
                                            defaultValue={get(getByAgentId(get(item,'_id')),'rpm.allowChangePercents',false)}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent.[${i}].blankDamageSum`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={get(getByAgentId(get(item,'_id')),'blankDamageSum',0)}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent.[${i}].blankLostSum`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={get(getByAgentId(get(item,'_id')),'blankLostSum',0)}
                                        />
                                    </Flex>
                                </td>
                            </tr>)}
                        </Table>
                        </div>
                    </Form>}
                </Col>
            </Row>

        </Section>
    );
};

export default AgentsCommissionContainer;