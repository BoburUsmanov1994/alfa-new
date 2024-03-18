import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";

const RiskContainer = ({...rest}) => {
    const {data:types} = useGetAllQuery({key:KEYS.typeofrisk,url:`${URLS.riskType}/list`})
    const typesOptions = getSelectOptionsListFromData(get(types,`data`,[]),'_id','name')

    const {data:classes} = useGetAllQuery({key:KEYS.classes,url:`${URLS.insuranceClass}/list`})
    const typesClasses = getSelectOptionsListFromData(get(classes,`data`,[]),'_id','name')

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
            title: 'Риск',
            path: '/handbook/risk',
        },

    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={'Название риска'} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
        <Field  name={'riskType'} type={'select'} label={'Tипа риск '} options={typesOptions} defaultValue={rowId ? get(data,'riskType'):null} params={{required: true}} />
        <Field  name={'insuranceClass'} type={'select'} label={'Class '} options={typesClasses} defaultValue={rowId ? get(data,'insuranceClass'):null} params={{required: true}} />
        <Field  name={'categoryNumber'} type={'input'} label={'Category number '} property={{type:'number'}} defaultValue={rowId ? get(data,'categoryNumber'):null} params={{required: true}} />
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: 'Название риска'
                    },
                    {
                        id: 3,
                        key: 'riskType',
                        title: 'Tипа риска'
                    },
                    {
                        id: 4,
                        key: 'insuranceClass',
                        title: 'Class'
                    },
                    {
                        id: 5,
                        key: 'categoryNumber',
                        title: 'Category number'
                    },
                ]}
                keyId={KEYS.risk}
                url={URLS.risk}
                listUrl={`${URLS.risk}/list`}
                title={'Риск'}
                responseDataKey={'data'}

            />
        </>
    );
};

export default RiskContainer;