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
import {Col, Row} from "react-grid-system";

const UsersContainer = () => {
    const {t} = useTranslation()
    let {data: branchList} = useGetAllQuery({key: KEYS.branches, url: `${URLS.branches}/list`})
    branchList = getSelectOptionsListFromData(get(branchList, `data`, []), '_id', 'branchName')
    let {data: employeeList} = useGetAllQuery({key: KEYS.employee, url: `${URLS.employee}/list`})
    employeeList = getSelectOptionsListFromData(get(employeeList, `data`, []), '_id', 'fullname')
    let {data: agentList} = useGetAllQuery({key: KEYS.agents, url: `${URLS.agents}/list`})
    agentList = getSelectOptionsListFromData(get(agentList, `data`, []), '_id', 'name')
    let {data: roles} = useGetAllQuery({key: KEYS.role, url: `${URLS.role}/list`})
    roles = getSelectOptionsListFromData(get(roles, `data`, []), '_id', 'name')
    let {data: status} = useGetAllQuery({key: KEYS.userStatus, url: `${URLS.userStatus}/list`})
    status = getSelectOptionsListFromData(get(status, `data`, []), '_id', 'name')
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
        <Row>
            <Col xs={6}>
                <Field name={'name'} type={'input'} label={'Name'} defaultValue={rowId ? get(data, 'name') : null}
                       params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'branch'} type={'select'} label={'Branch'} options={branchList}
                       defaultValue={rowId ? get(data, 'branch._id') : null} params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'employee'} type={'select'} label={'Employee'} options={employeeList}
                       defaultValue={rowId ? get(data, 'employee._id') : null} params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'agent'} type={'select'} label={'Agent'} options={agentList}
                       defaultValue={rowId ? get(data, 'agent._id') : null} params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'username'} type={'input'} label={'Username'}
                       defaultValue={rowId ? get(data, 'username') : null}
                       params={{required: true}} />
            </Col>
            <Col xs={6}>
                <Field name={'password'} type={'input'} label={'Password'}
                       defaultValue={rowId ? get(data, 'password') : null}
                       params={{required: true}} property={{type: 'password'}}/>
            </Col>
            <Col xs={6}>
                <Field name={'role'} type={'select'} label={'Role'} options={roles}
                       defaultValue={rowId ? get(data, 'role._id') : null} params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'status'} type={'select'} label={'Status'} options={status}
                       defaultValue={rowId ? get(data, 'status._id') : null} params={{required: true}}/>
            </Col>
        </Row>
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: 'Name'
                    },
                    {
                        id: 3,
                        key: 'username',
                        title: 'Username',
                    }
                ]}
                keyId={KEYS.user}
                url={URLS.user}
                listUrl={`${URLS.user}/list`}
                title={t('All users')}
                responseDataKey={'data'}
                isHideColumn

            />
        </>
    );
};

export default UsersContainer;