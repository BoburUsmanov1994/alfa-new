import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {useGetAllQuery} from "../../../hooks/api";
import Table from "../../../components/table";
import Field from "../../../containers/form/field";
import Flex from "../../../components/flex";
import Form from "../../../containers/form/form";
import Section from "../../../components/section";
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import {useTranslation} from "react-i18next";
import Button from "../../../components/ui/button";

const AgentsCommissionContainer = () => {
    const {t} = useTranslation()
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
            title: 'Страховые агенты',
            path: '/agents/insurance-agents',
        }
    ], [])
    const {data: agents, isLoading: isLoadingAgents} = useGetAllQuery({
        key: KEYS.agents, url: `${URLS.agents}/list`,
        params: {
            params: {
                branch: get(user, 'branch._id'),
                limit: 150
            }
        }
    })
    const {data: commission, isLoading: isLoadingCommission} = useGetAllQuery({
        key: KEYS.agentCommission, url: `${URLS.agentCommission}/list`
    })

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    return (
        <Section>
            <Row className={''} align={'center'}>
                <Col xs={12} className={'mb-15'}>
                    <Title>{t('Комиссия и РПМ')}</Title>
                </Col></Row>

            <Row>
                <Col xs={12} >
                    <Form formRequest={(val) => console.log(val)} footer={ <Button className={'mt-30'} type={"submit"} lg>Установить выбранным
                    </Button>}>
                        <div className={'horizontal-scroll'}>
                        <Table hideThead={false}
                               thead={['Наименование агента', 'Агентское вознаграждение(минимум (%))', 'Агентское вознаграждение(максимум (%))', 'управлять удержанием при расторжении (y/n)', 'удерживать при расторжении (y/n)', 'Отчисление в РПМ(минимум (%))', 'Отчисление в РПМ(максимум (%))', 'можно изменять (y/n)','Штраф за порчу бланка (сум)','Штраф за утерю бланка (сум)']}>
                            {get(agents, 'data.data', []).map((item, i) => <tr key={i + 1}>
                                <td>
                                    {get(item, 'person.name') ? `${get(item, 'person.secondname')} ${get(item, 'person.name')} ${get(item, 'person.middlename')}` : get(item, 'organization.nameoforganization')}
                                </td>

                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent[${i}].commission.minimumPercent`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={0}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent[${i}].commission.minimumPercent`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={0}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent[${i}].commission.minimumPercent`}
                                            type={'switch'}
                                            property={{
                                                hideLabel:true
                                            }}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent[${i}].commission.minimumPercent`}
                                            type={'switch'}
                                            property={{
                                                hideLabel:true
                                            }}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent[${i}].commission.minimumPercent`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={0}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent[${i}].commission.minimumPercent`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={0}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent[${i}].commission.minimumPercent`}
                                            type={'switch'}
                                            property={{
                                                hideLabel:true
                                            }}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent[${i}].commission.minimumPercent`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={0}
                                        />
                                    </Flex>
                                </td>
                                <td>
                                    <Flex justify={'center'}>
                                        <Field
                                            name={`agent[${i}].commission.minimumPercent`}
                                            type={'number-format-input'}
                                            property={{
                                                hideLabel: true,
                                                placeholder: 'ввод значения',
                                            }}
                                            defaultValue={0}
                                        />
                                    </Flex>
                                </td>
                            </tr>)}
                        </Table>
                        </div>
                    </Form>
                </Col>
            </Row>

        </Section>
    );
};

export default AgentsCommissionContainer;