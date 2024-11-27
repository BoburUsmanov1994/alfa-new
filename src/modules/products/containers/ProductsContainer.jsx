import React, {useEffect, useMemo} from 'react';
import {useSettingsStore, useStore} from "../../../store";
import {get, includes} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";
import config from "../../../config";

const ProductsContainer = () => {
    const {t} = useTranslation()
    const user = useStore(state => get(state, 'user'))
    const resetProduct = useSettingsStore(state => get(state, 'resetProduct', () => {
    }))
    const resetRiskList = useSettingsStore(state => get(state, 'resetRiskList', []))
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
            title: t("Все продукты"),
            path: '/products/all',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
        resetProduct()
        resetRiskList()
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={t("Название продукта")} defaultValue={rowId ? get(data, 'name') : null}
               params={{required: true}}/>
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: t("Наименование продукта")
                    },
                    {
                        id: 3,
                        key: 'policyTypes',
                        title: t("Тип страховщика"),
                        arrayKey: 'name',
                        isArray: true
                    },
                    {
                        id: 4,
                        key: 'paymentType',
                        title: t("Тип оплаты"),
                        arrayKey: 'name',
                        isArray: true
                    },
                    {
                        id: 7,
                        key: 'fixedPremium',
                        title: t("Страховая сумма"),
                        hasNumberFormat: true
                    },
                ]}
                keyId={KEYS.products}
                url={URLS.products}
                title={t('Все продукты')}
                // responseDataKey={'data.data'}
                viewUrl={'/products/view'}
                createUrl={'/products/create'}
                // updateUrl={'/products/update'}
                isHideColumn
                responseDataKey={'data.data'}
                hideCreateBtn={!includes([config.ROLES.admin],get(user,'role.name'))}
                hideDeleteBtn={!includes([config.ROLES.admin],get(user,'role.name'))}

            />
        </>
    );
};

export default ProductsContainer;