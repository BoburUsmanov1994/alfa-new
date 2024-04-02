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
                        id: 1,
                        key: 'agreementNumber',
                        title: 'agreementNumber'
                    },
                    {
                        id: 1111,
                        key: 'agreementDate',
                        title: 'agreementDate'
                    },
                    {
                        id: 11,
                        key: 'startOfInsurance',
                        title: 'startOfInsurance',
                        date: true
                    },
                    {
                        id: 12,
                        key: 'endOfInsurance',
                        title: 'endOfInsurance',
                        date: true
                    },
                    {
                        id: 2,
                        key: 'product.name',
                        title: 'Наименование продукта'
                    },
                    {
                        id: 7,
                        key: 'totalInsuranceSum',
                        title: 'totalInsuranceSum',
                        hasNumberFormat: true
                    },
                    {
                        id: 77,
                        key: 'totalInsurancePremium',
                        title: 'totalInsurancePremium',
                        hasNumberFormat: true
                    },
                    {
                        id: 8,
                        key: 'status',
                        title: 'Status',
                    },
                ]}
                keyId={KEYS.agreements}
                url={URLS.agreements}
                listUrl={`${URLS.agreements}/list`}
                title={t('Agreements')}
                responseDataKey={'data.data'}
                // viewUrl={'/agreements/view'}
                createUrl={'/agreements/create'}
                // updateUrl={'/agreements/update'}
                isHideColumn
                // hideCreateBtn
            />
        </>
    );
};

export default AgreementsContainer;