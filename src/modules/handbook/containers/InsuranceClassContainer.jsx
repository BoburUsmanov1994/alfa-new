import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";

const InsuranceClassContainer = ({...rest}) => {
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
            title: 'Класс страхования',
            path: '/handbook/insurance-classes',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={'Название класса'} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
        <Field  name={'color'} type={'input'} label={'Color'} defaultValue={rowId ? get(data,'color'):null} params={{required: true}} />
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: 'Название класса'
                    },
                    {
                        id: 2,
                        key: 'color',
                        title: 'Color'
                    },
                ]}
                keyId={KEYS.classes}
                url={URLS.insuranceClass}
                listUrl={`${URLS.insuranceClass}/list`}
                title={'Класс страхования'}
                responseDataKey={'data.data'}

            />
        </>
    );
};

export default InsuranceClassContainer;