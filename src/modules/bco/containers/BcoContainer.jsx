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
    let {data: policyBlankList} = useGetAllQuery({
        key: KEYS.policyblank,
        url: `${URLS.policyblank}/list`
    })
    policyBlankList = getSelectOptionsListFromData(get(policyBlankList, `data.data`, []), '_id', 'blank_number')

    let {data: actList} = useGetAllQuery({
        key: KEYS.act,
        url: `${URLS.act}/list`
    })
    actList = getSelectOptionsListFromData(get(actList, `data.data`, []), '_id', 'name')
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
                <Field name={'policy_blank_number_from'} property={{type: 'number'}}
                       label={'Policy number from'} defaultValue={rowId ? get(data, 'policy_blank_number_from') : null}
                       params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'policy_blank_number_to'} type={'input'} property={{type: 'number'}}
                       label={'Policy number to'} defaultValue={rowId ? get(data, 'policy_blank_number_to') : null}
                       params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field isMulti name={'blank_number'} type={'select'} options={policyBlankList}
                       label={'Policy blank'} defaultValue={rowId ? get(data, 'blank_number') : null}
                       params={{required: true}}/>
            </Col>
            <Col xs={6}>
                <Field name={'act_id'} type={'select'} options={actList}
                       label={'Act'} defaultValue={rowId ? get(data, 'act_id') : null}
                       params={{required: true}}/>
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
                listUrl={`${URLS.bco}/list`}
                title={'Bco list'}
                responseDataKey={'data.data'}
            />


        </>
    );
};

export default BcoContainer;