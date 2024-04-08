import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {find, get, head, isEmpty, isNil} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";
import {Row, Col} from "react-grid-system";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";

const BcoContainer = ({...rest}) => {
    const navigate = useNavigate();
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'БСО',
            path: '/bco',
        },
        {
            id: 2,
            title: 'Bco list',
            path: '/bco',
        }
    ], [])

    let {data: policyList} = useGetAllQuery({
        key: KEYS.typeofbco,
        url: `${URLS.bcoType}/list`
    })
    policyList = getSelectOptionsListFromData(get(policyList, `data.data`, []), '_id', 'policy_type_name')

    let {data: branchList} = useGetAllQuery({
        key: KEYS.branches,
        url: `${URLS.branches}/list`,
    })
    branchList = getSelectOptionsListFromData(get(branchList, `data.data`, []), '_id', 'branchName')

    let {data: policyBlankList} = useGetAllQuery({
        key: KEYS.policyblank,
        url: `${URLS.policyblank}/list`
    })

    policyBlankList = getSelectOptionsListFromData(get(policyBlankList, `data.data`, []), '_id', 'blank_number')

    let {data: employeeList} = useGetAllQuery({key: KEYS.employee, url: `${URLS.employee}/list`})
    employeeList = getSelectOptionsListFromData(get(employeeList, `data.data`, []), '_id', 'fullname')

    let {data: actList} = useGetAllQuery({
        key: KEYS.act,
        url: `${URLS.act}/list`
    })
    actList = getSelectOptionsListFromData(get(actList, `data.data`, []), '_id', 'act_number')
    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Row>
            <Col xs={6}>
                <Field name={'bcoType'} type={'select'} options={policyList} label={'Bco type'}
                       defaultValue={rowId ? get(data, 'bcoType') : null}
                       params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'branch'} type={'select'} options={branchList} label={'Branch'}
                       defaultValue={rowId ? get(data, 'branch') : null}
                       params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'employee'} type={'select'} options={employeeList} label={'Employee'}
                       defaultValue={rowId ? get(data, 'employee') : null}
                       params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field isMulti name={'blanks'} type={'select'} options={policyBlankList}
                       label={'Policy blank'} defaultValue={rowId ? get(data, 'blanks') : null}
                       params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'act'} type={'select'} options={actList}
                       label={'Act'} defaultValue={rowId ? get(data, 'act') : null}
                />
            </Col>
        </Row>

    </>

    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'branch.branchName',
                        title: 'Branch'
                    },
                    {
                        id: 2,
                        key: 'employee.fullname',
                        title: 'Employee'
                    },
                    {
                        id: 3,
                        key: 'blanks',
                        title: 'Policy blank numbers',
                        isArray: true,
                        arrayKey: 'blank_number'
                    },
                    {
                        id: 3,
                        key: 'bcoType.policy_type_name',
                        title: 'Bco type',
                    },

                ]}
                keyId={KEYS.bco}
                url={URLS.bco}
                listUrl={`${URLS.bco}/list`}
                title={'Bco list'}
                responseDataKey={'data.data'}
            />


        </>
    );
};

export default BcoContainer;