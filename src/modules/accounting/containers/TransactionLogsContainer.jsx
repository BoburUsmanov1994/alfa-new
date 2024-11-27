import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import { useTranslation } from 'react-i18next';

const TransactionLogsContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {t} = useTranslation()

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Accounting"),
            path: '/accounting',
        },
        {
            id: 2,
            title: t("Bco blanks"),
            path: '/accounting/bco-blanks',
        }
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
                        key: 'typeofdistribute.name',
                        title: t('Distribute type')
                    },
                    {
                        id: 2,
                        key: 'payment_order_number',
                        title: t('Payment order number')
                    },
                    {
                        id: 3,
                        key: 'amount',
                        title:t('Amount'),
                        hasNumberFormat: true
                    },
                    {
                        id: 4,
                        key: 'cred_account_ID',
                        title: t('cred_account_ID'),
                    },
                    {
                        id: 5,
                        key: 'debt_account_ID',
                        title: t('debt_account_ID'),
                    },
                    {
                        id: 6,
                        key: 'transaction_date',
                        title: t('transaction_date'),
                        date: true,
                        dateFormat: 'MM/DD/YYYY'
                    },
                ]}
                keyId={KEYS.transactionLogs}
                url={URLS.transactionLogs}
                listUrl={`${URLS.transactionLogs}/list`}
                title={t('Transaction logs')}
                responseDataKey={'data.data'}
                hideCreateBtn
                hideDeleteBtn
            />
        </>
    );
};

export default TransactionLogsContainer;