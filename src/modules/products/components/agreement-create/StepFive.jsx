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
import {useTranslation} from "react-i18next";


const StepFive = ({...props}) => {
    const {t} = useTranslation()

    const setAgreement = useSettingsStore(state => get(state, 'setAgreement', () => {
    }))
    const resetAgreement = useSettingsStore(state => get(state, 'resetAgreement', () => {
    }))




    const agreement = useSettingsStore(state => get(state, 'agreement', {}))
    console.log('agreement',agreement)


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


    return (
        <Row>
            <Col xs={12}>
                <StepNav step={5}
                         steps={['Продукт', 'Обязательства', 'Расторжение', 'Документооборот', 'Индоссаменты']}/>
            </Col>
            <Col xs={12}>
                <Form formRequest={nextStep}>
                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title>{t("Анкета заявления")}</Title>
                        </Col>
                    </Row>


                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title>{t("Договор")}</Title>
                        </Col>
                    </Row>


                    <Row>
                        <Col xs={12} className={'mt-32'}>
                            <Button className={'mr-16'} type={'button'} onClick={reset} danger outlined
                                    back>{t("Отменить")}</Button>
                            <Button dark className={'mr-16'} type={'button'} onClick={prevStep}
                                    outlined>{t("Назад")}</Button>
                            <Button type={'button'} success>{t("Продолжить")}</Button>
                        </Col>
                    </Row>
                </Form>

            </Col>
        </Row>
    );
};

export default StepFive;