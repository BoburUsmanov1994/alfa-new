import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";

const TypeRiskContainer = ({...rest}) => {
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
            title: 'Тип риска',
            path: '/handbook/risk-type',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={'Название'} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
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
                ]}
                keyId={KEYS.typeofrisk}
                url={URLS.riskType}
                listUrl={`${URLS.riskType}/list`}
                title={'Тип риска'}
                responseDataKey={'data.data'}

            />
        </>
    );
};

export default TypeRiskContainer;