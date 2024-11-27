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
import {useGetAllQuery, useGetOneQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {OverlayLoader} from "../../../components/loader";
import { useTranslation } from 'react-i18next';


const ProductUpdateContainer = ({id, ...rest}) => {
    const {t} = useTranslation()
    let {data, isLoading, isError} = useGetOneQuery({id, key: KEYS.products, url: URLS.products})
    const setProduct = useSettingsStore(state => get(state, 'setProduct', () => {
    }))
    const resetProduct = useSettingsStore(state => get(state, 'resetProduct', () => {
    }))
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Продукты"),
            path: '/products',
        },
        {
            id: 2,
            title: get(data, 'data.data.productname'),
            path: '#',
        }
    ], [data])

    useEffect(() => {

        resetProduct()
    }, [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
        if (data) {
            const {
                groupofproductsId, subgroupofproductsId, typeofinsurerId, typeofsectorId,
                fixedpolicyholder, fixedbeneficiary, policyformatId, typeofclaimsettlement,
                typeofpayment, typeofpolice, agentlist, typeofrefund,
                ...rest
            } = get(data, 'data.data', {})

            setProduct({
                ...rest,
                groupofproductsId: get(groupofproductsId, '_id'),
                subgroupofproductsId: get(subgroupofproductsId, '_id'),
                typeofinsurerId: get(typeofinsurerId, '_id'),
                typeofsectorId: get(typeofsectorId, '_id'),
                fixedpolicyholder: get(fixedpolicyholder, '_id'),
                fixedbeneficiary: fixedbeneficiary.map(({_id}) => _id),
                policyformatId: get(policyformatId, '_id'),
                typeofclaimsettlement: get(typeofclaimsettlement, '_id'),
                typeofpayment: typeofpayment.map(({_id}) => _id),
                typeofpolice: typeofpolice.map(({_id}) => _id),
                agentlist: agentlist.map(({_id}) => _id),
                typeofrefund: get(typeofrefund, '_id')
            })
        }

    }, [get(data, 'data.data')])

    const product = useSettingsStore(state => get(state, 'product', {}))
    console.log('Product', product)

    if (isLoading) {
        return <OverlayLoader/>
    }

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
                        <Title>{t("Изменить продукт")} ({get(data, 'data.data.productname')})</Title>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <StepWizard isHashEnabled={true}>
                            <StepOne id={id} hashKey={"one"}/>
                            <StepTwo hashKey={"two"}/>
                            <StepThree hashKey={"three"}/>
                            <StepFour id={id} hashKey={"four"}/>
                            <StepFive id={id} hashKey={"five"}/>
                            <StepSix hashKey={"six"}/>
                        </StepWizard>
                    </Col>
                </Row>
            </Section>
        </>
    );
};

export default ProductUpdateContainer;