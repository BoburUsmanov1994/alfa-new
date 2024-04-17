import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {sum, get, includes, isEmpty, isEqual} from "lodash";
import {useDeleteQuery, useGetAllQuery, usePostQuery, usePutQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import {Col, Row} from "react-grid-system";
import EmptyPage from "../../auth/pages/EmptyPage";
import Table from "../../../components/table";
import Checkbox from "rc-checkbox";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";
import Title from "../../../components/ui/title";
import Section from "../../../components/section";
import {useNavigate} from "react-router-dom";
import {Check, Edit2, Trash2, X} from "react-feather";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import Button from "../../../components/ui/button";
import Modal from "../../../components/modal";
import Form from "../../../containers/form/form";
import Field from "../../../containers/form/field";
import {getSelectOptionsListFromData} from "../../../utils";

const BCOContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {t} = useTranslation()
    const [idList, setIdList] = useState([])
    const [acceptModal, setAcceptModal] = useState(false)
    const [id, setId] = useState(null)
    const navigate = useNavigate();
    const user = useStore(state => get(state, 'user'))
    let {data: acts, isLoading: actsIsLoading} = useGetAllQuery({
        key: KEYS.acts, url: `${URLS.acts}/list`, params: {
            params: {
                branch: get(user, 'branch._id'),
                limit: 100
            }
        }
    })
    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.acts})
    const {mutate: postRequest, isLoading: postLoading} = usePostQuery({listKeyId: KEYS.acts})
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Справочники',
            path: '/handbook',
        },
        {
            id: 2,
            title: 'Acts',
            path: '/handbook/act',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const removeItem = (id) => {
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
            cancelButtonText: t('Cancel'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest({url: `${URLS.acts}/${id}`})
            }
        });
    }


    const acceptOrDeny = (_id, _accept = true) => {
        Swal.fire({
            position: 'center',
            icon: _accept ? 'success' : 'error',
            backdrop: 'rgba(0,0,0,0.9)',
            background: 'none',
            title: t('Are you sure?'),
            showConfirmButton: true,
            // showCancelButton: true,
            confirmButtonColor: _accept ? '#13D6D1' : '#d33',
            // cancelButtonColor: '#13D6D1',
            confirmButtonText: _accept ? t('Accept') : t('Deny'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                postRequest({url: `${URLS.acceptOrDenyAct}/${_id}?accept=${_accept}`})
            }
        });
    }

    if (actsIsLoading) {
        return <OverlayLoader/>
    }
    return (
        <>
            <Section>
                <Row className={'mb-20'} align={'center'}>
                    <Col xs={12}>
                        <Title>{t("ACTS")}</Title>
                    </Col>
                </Row>
                <Row className={'mb-25'}>
                    <Col xs={12} className={'horizontal-scroll'}>
                        {isEmpty(get(acts, 'data.data', [])) ? <EmptyPage/> :
                            <Table bordered hideThead={false} thead={[<Checkbox onChange={(e) => {
                                if (e.target?.checked) {
                                    setIdList(get(acts, 'data.data', []).map(({_id}) => _id))
                                } else {
                                    setIdList([])
                                }
                            }}/>, '№', 'Номер акта', 'Дата акта', 'Отправитель(Филиал)', 'Отправитель(Работник)', 'Получатель(Филиал)', 'Получатель(Работник)', 'Общее количество полисов', 'Status', 'Is Accepted?', 'Actions']}>{get(acts, 'data.data', []).map((item, i) =>
                                <tr key={get(item, '_id')}>
                                    <td><Checkbox checked={includes(idList, get(item, '_id'))} onChange={(e) => {
                                        if (e.target?.checked) {
                                            setIdList(prev => ([...prev, get(item, '_id')]))
                                        } else {
                                            setIdList(idList.filter(id => !isEqual(id, get(item, '_id'))))
                                        }
                                    }}/></td>
                                    <td>{i + 1}</td>
                                    <td>{get(item, 'act_number')}</td>
                                    <td>{dayjs(get(item, 'act_date')).format('DD/MM/YYYY')}</td>
                                    <td>{get(item, 'sender_branch_id.branchName')}</td>
                                    <td>{get(item, 'sender_employee_id.fullname')}</td>
                                    <td>{get(item, 'receiver_branch_id.branchName')}</td>
                                    <td>{get(item, 'receiver_employee_id.fullname')}</td>
                                    <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                      value={sum(get(item, 'bco_data', []).map(({blank_counts}) => blank_counts))}/>
                                    </td>
                                    <td>{get(item, 'statusofact.name')}</td>
                                    <td>{get(item, 'isAccept') ? 'Yes' : 'No'}</td>
                                    <td>
                                        {isEqual(get(user, 'employee._id'), get(item, 'receiver_employee_id._id')) && !get(item, 'isAccept') && <>
                                            <Check
                                                onClick={() => {
                                                    acceptOrDeny(get(item, '_id'), true)
                                                }} size={20}
                                                className={'cursor-pointer mr-10'} color={'green'}/>
                                            <X onClick={() => {
                                                acceptOrDeny(get(item, '_id'), false)
                                            }
                                            } size={20}
                                               className={'cursor-pointer mr-10'} color={'red'}/></>}
                                        {(isEqual(get(user, 'employee._id'), get(item, 'sender_employee_id._id')) || isEqual(get(user, 'employee._id'), get(item, 'creator'))) && !get(item, 'isAccept') && <>
                                            {/*<Edit2*/}
                                            {/*    onClick={() => navigate('/accounting/act/create')} size={18}*/}
                                            {/*    className={'cursor-pointer mr-10'} color={'blue'}/>*/}
                                            <Trash2
                                                onClick={() => removeItem(get(item, '_id'))} size={18}
                                                className={'cursor-pointer'}
                                                color={'red'}/></>}</td>
                                </tr>)}</Table>}
                    </Col>
                    <Col xs={12} className={'mt-15'}>
                        <Button type={'button'}
                                onClick={() => navigate('/accounting/act/create')}> Добавить
                            акт</Button>
                    </Col>
                </Row>
            </Section>
        </>
    );
};

export default BCOContainer;