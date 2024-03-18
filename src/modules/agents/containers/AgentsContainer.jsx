import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get, isEqual} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";

const AgentsContainer = ({...rest}) => {

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Агенты',
            path: '/agents',
        },
        {
            id: 2,
            title: 'Страховые агенты',
            path: '/agents/insurance-agents',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null, personType = null}) => <>


    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'inn',
                        title: 'INN'
                    },
                    // {
                    //     id: 2,
                    //     key: 'region.name',
                    //     title: 'Region'
                    // },
                    {
                        id: 3,
                        key: 'typeofagent.name',
                        title: 'Agent type'
                    },
                    {
                        id: 4,
                        key: 'typeofpersons.name',
                        title: 'Person type'
                    },
                    {
                        id: 5,
                        key: 'forindividualsdata.secondname',
                        title: 'Lastname'
                    },
                    {
                        id: 55,
                        key: 'forindividualsdata.name',
                        title: 'Firstname'
                    },
                    {
                        id: 555,
                        key: 'forindividualsdata.middlename',
                        title: 'Middlename'
                    },
                    {
                        id: 6,
                        key: 'email',
                        title: 'Email'
                    },
                    {
                        id: 7,
                        key: 'accountrole.name',
                        title: 'Role'
                    },
                    {
                        id: 8,
                        key: 'accountstatus.name',
                        title: 'Status'
                    },
                ]}
                keyId={KEYS.agents}
                url={URLS.agents}
                title={'Страховые агенты'}
                responseDataKey={'data'}
                viewUrl={'/agents/view'}
                createUrl={'/agents/create'}
                updateUrl={'/agents/update'}
                isHideColumn

            />
        </>
    );
};

export default AgentsContainer;