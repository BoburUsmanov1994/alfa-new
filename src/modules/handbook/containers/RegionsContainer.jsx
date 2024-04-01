import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";

const RegionsContainer = ({...rest}) => {
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
            title: 'Регионы',
            path: '/handbook/regions',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={'Region name'} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
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
                        title: 'Region name'
                    },
                ]}
                keyId={KEYS.regions}
                url={URLS.regions}
                listUrl={`${URLS.regions}/list`}
                title={'Список регионы'}
                responseDataKey={'data.data'}

            />
        </>
    );
};

export default RegionsContainer;