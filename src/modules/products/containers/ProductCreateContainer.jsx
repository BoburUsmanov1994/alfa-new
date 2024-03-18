import React, {useEffect, useMemo} from 'react';
import {useSettingsStore, useStore} from "../../../store";
import {get} from "lodash";
import StepWizard from "react-step-wizard";
import Panel from "../../../components/panel";
import Search from "../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import StepOne from "../components/create/StepOne";
import StepTwo from "../components/create/StepTwo";
import StepThree from "../components/create/StepThree";
import StepFour from "../components/create/StepFour";
import StepFive from "../components/create/StepFive";
import StepSix from "../components/create/StepSix";

const ProductCreateContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Продукты',
            path: '/products',
        },
        {
            id: 2,
            title: 'Добавить продукт',
            path: '/products/create',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const product = useSettingsStore(state => get(state, 'product', {}))
    console.log('Product', product)


    return (
        <>
            <Panel>
                <Row>
                    <Col xs={12}>
                        <Search/>
                    </Col>
                </Row>
            </Panel>
            <Section>
                <Row>
                    <Col xs={12}>
                        <Title>Добавить продукт</Title>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <StepWizard isHashEnabled={true}>
                            <StepOne hashKey={"one"}/>
                            <StepTwo hashKey={"two"}/>
                            <StepThree hashKey={"three"}/>
                            <StepFour hashKey={"four"}/>
                            <StepFive hashKey={"five"}/>
                            <StepSix hashKey={"six"}/>
                        </StepWizard>
                    </Col>
                </Row>
            </Section>
        </>
    );
};

export default ProductCreateContainer;