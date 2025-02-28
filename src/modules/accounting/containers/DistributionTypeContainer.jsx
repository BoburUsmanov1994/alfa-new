import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const DistributionTypeContainer = ({...rest}) => {
    const {t} = useTranslation()
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Бухгалтерия"),
            path: '/accounting',
        },
        {
            id: 2,
            title: t("Тип распределения"),
            path: '#',
        }
    ], [])
    let {data: accounts} = useGetAllQuery({
        key: KEYS.account, url: `${URLS.account}/list`
    })
    accounts = getSelectOptionsListFromData(get(accounts, `data.data`, []), '_id', 'account_name')

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={'Название'} defaultValue={rowId ? get(data, 'name') : null}
               params={{required: true}}/>
        <Field name={'debt_account'} type={'select'} label={'Debit account'}
               defaultValue={rowId ? get(data, 'debt_account') : null}
               params={{required: true}} options={accounts}/>
        <Field name={'cred_account'} type={'select'} label={'Credit account'} options={accounts}
               defaultValue={rowId ? get(data, 'cred_account') : null}
               params={{required: true}}/>
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'name',
                        title: t("Название")
                    },
                    {
                        id: 2,
                        key: 'debt_account.account_ID',
                        title: t('Debit code')
                    },
                    {
                        id: 3,
                        key: 'cred_account.account_ID',
                        title: t('Credit code')
                    },
                ]}
                keyId={KEYS.distributeType}
                url={URLS.distributeType}
                listUrl={`${URLS.distributeType}/list`}
                title={t('Тип распределения')}
                responseDataKey={'data.data'}
            />
        </>
    );
};

export default DistributionTypeContainer;
