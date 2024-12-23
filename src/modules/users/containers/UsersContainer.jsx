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
    branchList = getSelectOptionsListFromData(get(branchList, `data.data`, []), '_id', 'branchName')
    let {data: employeeList} = useGetAllQuery({key: KEYS.employee, url: `${URLS.employee}/list`})
    employeeList = getSelectOptionsListFromData(get(employeeList, `data.data`, []), '_id', 'fullname')
    let {data: agents} = useGetAllQuery({key: ['agents-list'], url: `${URLS.agents}/list`})
    agents = getSelectOptionsListFromData(get(agents, `data.data`, []), '_id', ['organization.nameoforganization', 'person.secondname', 'person.name'])
    let {data: roles} = useGetAllQuery({key: KEYS.role, url: `${URLS.role}/list`})
    roles = getSelectOptionsListFromData(get(roles, `data.data`, []), '_id', 'name')
    let {data: status} = useGetAllQuery({key: KEYS.userStatus, url: `${URLS.userStatus}/list`})
    status = getSelectOptionsListFromData(get(status, `data.data`, []), '_id', 'name')
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Users"),
            path: '/users',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Row>
            <Col xs={6}>
                <Field name={'name'} type={'input'} label={t("name")} defaultValue={rowId ? get(data, 'name') : null}
                       />
            </Col>
            <Col xs={6}>
                <Field name={'branch'} type={'select'} label={t("Branch")} options={branchList}
                       defaultValue={rowId ? get(data, 'branch') : null} />
            </Col>
            <Col xs={6}>
                <Field name={'employee'} type={'select'} label={t("Employee")} options={employeeList}
                       defaultValue={rowId ? get(data, 'employee') : null} />
            </Col>
            <Col xs={6}>
                <Field name={'agent'} type={'select'} label={t("Agent")} options={agents}
                       defaultValue={rowId ? get(data, 'agent') : null} />
            </Col>
            <Col xs={6}>
                <Field name={'username'} type={'input'} label={t("Username")}
                       defaultValue={rowId ? get(data, 'username') : null}
                       params={{required: true}}/>
            </Col>
            {!rowId && <Col xs={6}>
                <Field name={'password'} type={'input'} label={t("Password")}
                       defaultValue={rowId ? get(data, 'password') : null}
                       params={{required: true}} property={{type: 'password'}}/>
            </Col>}
            <Col xs={6}>
                <Field name={'role'} type={'select'} label={t("Role")} options={roles}
                       defaultValue={rowId ? get(data, 'role') : null} params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'status'} type={'select'} label={t("Status")} options={status}
                       defaultValue={rowId ? get(data, 'status') : null} params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'isCheckPayment'} type={'switch'} label={'Выдавать полис без оплаты'}
                       defaultValue={rowId ? get(data, 'isCheckPayment') : null} />
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
                        title: t("Name")
                    },
                    {
                        id: 3,
                        key: 'username',
                        title: t("Username"),
                    },
                    {
                        id: 4,
                        key: 'branch.branchName',
                        title: t("Branch"),
                    },
                    {
                        id: 4,
                        key: 'role.name',
                        title: t("Role"),
                    },
                    {
                        id: 5,
                        key: 'status.name',
                        title: t("Status"),
                    }
                ]}
                keyId={KEYS.user}
                url={URLS.user}
                listUrl={`${URLS.user}/list`}
                title={t('All users')}
                responseDataKey={'data.data'}
                isHideColumn
                hasUpdateBtn
            />
        </>
    );
};

export default UsersContainer;
