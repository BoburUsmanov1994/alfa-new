import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";

const AdditionalDocumentsContainer = ({...rest}) => {
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
            title: 'Дополнительные документы',
            path: '/handbook/additional-documents',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={'Введите название'} defaultValue={rowId ? get(data, 'name') : null}
               params={{required: true}}/>
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
                keyId={KEYS.additionaldocuments}
                url={URLS.additionaldocuments}
                listUrl={`${URLS.additionaldocuments}/list`}
                title={'Дополнительные документы'}
                responseDataKey={'data.data'}
            />
        </>
    );
};

export default AdditionalDocumentsContainer;