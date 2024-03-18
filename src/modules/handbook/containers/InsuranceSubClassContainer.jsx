import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";

const InsuranceSubClassContainer = ({...rest}) => {
    const {data:types} = useGetAllQuery({key:KEYS.classes,url:URLS.classes})
    const typesOptions = getSelectOptionsListFromData(get(types,`data.data`,[]),'_id','name')
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
            title: 'Название подкласса',
            path: '/handbook/insurance-subclasses',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={'Название подкласса'} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
        <Field  name={'classId'} type={'select'} label={'Tипа класса'} options={typesOptions} defaultValue={rowId ? get(data,'classId'):null} params={{required: true}} />
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: 'Название подкласса'
                    },
                    {
                        id: 3,
                        key: 'classId',
                        title: 'Tипа класса'
                    },
                ]}
                keyId={KEYS.classes}
                url={URLS.classes}
                title={'Название подкласса'}
                responseDataKey={'data'}

            />
        </>
    );
};

export default InsuranceSubClassContainer;