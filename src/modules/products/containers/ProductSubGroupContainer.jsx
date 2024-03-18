import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";
import {useTranslation} from "react-i18next";

const ProductSubGroupContainer = ({...rest}) => {
    const {t} = useTranslation()
    const {data:types} = useGetAllQuery({key:KEYS.groupsofproducts,url:`${URLS.groupsofproducts}/list`})
    const typesOptions = getSelectOptionsListFromData(get(types,`data`,[]),'_id','name')
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
            title: 'Подгруппы продуктов',
            path: '/handbook/product-subgroup',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={'Название подгруппы продуктов'} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
        <Field  name={'group'} type={'select'} label={'Название продукта '} options={typesOptions} defaultValue={rowId ? get(data,'group'):null} params={{required: true}} />
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: 'Название подгруппы продуктов'
                    },
                    {
                        id: 3,
                        key: 'group',
                        title: 'Название продукта'
                    },
                ]}
                keyId={KEYS.subgroupsofproducts}
                url={URLS.subgroupsofproducts}
                listUrl={`${URLS.subgroupsofproducts}/list`}
                title={t('Подгруппы продуктов')}
                responseDataKey={'data'}

            />
        </>
    );
};

export default ProductSubGroupContainer;