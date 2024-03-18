import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";

const ObjectContainer = ({...rest}) => {
    const {data:types} = useGetAllQuery({key:KEYS.typeofobject,url:URLS.typeofobject})
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
            title: 'Объект страхования',
            path: '/handbook/object',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={'Введите название'} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
        <Field  name={'typobjectsId'} type={'select'} label={'Tипа объекта'} options={typesOptions} defaultValue={rowId ? get(data,'typobjectsId'):null} params={{required: true}} />
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: 'Название объекта'
                    },
                    {
                        id: 3,
                        key: 'typobjectsId.name',
                        title: 'Tипа объекта'
                    },

                ]}
                keyId={KEYS.object}
                url={URLS.object}
                title={'Объект страхования'}
                responseDataKey={'data'}

            />
        </>
    );
};

export default ObjectContainer;