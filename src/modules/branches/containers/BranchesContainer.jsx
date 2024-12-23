import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get, isEqual} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import { useTranslation } from 'react-i18next';

const BranchesContainer = ({...rest}) => {

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
            title: t("Branches"),
            path: '/handbook/branches',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    return (
        <>
            <GridView
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'branchName',
                        title: t("Branch name")
                    },
                    {
                        id: 2,
                        key: 'fondId',
                        title: t("Fond id")
                    },
                ]}
                keyId={KEYS.branches}
                url={URLS.branches}
                listUrl={`${URLS.branches}/list`}
                title={t("Branches")}
                responseDataKey={'data.data'}
                // viewUrl={'/branches/view'}
                // createUrl={'/branches/create'}
                // updateUrl={'/branches/update'}
                isHideColumn
                // hidePagination
                hideCreateBtn
                hideDeleteBtn
            />
        </>
    );
};

export default BranchesContainer;