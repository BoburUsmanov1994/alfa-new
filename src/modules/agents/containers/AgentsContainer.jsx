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
                    {
                        id: 3,
                        key: 'typeofagent',
                        title: 'Agent type'
                    },
                    {
                        id: 4,
                        key: 'organization.nameoforganization',
                        title: 'organization name'
                    },
                    {
                        id: 5,
                        key: 'person.secondname',
                        title: 'Lastname'
                    },
                    {
                        id: 55,
                        key: 'person.name',
                        title: 'Firstname'
                    },
                    {
                        id: 555,
                        key: 'person.middlename',
                        title: 'Middlename'
                    },
                ]}
                keyId={KEYS.agents}
                url={URLS.agents}
                listUrl={`${URLS.agents}/list`}
                title={'Страховые агенты'}
                responseDataKey={'data.data'}
                // viewUrl={'/agents/view'}
                createUrl={'/agents/create'}
                // updateUrl={'/agents/update'}
                isHideColumn

            />
        </>
    );
};

export default AgentsContainer;