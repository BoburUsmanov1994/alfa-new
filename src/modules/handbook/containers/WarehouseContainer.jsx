import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get, includes, isEmpty, isEqual} from "lodash";
import {useDeleteQuery, useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {OverlayLoader} from "../../../components/loader";
import {Col, Row} from "react-grid-system";
import EmptyPage from "../../auth/pages/EmptyPage";
import Table from "../../../components/table";
import Checkbox from "rc-checkbox";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";
import Title from "../../../components/ui/title";
import Section from "../../../components/section";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import {Trash2} from "react-feather";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import GridView from "../../../containers/grid-view";
import Field from "../../../containers/form/field";
import {getSelectOptionsListFromData} from "../../../utils";

const WarehouseContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {t} = useTranslation()
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Справочники',
            path: '/handbook',
        },
        {
            id: 2,
            title: 'Warehouse',
            path: '/handbook/warehouse',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])
    let {data: bcoTypeList} = useGetAllQuery({
        key: KEYS.typeofbco,
        url: `${URLS.bcoType}/list`
    })
    bcoTypeList = getSelectOptionsListFromData(get(bcoTypeList, `data.data`, []), '_id', 'policy_type_name')

    let {data: bcoStatusList} = useGetAllQuery({
        key: KEYS.statusoftypebco,
        url: `${URLS.bcoStatus}/list`
    })
    bcoStatusList = getSelectOptionsListFromData(get(bcoStatusList, `data.data`, []), '_id', 'name')

    let {data: branchList} = useGetAllQuery({key: KEYS.branches, url: `${URLS.branches}/list`})
    branchList = getSelectOptionsListFromData(get(branchList, `data.data`, []), '_id', 'branchName')
    const ModalBody = ({data, rowId = null}) => <Row>
        <Col xs={6}>
            <Field name={'bco_type'} options={bcoTypeList} type={'select'} label={'Bco type'}
                   defaultValue={rowId ? get(data, 'bco_type') : null}
                   params={{required: true}}/>
        </Col>
        <Col xs={6}>
            <Field name={'policy_number_of_digits_start'} type={'input'} label={'Policy number digit start'}
                   defaultValue={rowId ? get(data, 'policy_number_of_digits_start') : null}
                   params={{required: true, valueAsNumber: true}}/>
        </Col>
        <Col xs={6}>
            <Field name={'policy_number_of_digits_end'} type={'input'} label={'Policy number digit end'}
                   defaultValue={rowId ? get(data, 'policy_number_of_digits_end') : null}
                   params={{required: true, valueAsNumber: true}}/>
        </Col>
        <Col xs={6}>
            <Field name={'policy_count'} type={'input'} label={'Policy count'}
                   defaultValue={rowId ? get(data, 'policy_count') : null}
                   params={{required: true, valueAsNumber: true}}/>
        </Col>
        <Col xs={6}>
            <Field name={'branch'} options={branchList} type={'select'} label={'Branch'}
                   defaultValue={rowId ? get(data, 'branch') : null}
            />
        </Col>
        <Col xs={6}>
            <Field name={'status'} options={bcoStatusList} type={'select'} label={'Policy status'}
                   defaultValue={rowId ? get(data, 'status') : null}
                   params={{required: true}}/>
        </Col>
    </Row>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'bco_type.policy_type_name',
                        title: 'Bco'
                    },
                    {
                        id: 3,
                        key: 'status.name',
                        title: 'Status'
                    },
                    {
                        id: 4,
                        key: 'policy_number_of_digits_start',
                        title: 'Start digit'
                    },
                    {
                        id: 5,
                        key: 'policy_number_of_digits_end',
                        title: 'End digit'
                    },
                    {
                        id: 5,
                        key: 'policy_count',
                        title: 'Count'
                    },
                ]}
                keyId={KEYS.warehouse}
                url={URLS.warehouse}
                listUrl={`${URLS.warehouse}/list`}
                title={'Warehouse'}
                responseDataKey={'data.data'}

            />
        </>
    );
};

export default WarehouseContainer;