import React, {useEffect, useState} from 'react';
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import Section from "../../../components/section";
import Button from "../../../components/ui/button";
import Field from "../../../containers/form/field";
import Form from "../../../containers/form/form";
import {useTranslation} from "react-i18next";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import {useNavigate} from "react-router-dom";
import {get, isEqual} from "lodash"
import {useStore} from "../../../store";
import Table from "../../../components/table";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import Flex from "../../../components/flex";


const PolicyTerminationContainer = ({
                                        id,
                                        policyId = null,
                                    }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [terminateDate, setTerminateDate] = useState(new Date())
    const [isReturnPremium, setIsReturnPremium] = useState(false)
    const [isTransfer, setIsTransfer] = useState(false)
    const [whereToReturnPremium, setWhereToReturnPremium] = useState(null)
    const [isReturnAgentCommission, setIsReturnAgentCommission] = useState(false)
    const [hasDemonstrableCosts, setHasDemonstrableCosts] = useState(false)
    const [isReturnDemonstrableCosts, setIsReturnDemonstrableCosts] = useState(false)
    const [sumDemonstrableCosts, setSumDemonstrableCosts] = useState(0)
    const [receiverType, setReceiverType] = useState(0)
    let {data: policyData, isLoading, refetch} = useGetAllQuery({
        key: `terminate-${policyId}-${terminateDate}`,
        url: `${URLS.policy}/terminate-details`,
        params: {
            params: {
                policyId,
                terminateDate: dayjs(terminateDate).format("YYYY-MM-DD")
            }
        }
    })
    const {mutate: terminatePolicyRequest, isLoading: isLoadingPolicy} = usePostQuery({listKeyId: KEYS.agreements})


    const terminatePolicy = (data) => {
        terminatePolicyRequest({
            url: `${URLS.policy}/terminate/${policyId}`, attributes: {
                ...data,
                whereToReturnPremium
            }
        }, {
            onSuccess: () => {
                navigate(`/agreements/view/${id}`)
            },
            onError: () => {
            }
        })
    }

    useEffect(() => {
        if (terminateDate) {
            refetch()
        }
    }, [terminateDate])
    if (isLoading) {
        return <OverlayLoader/>;
    }

    return (
        <Section>
            {isLoadingPolicy && <ContentLoader/>}
            <Row className={'mb-15'} align={'center'}>
                <Col xs={12}>
                    <Title>Детали полиса:</Title>
                </Col>
                <Col xs={6}>
                    <Table thead={['1', '2']}>
                        <tr>
                            <td>{t("Номер полиса")}</td>
                            <td><strong>{get(policyData, "data.number", '-')}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>{t("Страхователь")}</td>
                            <td><strong>{get(policyData, "data.agent.name", '-')}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>{t("Продукт")}</td>
                            <td><strong>{get(policyData, "data.product.name", '-')}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>{t("Начало покрытия")}</td>
                            <td><strong>{dayjs(get(policyData, "data.startDate")).format("DD-MM-YYYY")}</strong>
                            </td>
                        </tr>
                    </Table>
                </Col>
                <Col xs={6}>
                    <Table thead={['1', '2']}>
                        <tr>
                            <td>{t("Конец покрытия")}</td>
                            <td><strong>{dayjs(get(policyData, "data.endDate")).format("DD-MM-YYYY")}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>{t("Страховая премия")}</td>
                            <td><strong><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                      value={get(policyData, "data.insurancePremium", 0)}/> </strong>
                            </td>
                        </tr>
                        <tr>
                            <td>{t("Агент")}</td>
                            <td><strong>{get(policyData, "data.agent.name", '-')}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td>{t("Агентское вознаграждение")}</td>
                            <td><strong><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                      value={get(policyData, "data.agenReward", 0)}/></strong>
                            </td>
                        </tr>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Title>Детали расторжения:</Title>
                </Col>
            </Row>
            <Form
                formRequest={({data}) => {
                    terminatePolicy(data);
                }}
                footer={<><Flex className={'mt-32'}><Button type={'submit'}
                                                            className={'mr-16'}>Расторгнуть</Button><Button
                    onClick={() => navigate(`/agreements/view/${id}`)} type={'button'} danger
                    className={'mr-16'}>Отменить</Button> {(isEqual(whereToReturnPremium, 'TO_CLIENT_ACCOUNT') || isReturnAgentCommission) &&
                    <Button
                        onClick={() => navigate(`/agreements/view/${id}`)} type={'button'} green
                        className={'mr-16'}>Возврат осуществлен</Button>}</Flex></>}>
                <Row>
                    <Col xs={12}>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Field defaultValue={terminateDate} property={{
                                    onChange: (val) => {
                                        if (val) {
                                            setTerminateDate(val)
                                        }
                                    }
                                }} label={t('Дата расторжения')} type={'datepicker'}
                                       name={'terminateDate'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field defaultValue={new Date()} label={t('Дата расторжения NAPP')} type={'datepicker'}
                                       name={'terminateDateNapp'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field label={t('Причина')} type={'input'}
                                       name={'reason'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field property={{disabled: true}}
                                       defaultValue={get(policyData, "data.unusedPremium", 0)}
                                       label={t('Неиспользованная премия')} type={'number-format-input'}
                                       name={'unusedPremium'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field
                                    type={'dropzone'}
                                    name={`actTermination`}
                                    label={'Акт'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'MFOclient'} type={'input-mask'} label={'МФО'}
                                       property={{mask: '99999', maskChar: '_'}}
                                       params={{
                                           required: true, pattern: {
                                               value: /^[0-9]*$/,
                                               message: 'Invalid format'
                                           }
                                       }}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'Innbank'} type={'input-mask'} label={'ИНН банка'}
                                       property={{mask: '999999999', maskChar: '_'}}
                                       params={{
                                           required: true, pattern: {
                                               value: /^[0-9]*$/,
                                               message: 'Invalid format'
                                           }
                                       }}/>
                            </Col>
                            <Col xs={4}>
                                <Field params={{required: true}} label={'Расчетный счет'} name={'accountnumber'}
                                       type={'input'}/>
                            </Col>
                            <Col xs={4}>
                                <Field params={{required: true}} label={'Номер карты'} name={'cardnumber'}
                                       type={'input'}/>
                            </Col>
                            <Col xs={4}>
                                <Field property={{onChange: (val) => setIsReturnPremium(val)}}
                                       label={t('Премия подлежит возврату')} type={'switch'}
                                       name={'isReturnPremium'} params={{required: true}}
                                />
                            </Col>
                            {isReturnPremium && <><Col xs={4}>
                                <Field property={{onChange: (val) => setHasDemonstrableCosts(val)}}
                                       defaultValue={get(policyData, "data.hasDemonstrableCosts", false)}
                                       label={t('Доказуемые расходы')} type={'switch'}
                                       name={'hasDemonstrableCosts'} params={{required: true}}
                                />
                            </Col>
                                <Col xs={4}>
                                    <Field property={{
                                        disabled: !hasDemonstrableCosts,
                                        onChange: (val) => setSumDemonstrableCosts(val)
                                    }}
                                           defaultValue={get(policyData, "data.sumDemonstrableCosts", 0)}
                                           label={t('Сумма')} type={'number-format-input'}
                                           name={'sumDemonstrableCosts'} params={{required: true}}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        property={{onChange: (val) => setIsReturnDemonstrableCosts(val)}}
                                        label={t('Удержать доказуемые расходы')} type={'switch'}
                                        name={'isReturnDemonstrableCosts'} params={{required: true}}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field property={{disabled: true}}
                                           defaultValue={hasDemonstrableCosts ? (isReturnDemonstrableCosts ? get(policyData, "data.returningPremium", 0) - sumDemonstrableCosts : get(policyData, "data.returningPremium", 0)) : get(policyData, "data.returningPremium", 0)}
                                           label={t('Итого премия к возврату')} type={'number-format-input'}
                                           name={'returningPremium'} params={{required: true, valueAsNumber: true}}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field label={'Куда вернуть премию'}
                                           property={{onChange: (val) => setWhereToReturnPremium(val)}}
                                           options={[
                                               {
                                                   value: 'TO_CLIENT_BALANCE ',
                                                   label: 'на баланс клиента'
                                               },
                                               {
                                                   value: 'TO_CLIENT_ACCOUNT',
                                                   label: 'возврат на счет клиента'
                                               }
                                           ]} type={'radio-group'}
                                           name={'whereToReturnPremium'}/>
                                </Col>
                                <Col xs={4}>
                                    <Field
                                        property={{onChange: (val) => setIsReturnAgentCommission(val)}}
                                        label={t('Удержать агентские')} type={'switch'}
                                        name={'isReturnAgentCommission'} params={{required: true}}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(policyData, "data.returningAgentComission", 0)}
                                           label={t('Агентские к возврату')} type={'number-format-input'}
                                           name={'returningAgentComission'}
                                           params={{required: true, valueAsNumber: true}}
                                    />
                                </Col>

                            </>}
                            <Col xs={4}>
                                <Field label={t('Получатель')} name={'receiver_name'}
                                       type={'input'}/>
                            </Col>
                            <Col xs={4}>
                                <Field label={t('Тип получателя')}
                                       defaultValue={0}
                                       property={{onChange: (val) => setReceiverType(val)}}
                                       options={[
                                           {value: 0, label: 'Физ. лиц.'},
                                           {value: 1, label: 'Юр. лиц.'},
                                       ]}
                                       type={'select'}
                                       name={'receiver_type'} params={{valueAsNumber: true}}
                                />
                            </Col>
                            {receiverType === 1 && <Col xs={4}>
                                <Field name={'receiver_inn'} type={'input-mask'} label={t('ИНН Получателья')}
                                       property={{mask: '999999999', maskChar: '_'}}
                                       params={{
                                           pattern: {
                                               value: /^[0-9]*$/,
                                               message: 'Invalid format'
                                           }
                                       }}/>
                            </Col>}
                            {receiverType === 0 && <Col xs={4}>
                                <Field name={'receiver_pinfl'} type={'input-mask'} label={t('ПИНФЛ Получателья')}
                                       property={{mask: '99999999999999', maskChar: '_'}}
                                       params={{
                                           pattern: {
                                               value: /^[0-9]*$/,
                                               message: 'Invalid format'
                                           }
                                       }}/>
                            </Col>}
                            <Col xs={4}>
                                <Field    options={[
                                    {
                                        value: false,
                                        label: 'вернуть'
                                    },
                                    {
                                        value: true,
                                        label: 'перекинуть'
                                    }
                                ]} property={{onChange: (val) => setIsTransfer(val)}}
                                       label={t('Вернуть деньги клиенту / перекинуть на другой полис')} type={'switch'}
                                       name={'isTransfer'} params={{required: true}}
                                />
                            </Col>
                            {isTransfer && <>
                                <Col xs={4}>
                                    <Field params={{required: true}} label={'Номер полиса'} name={'nomer'}
                                           type={'input'}/>
                                </Col>
                                <Col xs={4}>
                                    <Field params={{required: true}} label={'Серия полиса'} name={'seria'}
                                           type={'input'}/>
                                </Col>
                            </>}
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Section>
    );
};

export default PolicyTerminationContainer;
