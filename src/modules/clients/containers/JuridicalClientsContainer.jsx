import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";
import {PERSON_TYPE} from "../../../constants";

const JuridicalClientsContainer = ({...rest}) => {
    const {t} = useTranslation()
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Клиенты',
            path: '/clients',
        },
        {
            id: 2,
            title: 'Тип человека',
            path: '/clients/person-type',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={'Название'} defaultValue={rowId ? get(data, 'name') : null}
               params={{required: true}}/>
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'organization.name',
                        title: 'Name'
                    },
                    {
                        id: 2,
                        key: 'organization.inn',
                        title: 'Inn'
                    },
                    {
                        id: 3,
                        key: 'organization.phone',
                        title: 'Phone'
                    },
                    {
                        id: 4,
                        key: 'organization.address',
                        title: 'Address'
                    },

                ]}
                keyId={'juridical'}
                url={URLS.clients}
                listUrl={`${URLS.clients}/list`}
                title={t('Clients')}
                responseDataKey={'data.data'}
                params={{type: PERSON_TYPE.organization}}
                // viewUrl={'/clients/view'}
                createUrl={'/clients/juridical/create'}
                updateUrl={'/clients/juridical/update'}
                hasUpdateBtn

            />
        </>
    );
};

export default JuridicalClientsContainer;