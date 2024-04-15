import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";

const TransactionLogsContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Accounting',
            path: '/accounting',
        },
        {
            id: 2,
            title: 'Bco blanks',
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
                        title: 'Distribute type'
                    },
                    {
                        id: 2,
                        key: 'payment_order_number',
                        title: 'Payment order number'
                    },
                    {
                        id: 3,
                        key: 'amount',
                        title: 'Amount',
                        hasNumberFormat: true
                    },
                    {
                        id: 4,
                        key: 'cred_account_ID',
                        title: 'cred_account_ID',
                    },
                    {
                        id: 5,
                        key: 'debt_account_ID',
                        title: 'debt_account_ID',
                    },
                    {
                        id: 6,
                        key: 'transaction_date',
                        title: 'transaction_date',
                        date: true,
                        dateFormat: 'MM/DD/YYYY'
                    },
                ]}
                keyId={KEYS.transactionLogs}
                url={URLS.transactionLogs}
                listUrl={`${URLS.transactionLogs}/list`}
                title={'Transaction logs'}
                responseDataKey={'data.data'}
                hideCreateBtn
                hideDeleteBtn
            />
        </>
    );
};

export default TransactionLogsContainer;