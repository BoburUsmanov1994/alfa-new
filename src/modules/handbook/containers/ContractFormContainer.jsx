import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";

const ContractFormContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Справочники',
            path: '/handbook',
        },
        {
            id: 2,
            title: 'Форма контракта',
            path: '/handbook/contract-form',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={'Введите название'} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
        <Field  name={'url'} type={'input'} label={'Введите URL-адрес'} defaultValue={rowId ? get(data,'url'):null} params={{required: true}} />
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: 'Название контракта'
                    },
                    {
                        id: 3,
                        key: 'url',
                        title: 'URL-адрес'
                    },
                ]}
                keyId={KEYS.contractform}
                url={URLS.contractForm}
                listUrl={`${URLS.contractForm}/list`}
                title={'Форма контракта'}
                responseDataKey={'data'}

            />
        </>
    );
};

export default ContractFormContainer;