import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";

const BcoBlankContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Accounting',
            path: '/accounting',
        },
        {
            id: 2,
            title: 'Bco blanks',
            path: '/accounting/bco-blanks',
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
                        key: 'blank_number',
                        title: 'Blank number'
                    },
                    {
                        id: 2,
                        key: 'policy_type_id.policy_number_of_digits',
                        title: 'Policy number'
                    },
                    {
                        id: 3,
                        key: 'status_blank.name',
                        title: 'Status'
                    },
                    {
                        id: 4,
                        key: 'warehous_id.branch_id.branchname',
                        title: 'Warehouse'
                    },
                ]}
                keyId={KEYS.policyblank}
                url={URLS.policyblank}
                title={'Blanks'}
                responseDataKey={'data'}

            />
        </>
    );
};

export default BcoBlankContainer;