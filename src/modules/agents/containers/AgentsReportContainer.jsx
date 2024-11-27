import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {filter, get, includes, isEmpty, isEqual, sumBy} from "lodash";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import Field from "../../../containers/form/field";
import Form from "../../../containers/form/form";
import Section from "../../../components/section";
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import {useTranslation} from "react-i18next";
import {getSelectOptionsListFromData} from "../../../utils";
import dayjs from "dayjs";
import Table from "../../../components/table";
import EmptyPage from "../../auth/pages/EmptyPage";
import Button from "../../../components/ui/button";
import Checkbox from "rc-checkbox";
import NumberFormat from "react-number-format";
import {ContentLoader} from "../../../components/loader";

const AgentsReportContainer = () => {
    const {t} = useTranslation()
    const [params, setParams] = useState({});
    const [idList, setIdList] = useState([]);
    const [actId, setActId] = useState(null);
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
            title: t("Подготовка актов выполненных работ"),
            path: '/agents/report',
        }
    ], [])

    let {data: agents} = useGetAllQuery({
        key: ['agents-list'],
        params: {
            params:{
                branch: get(user, 'branch._id')
            }
        },
        url: `${URLS.agents}/list`
    })
    agents = getSelectOptionsListFromData(get(agents, `data.data`, []), '_id', ['organization.nameoforganization', 'person.secondname', 'person.name'])
    const {data: policyByAgentList, isLoading: isLoadingPolicyByAgentList} = useGetAllQuery({
        key: KEYS.policyByAgent, url: `${URLS.policyByAgent}`,
        params: {
            params: {
                agent: get(params, 'agent'),
                startDate: get(params, 'startDate'),
                endDate: get(params, 'endDate'),
                limit: 1000
            }
        },

    })

    const {mutate: actPostRequest, isLoading: isLoadingActPost} = usePostQuery({listKeyId: KEYS.policyByAgent})
    const {
        mutate: actBlankPostRequest,
        isLoading: isLoadingActBlankPost
    } = usePostQuery({listKeyId: KEYS.policyByAgent})
    const {
        mutate: actReportPostRequest,
        isLoading: isLoadingActReportPost
    } = usePostQuery({listKeyId: KEYS.policyByAgent})
    const {
        mutate: actBorderoPostRequest,
        isLoading: isLoadingActBorderoPost
    } = usePostQuery({listKeyId: KEYS.policyByAgent})
    const actPost = ({data}) => {
        actPostRequest({
            url: URLS.agentAct, attributes: {
                ...data,
                startDate: get(params, 'startDate'),
                endDate: get(params, 'endDate'),
                objectsOfAct: filter(get(policyByAgentList, 'data.data', []), (_item) => includes(idList, get(_item, 'policy._id')))?.map(_item => ({
                    agreement: get(_item, 'agreement._id'),
                    policy: get(_item, 'policy._id'),
                }))
            }
        }, {
            onSuccess: ({data: response}) => {
                setActId(get(response, '_id'))
            }
        })
    }
    const actBlankPost = () => {
        actPostRequest({
            url: `${URLS.agentActBlank}/${actId}`,
        })
    }
    const actReportPost = () => {
        actPostRequest({
            url: `${URLS.agentActReport}/${actId}`,
        })
    }
    const actBorderoPost = () => {
        actPostRequest({
            url: `${URLS.agentActBordero}/${actId}`,
        })
    }

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    return (
        <Section>
            {isLoadingActPost && <ContentLoader/>}
            <Row className={''} align={'center'}>
                <Col xs={12} className={'mb-15'}>
                    <Title>{t('Подготовка актов выполненных работ')}</Title>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Form getValueFromField={(value, name) => {
                        setParams(prev => ({...prev, [name]: value}))
                    }}>
                        <Row>
                            <Col xs={6}>
                                <Field type={'select'}
                                       name={'agent'} options={agents} label={t("Agent")}
                                       defaultValue={get(user, 'agent._id')}/>
                            </Col>
                            <Col xs={3}>
                                <Field defaultValue={dayjs().subtract(1, 'year')} type={'datepicker'}
                                       name={'startDate'} label={t("Start date")}
                                />
                            </Col>
                            <Col xs={3}>
                                <Field type={'datepicker'} name={'endDate'} label={t("End date")}
                                />
                            </Col>
                        </Row>
                    </Form>
                    {isEmpty(get(policyByAgentList, 'data.data', [])) ? <EmptyPage/> :
                        <Form formRequest={actPost}
                              footer={<>
                                  <Button on className={'mt-30'} type={"submit"} lg>{t("Сформировать акт выполненных работ")}</Button>
                                  <br/>
                                  <Button onClick={actId ? actBlankPost : () => {
                                  }} gray={!actId} yellow={actId} className={'mt-30 mr-16'} type={"button"} lg>Акт
                                    {t("выполненных работ")}  </Button>
                                  <Button onClick={actId ? actBorderoPost : () => {
                                  }} gray={!actId} green={actId} className={'mt-30 mr-16'} type={"button"}
                                          lg>{t("Бордеро")}</Button>
                                  <Button onClick={actId ? actReportPost : () => {
                                  }} gray={!actId} dark={actId} className={'mt-30 mr-16'} type={"button"} lg>{t("Докладная записка")}</Button>
                              </>}>
                            <Row>
                                <Col xs={3}>
                                    <Field params={{required: true}} type={'input'} name={'actNumber'}
                                           label={t("№ акта выполненных работ")}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field type={'datepicker'} name={'actDate'} label={t("Дата акта выполненных работ")}
                                    />
                                </Col>
                            </Row>
                            <div className={'horizontal-scroll'}>
                                <Table hideThead={false}
                                       thead={['Выбрать', '№', 'Полис номер', 'Страхователь', 'Договор номер', 'Договор дата', 'Страховая сумма', "Страховая премия (по полису)", 'Дата начала полиса', 'Дата конца полиса', 'Оплачено', 'Дата оплаты', 'Комиссия агента(%)', 'Комиссия агента(сумма)', 'Акт выполненных работ(номер)', 'Акт выполненных работ(дата)', 'Статус']}>
                                    {get(policyByAgentList, 'data.data', []).map((item, i) => <tr key={i + 1}>
                                        <td>
                                            <Checkbox
                                                disabled={!(!get(item, 'act') && isEqual(get(item, 'paymentStatus'), 'paid'))}
                                                checked={includes(idList, get(item, 'policy._id'))} onChange={(e) => {
                                                if (e.target?.checked) {
                                                    setIdList(prev => ([...prev, get(item, 'policy._id')]))
                                                } else {
                                                    setIdList(idList.filter(id => !isEqual(id, get(item, 'policy._id'))))
                                                }
                                            }}/>
                                        </td>
                                        <td>
                                            {i + 1}
                                        </td>
                                        <td>
                                            {get(item, 'policy.number')}
                                        </td>
                                        <td>
                                            {get(item, 'insurant')}
                                        </td>
                                        <td>
                                            {get(item, 'agreement.number')}
                                        </td>
                                        <td>
                                            {dayjs(get(item, 'agreement.date')).format("DD.MM.YYYY")}
                                        </td>
                                        <td>
                                            <NumberFormat displayType={'text'} value={get(item, 'insuranceSum')}
                                                          thousandSeparator={' '}/>
                                        </td>
                                        <td>
                                            <NumberFormat displayType={'text'} value={get(item, 'insurancePremium')}
                                                          thousandSeparator={' '}/>
                                        </td>
                                        <td>
                                            {dayjs(get(item, 'startDate')).format("DD.MM.YYYY")}
                                        </td>
                                        <td>
                                            {dayjs(get(item, 'endDate')).format("DD.MM.YYYY")}
                                        </td>
                                        <td>
                                            {get(item, 'paymentStatus')}
                                        </td>
                                        <td>
                                            {dayjs(get(item, 'paymentDate')).format("DD.MM.YYYY")}
                                        </td>
                                        <td>
                                            {get(item, 'agentCommission.commission')}
                                        </td>
                                        <td>
                                            <NumberFormat displayType={'text'} value={get(item, 'agentCommission.sum')}
                                                          thousandSeparator={' '}/>
                                        </td>
                                        <td>{get(item, 'act.actNumber')}</td>
                                        <td>{dayjs(get(item, 'act.actDate')).format("DD.MM.YYYY")}</td>
                                        <td></td>
                                        <td>{get(item, 'status')}</td>
                                    </tr>)}
                                </Table>
                            </div>
                            <Row className={'mt-30'}>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={sumBy(filter(get(policyByAgentList, 'data.data', []), (_item) => includes(idList, get(_item, 'policy._id'))), 'insurancePremium')}
                                        property={{disabled: true}} name={'totalPremiumAmount'}
                                        type={'number-format-input'} label={t('Общая страховая премия')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={sumBy(filter(get(policyByAgentList, 'data.data', []), (_item) => includes(idList, get(_item, 'policy._id'))), 'agentCommission.sum')}
                                        property={{disabled: true}} name={'returnedFeeAmountToAgent'}
                                        type={'number-format-input'}
                                        label={t('Сумма агентского вознаграждения к возврату')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field defaultValue={0} property={{disabled: true}}
                                           name={'policyCountAtBeginPeriod'}
                                           type={'number-format-input'}
                                           label={t('Остаток комплектов полисов на начало периода')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field defaultValue={idList?.length} property={{disabled: true}}
                                           name={'issuedPolicyCount'}
                                           type={'number-format-input'} label={t('Выдано комплектов полисов')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field defaultValue={idList?.length} property={{disabled: true}}
                                           name={'soldPolicyCount'}
                                           type={'number-format-input'} label={t('Продано комплектов полисов')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={filter(get(policyByAgentList, 'data.data', []), (_item) => get(_item, 'isCanceled'))?.length}
                                        property={{disabled: true}} name={'canceledPolicyCount'}
                                        type={'number-format-input'} label={t('Аннулировано комплектов полисов')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={filter(get(policyByAgentList, 'data.data', []), (_item) => get(_item, 'isDamaged'))?.length}
                                        property={{disabled: true}} name={'damagedPolicyCount'}
                                        type={'number-format-input'} label={t('Испорчено комплектов полисов')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={filter(get(policyByAgentList, 'data.data', []), (_item) => get(_item, 'isLost'))?.length}
                                        property={{disabled: true}} name={'lostPolicyCount'}
                                        type={'number-format-input'} label={t('Потеряно комплектов полисов')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={filter(get(policyByAgentList, 'data.data', []), (_item) => get(_item, 'isFound'))?.length}
                                        property={{disabled: true}} name={'foundPolicyCount'}
                                        type={'number-format-input'} label={t('Найдено комплектов полисов')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={filter(get(policyByAgentList, 'data.data', []), (_item) => get(_item, 'isReturned'))?.length}
                                        property={{disabled: true}} name={'returnedPolicyCount'}
                                        type={'number-format-input'} label={t('Возвращено комплектов полисов')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={0}
                                        property={{disabled: true}} name={'policyCountAtEndPeriod'}
                                        type={'number-format-input'}
                                        label={t('Остаток комплектов полисов на конец периода')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={idList?.length}
                                        property={{disabled: true}} name={'issuedPolicyCopyCount'}
                                        type={'number-format-input'}
                                        label={t('Копии оформленных полисов в количестве')}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        defaultValue={filter(get(policyByAgentList, 'data.data', []), (_item) => get(_item, 'isDamaged'))?.length}
                                        property={{disabled: true}} name={'damagedPolicyBlankCount'}
                                        type={'number-format-input'}
                                        label={t('Бланки испорченных полисов в количестве')}/>
                                </Col>
                                <Col xs={6}>
                                    <Field
                                        defaultValue={filter(get(policyByAgentList, 'data.data', []), (_item) => get(_item, 'isDamaged'))?.length}
                                        property={{disabled: true}} name={'damagedPolicyBlankCount'}
                                        type={'number-format-input'}
                                        label={t('Аннулированные полиса в количестве и прилагаемые к ним заявления')}/>
                                </Col>
                            </Row>
                        </Form>}
                </Col>
            </Row>

        </Section>
    );
};

export default AgentsReportContainer;