import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import { useTranslation } from 'react-i18next';

const AgentStatusContainer = ({...rest}) => {

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))

    const {t} = useTranslation()
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Агенты"),
            path: '/agents',
        },
        {
            id: 2,
            title: t("Agent status"),
            path: '/agents/status',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={'Status'} defaultValue={rowId ? get(data, 'name') : null}
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
                        title: 'Status'
                    },
                ]}
                keyId={KEYS.accountstatus}
                url={URLS.accountstatus}
                listUrl={`${URLS.accountstatus}/list`}
                title={t("Agent status")}
                responseDataKey={'data.data'}

            />
        </>
    );
};

export default AgentStatusContainer;