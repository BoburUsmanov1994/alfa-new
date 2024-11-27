import React from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {get} from "lodash"
import Title from "../../../../components/ui/title";
import {useTranslation} from "react-i18next";
import {usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {OverlayLoader} from "../../../../components/loader";
import {useNavigate} from "react-router-dom";

const StepFour = ({id = null, ...props}) => {
    const navigate = useNavigate()
    const {t} = useTranslation()

    const {mutate: createAgreement, isLoading} = usePostQuery({listKeyId: KEYS.agreements})

    const resetAgreement = useSettingsStore(state => get(state, 'resetAgreement', () => {
    }))



    const agreement = useSettingsStore(state => get(state, 'agreement', {}))


    const nextStep = ({data}) => {
        if (id) {
            // updateProduct({url: `${URLS.products}/${id}`, attributes: product}, {
            //     onSuccess: () => {
            //         resetRiskList();
            //         resetProduct();
            //         props.nextStep();
            //     },
            //     onError: () => {
            //
            //     }
            // })
        } else {
            const {product, ...rest} = agreement
            createAgreement({url: URLS.agreements, attributes: {...rest, ...data, product: get(product, '_id')}}, {
                onSuccess: () => {
                    resetAgreement();
                    navigate('/agreements')
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
        resetAgreement();
        props.firstStep();
    }
    
    return (
        <Row>
            {(isLoading) && <OverlayLoader/>}
            <Col xs={12}>
                <StepNav step={4} steps={['Продукт', 'Обязательства', 'Расторжение', 'Документооборот']}/>
            </Col>
            <Col xs={12}>
                <Form formRequest={nextStep}>
                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title>{t("Анкета заявления")}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>
                            <Field property={{minDate:new Date()}} params={{required:true}} name={'applicationDate'}
                                   type={'datepicker'}
                                   label={t("Анкета заявления")}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                name={`registrationNumber`}
                                type={'input'}
                                label={t("Номер регистрации")}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field property={{minDate:new Date()}} params={{required:true}} name={'applicationDate'} type={'datepicker'}
                                   label={t("Дата заявления")}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                name={`whoAccepted`}
                                type={'input'}
                                label={t("Кем принято")}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                name={`copyOfDocuments`}
                                type={'dropzone'}
                                label={t("Скан копии документов")}
                            />
                        </Col>

                    </Row>

                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title>{t("Договор")}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>
                            <Field
                                label={t('Генеральный договор')}
                                type={'switch'}
                                name={'hasGeneralAgreement'}
                                params={{required: true}}
                            />
                        </Col>
                        <Col xs={3}>
                            <Field
                                name={`copyOfAgreement`}
                                type={'dropzone'}
                                label={t("Скан копии договоров")}
                            />
                        </Col>
                    </Row>
                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title>{t("Приложения")}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={3}>
                            <Field
                                name={`documents`}
                                type={'dropzone'}
                                label={t("Скан копии документов")}
                            />
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
    );
};

export default StepFour;