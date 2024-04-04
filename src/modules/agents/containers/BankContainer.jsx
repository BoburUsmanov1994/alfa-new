import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";

const BankContainer = ({...rest}) => {

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))


    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Агенты',
            path: '/agents',
        },
        {
            id: 2,
            title: 'Bank',
            path: '/agents/bank',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={'Name'} defaultValue={rowId ? get(data, 'name') : null}
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
                        title: 'Название'
                    },
                    {
                        id: 2,
                        key: 'inn',
                        title: 'INN'
                    },
                    {
                        id: 3,
                        key: 'username',
                        title: 'Username'
                    },
                ]}
                keyId={KEYS.bank}
                url={URLS.bank}
                listUrl={`${URLS.bank}/list`}
                title={'Bank'}
                responseDataKey={'data.data'}
                // viewUrl={'/agents/bank/view'}
                createUrl={'/agents/bank/create'}
            />
        </>
    );
};

export default BankContainer;