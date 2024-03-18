import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";

const DistributionTypeContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Бухгалтерия',
            path: '/accounting',
        },
        {
            id: 2,
            title: 'Тип распределения',
            path: '#',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'nameofoperations'} type={'input'} label={'Название'} defaultValue={rowId ? get(data, 'nameofoperations') : null}
               params={{required: true}}/>
        <Field name={'debt_account_ID'} type={'input'} label={'Debit code'}
               defaultValue={rowId ? get(data, 'debt_account_ID') : null}
               params={{required: true}}/>
        <Field name={'cred_account_ID'} type={'input'} label={'Credit code'}
               defaultValue={rowId ? get(data, 'cred_account_ID') : null}
               params={{required: true}}/>
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'nameofoperations',
                        title: 'Название'
                    },
                    {
                        id: 2,
                        key: 'debt_account_ID',
                        title: 'Debit code'
                    },
                    {
                        id: 3,
                        key: 'cred_account_ID',
                        title: 'Credit code'
                    },
                ]}
                keyId={KEYS.typeofdistribute}
                url={URLS.typeofdistribute}
                title={'Тип распределения'}
                responseDataKey={'data'}
            />
        </>
    );
};

export default DistributionTypeContainer;
