import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get, includes} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";
import {PERSON_TYPE} from "../../../constants";
import config from "../../../config";

const ClientsContainer = () => {
    const {t} = useTranslation()
    const user = useStore(state => get(state, 'user'))
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
                        key: 'person.fullName.firstname',
                        title: 'Firstname'
                    },
                    {
                        id: 2,
                        key: 'person.fullName.lastname',
                        title: 'Lastname'
                    },
                    {
                        id: 3,
                        key: 'person.fullName.middlename',
                        title: 'Middlename'
                    },
                    {
                        id: 4,
                        key: 'person.passportData.pinfl',
                        title: 'Pinfl'
                    },
                    {
                        id: 5,
                        key: 'person.passportData.seria',
                        title: 'Passport seria'
                    },
                    {
                        id: 6,
                        key: 'person.passportData.number',
                        title: 'Passport number'
                    },
                    {
                        id: 7,
                        key: 'person.phone',
                        title: 'Phone number'
                    },

                ]}
                keyId={KEYS.clients}
                url={URLS.clients}
                listUrl={`${URLS.clients}/list`}
                title={t('Clients')}
                responseDataKey={'data.data'}
                params={{type:PERSON_TYPE.person,branch: !includes([config.ROLES.admin],get(user,'role.name')) ? get(user, 'branch._id') : undefined}}
                createUrl={'/clients/physical/create'}
                updateUrl={'/clients/physical/update'}
                hasUpdateBtn
                hideDeleteBtn
            />
        </>
    );
};

export default ClientsContainer;