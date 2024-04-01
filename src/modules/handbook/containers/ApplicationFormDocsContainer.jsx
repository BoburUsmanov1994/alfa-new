import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";

const ApplicationFormDocsContainer = ({...rest}) => {
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
            title: 'Документы формы заявки',
            path: '/handbook/application-form-docs',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={'Название документа'} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
        <Field name={'file'} type={'dropzone'} label={'Выберите файл'} defaultValue={rowId ? get(data, 'file') : null}
               params={{required: true}}/>
    </>
    return (
        <>
            <GridView
                isFormData
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: 'Название документа'
                    },
                    {
                        id: 3,
                        key: 'path',
                        title: 'Path'
                    },
                ]}
                keyId={KEYS.applicationformdocs}
                url={URLS.applicationForm}
                listUrl={`${URLS.applicationForm}/list`}
                title={'Документы формы заявки'}
                responseDataKey={'data.data'}

            />
        </>
    );
};

export default ApplicationFormDocsContainer;