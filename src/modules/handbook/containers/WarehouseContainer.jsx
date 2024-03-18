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

const WarehouseContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {t} = useTranslation()
    const navigate = useNavigate();
    let {data: acts, isLoading: actsIsLoading} = useGetAllQuery({key: KEYS.warehouse, url: URLS.warehouse})

   const {mutate:deleteRequest,isLoading} = useDeleteQuery({listKeyId:KEYS.warehouse})
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

    if (actsIsLoading) {
        return <OverlayLoader/>
    }

    const remove = (id) => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            backdrop: 'rgba(0,0,0,0.9)',
            background: 'none',
            title: t('Are you sure?'),
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#13D6D1',
            confirmButtonText: t('Delete'),
            cancelButtonText:t('Cancel'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest({url: `${URLS.warehouse}/${id}`})
            }
        });
    }
    return (
        <>
            <Section>
                <Row className={'mb-20'} align={'center'}>
                    <Col xs={12}>
                        <Title>Журнал БСО</Title>
                    </Col>
                </Row>
                <Row className={'mb-25'}>
                    <Col xs={12} className={'horizontal-scroll'}>
                        {isEmpty(get(acts, 'data.data', [])) ? <EmptyPage/> :
                            <Table bordered hideThead={false}
                                   thead={['№', 'Тип полиса', 'Начальный №', 'Конечный №', 'Количество', 'Формат полиса', 'Серия полиса', 'Дата приёма на склад', 'Количество цифр на номере полиса','Action']}>{get(acts, 'data.data', []).map((item, i) =>
                                <tr key={get(item, '_id')}>
                                    <td>{i + 1}</td>
                                    <td>{get(item, 'policy_type_id.policy_type_name')}</td>
                                    <td>{get(item, 'policy_number_of_digits_start')}</td>
                                    <td>{get(item, 'policy_number_of_digits_end')}</td>
                                    <td>{get(item, 'policy_count')}</td>
                                    <td>{get(item, 'policy_type_id.policy_size_id.name')}</td>
                                    <td>{get(item, 'policy_type_id.policy_series')}</td>
                                    <td>{dayjs(get(item, 'createdAt')).format('DD-MM-YYYY')}</td>
                                    <td>{get(item, 'policy_type_id.policy_number_of_digits')}</td>
                                    <td><Trash2 onClick={()=>remove(get(item,'_id'))} className={'cursor-pointer'} color={'red'} /></td>
                                </tr>)}</Table>}
                    </Col>
                </Row>
                <Row className={'mb-20'}>
                    <Col xs={12}>
                        <Button onClick={() => navigate("/accounting/warehouse/create")} type={'button'}
                                className={'mr-16'}
                        > Add police blank</Button>
                    </Col>
                </Row>
            </Section>
        </>
    );
};

export default WarehouseContainer;