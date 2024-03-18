import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";

const UsersContainer = ({...rest}) => {
    const {t} = useTranslation()
    let {data:roles} = useGetAllQuery({key:KEYS.accountroles,url:URLS.accountroles})
     roles = getSelectOptionsListFromData(get(roles,`data.data`,[]),'_id','name')
    let {data:status} = useGetAllQuery({key:KEYS.accountstatus,url:URLS.accountstatus})
    status = getSelectOptionsListFromData(get(status,`data.data`,[]),'_id','name')
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Users',
            path: '/users',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'email'} type={'input'} label={'Email'} defaultValue={rowId ? get(data, 'email') : null}
               params={{required: true}}/>
        <Field name={'password'} type={'input'} label={'Password'} defaultValue={rowId ? get(data, 'password') : null}
               params={{required: true}}  property={{type: 'password'}}/>
        <Field  name={'accountrole'} type={'select'} label={'Role'} options={roles} defaultValue={rowId ? get(data,'accountrole._id'):null} params={{required: true}} />
        <Field  name={'accountstatus'} type={'select'} label={'Status'} options={status} defaultValue={rowId ? get(data,'accountstatus._id'):null} params={{required: true}} />
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'email',
                        title: 'Email'
                    },
                    {
                        id: 3,
                        key: 'accountrole.name',
                        title: 'Role',
                    },
                    {
                        id: 4,
                        key: 'accountstatus.name',
                        title: 'Status',
                    },
                ]}
                keyId={KEYS.user}
                url={URLS.user}
                title={t('All users')}
                responseDataKey={'data'}
                isHideColumn

            />
        </>
    );
};

export default UsersContainer;