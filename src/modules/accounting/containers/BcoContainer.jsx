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
            title: 'Accounting',
            path: '/accounting',
        },
        {
            id: 2,
            title: 'Bco list',
            path: '/accounting/bco',
        }
    ], [])
    let {data: branches} = useGetAllQuery({key: KEYS.branches, url: URLS.branches})
    let branchesList = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchname')

    let {data: policyList} = useGetAllQuery({
        key: KEYS.typeofbco,
        url: URLS.typeofbco
    })
    policyList = getSelectOptionsListFromData(get(policyList, `data.data`, []), '_id', 'policy_type_name')
    let {data: policyBlankList} = useGetAllQuery({
        key: KEYS.policyblank,
        url: URLS.policyblank
    })
    policyBlankList = getSelectOptionsListFromData(get(policyBlankList, `data.data`, []), '_id', 'blank_number')

    let {data: bcoStatusList} = useGetAllQuery({
        key: KEYS.statusbcopolicy,
        url: URLS.statusbcopolicy
    })
    bcoStatusList = getSelectOptionsListFromData(get(bcoStatusList, `data.data`, []), '_id', 'name')
    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Row>
            <Col xs={6}>
                <Field name={'policy_type_id'} type={'select'} options={policyList} label={'Bco type'}
                       defaultValue={rowId ? get(data, 'policy_type_id') : null}
                       params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'branch_id'} type={'select'} options={branchesList} label={'Branch'}
                       defaultValue={rowId ? get(data, 'branch_id') : null}
                       params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field type={'select'} label={'Работник'} name={'employee_id'}
                       options={getSelectOptionsListFromData(get(head(get(branches, 'data.data', [])), 'employees', []), '_id', 'fullname')}/>
            </Col>
            <Col xs={6}>
                <Field isMulti name={'policy_blank_number'} type={'select'} options={policyBlankList}
                       label={'Policy blanks'} defaultValue={rowId ? get(data, 'policy_blank_number') : null}
                       params={{required: true}}/>
            </Col>
            {/*<Col xs={6}>*/}

            {/*    <Field name={'statusofbcopolicy'} type={'select'} options={bcoStatusList} label={'Status'}*/}
            {/*           defaultValue={rowId ? get(data, 'statusofbcopolicy') : null}*/}
            {/*           params={{required: true}}/>*/}
            {/*</Col>*/}
        </Row>

    </>

    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'branch_id.branchname',
                        title: 'Branch'
                    },
                    {
                        id: 2,
                        key: 'employee_id.name',
                        title: 'Employee'
                    },
                    {
                        id: 3,
                        key: 'policy_blank_number',
                        title: 'Policy blank numbers',
                        isArray: true,
                        arrayKey: 'blank_number'
                    },

                ]}
                keyId={KEYS.bco}
                url={URLS.bco}
                title={'Bco list'}
                responseDataKey={'data'}

            />



        </>
    );
};

export default BcoContainer;