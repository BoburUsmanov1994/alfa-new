import React, {useEffect, useMemo} from 'react';
import {useSettingsStore, useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";

const AgreementsContainer = ({...rest}) => {
    const {t} = useTranslation()

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Agreements',
            path: '/agreements',
        },
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    return (
        <>
            <GridView
                tableHeaderData={[
                    {
                        id: 11,
                        key: 'startofinsurance',
                        title: 'startofinsurance',
                        date:true
                    },
                    {
                        id: 12,
                        key: 'endofinsurance',
                        title: 'endofinsurance',
                        date:true
                    },
                    {
                        id: 1,
                        key: 'numberofcontract',
                        title: 'numberofcontract'
                    },
                    {
                        id: 2,
                        key: 'products.productname',
                        title: 'Наименование продукта'
                    },
                    {
                        id: 3,
                        key: 'typeofpolice',
                        title: 'Тип страховщика',
                        isArray:true
                    },
                    {
                        id: 4,
                        key: 'paymentcurrency.name_',
                        title: 'Тип оплаты',
                        isArray:true
                    },
                    {
                        id: 5,
                        key: 'typeofinsurerId.name',
                        title: 'Страхователь',
                    },
                    {
                        id: 6,
                        key: 'policyformatId.name',
                        title: 'Формат полиса',
                    },
                    {
                        id: 7,
                        key: 'totalinsurancepremium',
                        title: 'totalinsurancepremium',
                        hasNumberFormat:true
                    },
                    {
                        id: 8,
                        key: 'status',
                        title: 'Status',
                    },
                ]}
                keyId={KEYS.agreements}
                url={URLS.agreements}
                title={t('Agreements')}
                responseDataKey={'data'}
                viewUrl={'/agreements/view'}
                createUrl={'/agreements/create'}
                // updateUrl={'/agreements/update'}
                isHideColumn

            />
        </>
    );
};

export default AgreementsContainer;