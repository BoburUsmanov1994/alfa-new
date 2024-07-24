import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {find, get, isEqual} from "lodash";
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

const AgentsReportContainer = () => {
    const {t} = useTranslation()
    const [productGroupId, setProductGroupId] = useState(null);
    const [productSubGroupId, setProductSubGroupId] = useState(null);
    const [productId, setProductId] = useState(null);
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const user = useStore(state => get(state, 'user'))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Агенты',
            path: '/agents',
        },
        {
            id: 2,
            title: 'Подготовка актов выполненных работ',
            path: '/agents/report',
        }
    ], [])

    let {data: agents} = useGetAllQuery({key: ['agents-list'], url: `${URLS.agents}/list`})
    agents = getSelectOptionsListFromData(get(agents, `data.data`, []), '_id', ['organization.nameoforganization', 'person.secondname', 'person.name'])
    const {data: commissionList, isLoading: isLoadingCommissionList} = useGetAllQuery({
        key: KEYS.agentCommission, url: `${URLS.agentCommission}/list`,
        params: {
            params: {
                product: productId,
                limit: 1000
            }
        }
    })
    const {
        mutate: commissionSetRequest,
        isLoading: isLoadingCommissionSetRequest
    } = usePostQuery({listKeyId: [KEYS.agents, KEYS.agentCommission]})
    const commissionSet = (attrs) => {
        if (productId) {
            commissionSetRequest({url: URLS.agentCommission, attributes: get(attrs, 'data.agent')})
        } else {
            toast.warn(t("Please select product!"))
        }
    }
    const getByAgentId = (_id) => {
        return find(get(commissionList, 'data.data', []), (item) => isEqual(get(item, 'agent._id'), _id))
    }
    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])
    return (
        <Section>
            {isLoadingCommissionSetRequest && <ContentLoader/>}
            <Row className={''} align={'center'}>
                <Col xs={12} className={'mb-15'}>
                    <Title>{t('Подготовка актов выполненных работ')}</Title>
                </Col></Row>

            <Row>
                <Col xs={12}>
                    <Col xs={12}>
                        <Form>
                            <Row>
                                <Col xs={3}>
                                    <Field type={'select'} name={'agent'} options={agents} label={t("Agent")}
                                           defaultValue={get(user, 'agent._id')} />
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    {!productId ? <EmptyPage/> :
                        <Form formRequest={commissionSet}
                              footer={<Button className={'mt-30'} type={"submit"} lg>Установить выбранным
                              </Button>}>
                            <div className={'horizontal-scroll'}>
                                <Table hideThead={false}
                                       thead={['Наименование агента', 'Агентское вознаграждение(минимум (%))', 'Агентское вознаграждение(максимум (%))', 'управлять удержанием при расторжении (y/n)', 'удерживать при расторжении (y/n)', 'Отчисление в РПМ(минимум (%))', 'Отчисление в РПМ(максимум (%))', 'можно изменять (y/n)', 'Штраф за порчу бланка (сум)', 'Штраф за утерю бланка (сум)']}>
                                    {get(agents, 'data.data', []).map((item, i) => <tr key={i + 1}>
                                        <td>
                                            <Field
                                                name={`agent.[${i}].agent`}
                                                type={'input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'ввод значения',
                                                    type: 'hidden'
                                                }}
                                                defaultValue={get(item, '_id')}
                                            />
                                            <Field
                                                name={`agent.[${i}].product`}
                                                type={'input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'ввод значения',
                                                    type: 'hidden'
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
                                                    defaultValue={get(getByAgentId(get(item, '_id')), 'commission.minimumPercent', 0)}
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
                                                    defaultValue={get(getByAgentId(get(item, '_id')), 'commission.maximumPercent', 0)}
                                                />
                                            </Flex>
                                        </td>
                                        <td>
                                            <Flex justify={'center'}>
                                                <Field
                                                    name={`agent.[${i}].commission.isManageWithholdingOnTermination`}
                                                    type={'switch'}
                                                    property={{
                                                        hideLabel: true
                                                    }}
                                                    defaultValue={get(getByAgentId(get(item, '_id')), 'commission.isManageWithholdingOnTermination', false)}
                                                />
                                            </Flex>
                                        </td>
                                        <td>
                                            <Flex justify={'center'}>
                                                <Field
                                                    name={`agent.[${i}].commission.isWithholdOnTermination`}
                                                    type={'switch'}
                                                    property={{
                                                        hideLabel: true
                                                    }}
                                                    defaultValue={get(getByAgentId(get(item, '_id')), 'commission.isWithholdOnTermination', false)}
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
                                                    defaultValue={get(getByAgentId(get(item, '_id')), 'rpm.minimumPercent', 0)}
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
                                                    defaultValue={get(getByAgentId(get(item, '_id')), 'rpm.maximumPercent', 0)}
                                                />
                                            </Flex>
                                        </td>
                                        <td>
                                            <Flex justify={'center'}>
                                                <Field
                                                    name={`agent.[${i}].rpm.allowChangePercents`}
                                                    type={'switch'}
                                                    property={{
                                                        hideLabel: true
                                                    }}
                                                    defaultValue={get(getByAgentId(get(item, '_id')), 'rpm.allowChangePercents', false)}
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
                                                    defaultValue={get(getByAgentId(get(item, '_id')), 'blankDamageSum', 0)}
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
                                                    defaultValue={get(getByAgentId(get(item, '_id')), 'blankLostSum', 0)}
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

export default AgentsReportContainer;