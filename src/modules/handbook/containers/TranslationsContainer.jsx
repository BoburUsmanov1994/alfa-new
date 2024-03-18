import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";

const TranslationsContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {t} = useTranslation();
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'Справочники', path: '/handbook',
    }, {
        id: 2, title: 'Translations', path: '/handbook/translations',
    }], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'key'} type={'input'} label={'Key'} defaultValue={rowId ? get(data, 'key') : null}
               params={{required: true}} property={{disabled: true}}/>
        <Field name={'uz'} type={'input'} label={'Uz'} defaultValue={rowId ? get(data, 'uz') : null}
               params={{required: true}}/>
        <Field name={'ru'} type={'input'} label={'Ru'} defaultValue={rowId ? get(data, 'ru') : null}
               params={{required: true}}/>
        <Field name={'eng'} type={'input'} label={'En'} defaultValue={rowId ? get(data, 'eng') : null}
               params={{required: true}}/>
    </>
    return (<>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[{
                    id: 1, key: 'key', title: 'Key'
                }, {
                    id: 2, key: 'uz', title: 'Uz'
                }, {
                    id: 3, key: 'ru', title: 'Ru'
                }, {
                    id: 4, key: 'eng', title: 'En'
                },]}
                keyId={KEYS.translations}
                url={URLS.translations}
                title={t('Translations')}
                responseDataKey={'data'}
            />
        </>);
};

export default TranslationsContainer;