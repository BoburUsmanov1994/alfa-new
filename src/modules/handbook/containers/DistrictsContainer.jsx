import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import Panel from "../../../components/panel";
import {Col, Row} from "react-grid-system";
import Search from "../../../components/search";
import Button from "../../../components/ui/button";
import Section from "../../../components/section";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";
import Field from "../../../containers/form/field";

const DistrictsContainer = ({...rest}) => {
    const {data:types} = useGetAllQuery({key:KEYS.regions,url:`${URLS.regions}/list`})
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
            title: 'Districts',
            path: '/handbook/districts',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])
    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={'Название'} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
        <Field  name={'region'} type={'select'} label={'Region'} options={typesOptions} defaultValue={rowId ? get(data,'region._id'):null} params={{required: true}} />
        <Field  name={'fondId'} type={'input'}  defaultValue={1} params={{required: true}} property={{type:'hidden',hideLabel:true}} />
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: 'Название'
                    },
                    {
                        id: 3,
                        key: 'region',
                        title: 'Region'
                    }
                ]}
                keyId={KEYS.districts}
                url={URLS.districts}
                listUrl={`${URLS.districts}/list`}
                title={'Districts'}
                responseDataKey={'data'}

            />
        </>
    );
};

export default DistrictsContainer;