import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get, isEqual} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";

const BranchesContainer = ({...rest}) => {

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
            title: 'Branches',
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
                        key: 'branchname',
                        title: 'Branch name '
                    },
                    {
                        id: 2,
                        key: 'region.name',
                        title: 'Region'
                    },
                    {
                        id: 3,
                        key: 'address',
                        title: 'Address'
                    },
                    {
                        id: 4,
                        key: 'codeofbreanches',
                        title: 'Branch code'
                    },
                    {
                        id: 6,
                        key: 'email',
                        title: 'Email'
                    },
                    {
                        id: 7,
                        key: 'mfo',
                        title: 'MFO'
                    },
                    {
                        id: 8,
                        key: 'nameofbank',
                        title: 'nameofbank'
                    },
                ]}
                keyId={KEYS.branches}
                url={URLS.branches}
                title={'Branches'}
                responseDataKey={'data'}
                viewUrl={'/branches/view'}
                createUrl={'/branches/create'}
                updateUrl={'/branches/update'}
                isHideColumn
                hidePagination

            />
        </>
    );
};

export default BranchesContainer;