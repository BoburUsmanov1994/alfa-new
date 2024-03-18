import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get, isEqual} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";
import {Col, Row} from "react-grid-system";

const EmployeesContainer = ({...rest}) => {

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
            title: 'Employees',
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
                        key: 'name',
                        title: 'Name '
                    },
                    {
                        id: 2,
                        key: 'secondname',
                        title: 'Secondname'
                    },
                    {
                        id: 3,
                        key: 'middlename',
                        title: 'Middlename'
                    },
                    {
                        id: 4,
                        key: 'branch.branchname',
                        title: 'Branch'
                    },
                    {
                        id: 5,
                        key: 'position.name',
                        title: 'Position'
                    },
                    {
                        id: 6,
                        key: 'regions.name',
                        title: 'Region'
                    },
                    {
                        id: 7,
                        key: 'districts.name',
                        title: 'District'
                    },
                ]}
                keyId={KEYS.employee}
                url={URLS.employee}
                title={'Employees'}
                responseDataKey={'data'}
                viewUrl={'/branches/employee/view'}
                createUrl={'/branches/employee/create'}
                updateUrl={'/branches/employee/update'}
                isHideColumn

            />
        </>
    );
};

export default EmployeesContainer;