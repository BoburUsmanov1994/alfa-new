import React, {useState} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {get, head, includes} from "lodash"
import {useGetAllQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import Title from "../../../../components/ui/title";
import Modal from "../../../../components/modal";
import {useTranslation} from "react-i18next";
import Table from "../../../../components/table";
import {Trash2} from "react-feather";

const StepThree = ({...props}) => {
    const [fields, setFields] = useState({})
    const {t} = useTranslation()

    const [openCommissionModal, setOpenCommissionModal] = useState(false);
    const addCommissions = useSettingsStore(state => get(state, 'addCommissions', () => {
    }))
    const setAgreement = useSettingsStore(state => get(state, 'setAgreement', () => {
    }))
    const resetAgreement = useSettingsStore(state => get(state, 'resetAgreement', () => {
    }))

    const removeCommissions = useSettingsStore(state => get(state, 'removeCommissions', () => {
    }))


    const agreement = useSettingsStore(state => get(state, 'agreement', {}))
    const commissions = useSettingsStore(state => get(state, 'commissions', []))

    let {data: agents} = useGetAllQuery({key: ['agents-list'], url: `${URLS.agents}/list`})
    agents = getSelectOptionsListFromData(get(agents, `data.data`, []), '_id', ['organization.nameoforganization', 'person.secondname', 'person.name'])

    const nextStep = ({data}) => {
        setAgreement(data);
        props.nextStep();
    }

    const prevStep = () => {
        props.previousStep();
    }

    const reset = () => {
        resetAgreement();
        props.firstStep();
    }

    console.log('agreement', agreement)

    return (
        <Row>
            <Col xs={12}>
                <StepNav step={3} steps={['Продукт', 'Обязательства', 'Расторжение', 'Документооборот']}/>
            </Col>
            <Col xs={12}>
                <Form getValueFromField={(value, name) => setFields(prev => ({...prev, [name]: value}))}
                      formRequest={nextStep}>
                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title>Комиссия</Title>
                        </Col>
                        <Col xs={12} className={'text-right mb-15'}>
                            <Button onClick={() => setOpenCommissionModal(true)} type={'button'}>Выбрать
                                агентов</Button>
                        </Col>
                        <Col xs={12} className={'horizontal-scroll'}>
                            <hr/>
                            {commissions.length > 0 && <Table hideThead={false}
                                                              thead={['Выберите агента', 'Процент вознаграждения %', 'Начисленная сумма комиссии', 'Оплаченная сумма комиссии', 'Начисленный возврат комиссии', 'Возвращенная \n' +
                                                              'комиссия', 'Actions']}>
                                {commissions?.length > 0 && commissions.map((obj, i) => <tr key={get(obj, 'id', i)}>
                                    <td>
                                        <Field
                                            className={'w-250'}
                                            options={agents}
                                            type={'select'}
                                            name={`commission[${i}].agent`}
                                            defaultValue={get(obj, 'agent')}
                                            property={{hideLabel: true}}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            type={'number-format-input'}
                                            name={`commission[${i}].percentageRemuneration`}
                                            defaultValue={get(obj, 'percentageRemuneration')}
                                            property={{hideLabel: true, disabled: true}}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            type={'number-format-input'}
                                            name={`commission[${i}].accruedCommissionAmount`}
                                            defaultValue={get(obj, 'accruedCommissionAmount')}
                                            property={{hideLabel: true, disabled: true}}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            type={'number-format-input'}
                                            name={`commission[${i}].paidcommissionAmount`}
                                            defaultValue={get(obj, 'paidcommissionAmount')}
                                            property={{hideLabel: true, disabled: true}}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            type={'input'}
                                            name={`commission[${i}].accruedCommissionRefund`}
                                            defaultValue={get(obj, 'accruedCommissionRefund')}
                                            property={{hideLabel: true, disabled: true}}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            type={'input'}
                                            name={`commission[${i}].returnedCommission`}
                                            defaultValue={get(obj, 'returnedCommission')}
                                            property={{hideLabel: true, disabled: true}}
                                        />
                                    </td>
                                    <td className={'cursor-pointer'}
                                        onClick={() => removeCommissions(get(obj, 'id', i))}>
                                        <Trash2 color={'#dc2626'}/>
                                    </td>
                                </tr>)
                                }
                            </Table>}
                        </Col>

                    </Row>
                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title>РПМ</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>
                            <Field
                                name={`rpm.perDeductionsRPM`}
                                type={'number-format-input'}
                                label={'Процент отчислений в РПМ'}
                                property={{
                                    placeholder: 'ввод значения',
                                    suffix: '%'
                                }}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                disabled
                                name={`rpm.amountDeductionsRPM`}
                                type={'number-format-input'}
                                label={'Сумма отчислений в РПМ'}
                                defaultValue={get(fields, 'rpm.perDeductionsRPM') * get(agreement, 'totalInsurancePremium') / 100}
                                property={{
                                    disabled: true,
                                    placeholder: 'ввод значения',
                                }}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} className={'mt-32'}>
                            <Button className={'mr-16'} type={'button'} onClick={reset} danger outlined
                                    back>Отменить</Button>
                            <Button dark className={'mr-16'} type={'button'} onClick={prevStep}
                                    outlined>Назад</Button>
                            <Button type={'submit'} success>Продолжить</Button>
                        </Col>
                    </Row>
                </Form>
                <Modal title={'Добавить комиссия'} visible={openCommissionModal}
                       hide={setOpenCommissionModal}>

                    <Form formRequest={({data}) => {
                        addCommissions({...data, id: commissions.length});
                        setOpenCommissionModal(false)
                    }}
                          footer={<><Button>{t("Add")}</Button></>}>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Field
                                    options={agents}
                                    type={'select'}
                                    name={`agent`}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field type={'number-format-input'}
                                       name={`percentageRemuneration`}
                                       property={{suffix: '%'}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field type={'number-format-input'}
                                       name={`accruedCommissionAmount`}
                                       property={{suffix: '%'}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field type={'number-format-input'}
                                       name={`paidcommissionAmount`}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field type={'input'}
                                       name={`accruedCommissionRefund`}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field type={'input'}
                                       name={`returnedCommission`}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </Col>
        </Row>
    );
};

export default StepThree;