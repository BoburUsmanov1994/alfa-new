import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import { useTranslation } from 'react-i18next';

const UserStatusContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {t} = useTranslation()
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Справочники"),
            path: '/handbook',
        },
        {
            id: 2,
            title: t("User status"),
            path: '/accounts/status',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={t("Название")} defaultValue={rowId ? get(data, 'name') : null}
               params={{required: true}}/>
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: t("Название")
                    },
                ]}
                keyId={KEYS.userStatus}
                url={URLS.userStatus}
                listUrl={`${URLS.userStatus}/list`}
                title={t("User status")}
                responseDataKey={'data.data'}
            />
        </>
    );
};

export default UserStatusContainer;