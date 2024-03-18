import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {filter, find, get, head, includes, isEmpty, isEqual, isNil, last} from "lodash";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import {Col, Row} from "react-grid-system";
import EmptyPage from "../../auth/pages/EmptyPage";
import Table from "../../../components/table";
import Checkbox from "rc-checkbox";
import NumberFormat from "react-number-format";
import Title from "../../../components/ui/title";
import Section from "../../../components/section";
import Button from "../../../components/ui/button";
import Form from "../../../containers/form/form";
import Field from "../../../containers/form/field";
import {getSelectOptionsListFromData} from "../../../utils";
import {useNavigate} from "react-router-dom";
import Flex from "../../../components/flex";
import Modal from "../../../components/modal";
import {toast} from "react-toastify";
import {Trash2} from "react-feather";

const AddActContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [formParams, setFormParams] = useState({})
    const [open, setOpen] = useState(false)
    const [bcoListData, setBcoListData] = useState([])
    const navigate = useNavigate()
    let {data: bcoStatusList, isLoading: bcoStatusListIsLoading} = useGetAllQuery({
        key: KEYS.actstatus,
        url: URLS.actstatus
    })
    bcoStatusList = getSelectOptionsListFromData(get(bcoStatusList, `data.data`, []), '_id', 'name')

    let {data: branches, isLoading: isLoadingBranches} = useGetAllQuery({key: KEYS.branches, url: URLS.branches})
    let branchesList = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchname')

    let {data: bcoList, isLoading: isLoadingBcoList} = useGetAllQuery({key: KEYS.typeofbco, url: URLS.typeofbco})
    let bcoListSelect = getSelectOptionsListFromData(get(bcoList, `data.data`, []), '_id', 'policy_type_name')

    const {
        mutate: createRequest,
        isLoading: isLoadingPost
    } = usePostQuery({listKeyId: KEYS.transactionlog})
    const {
        mutate: checkBlankRequest,
        isLoading: isLoadingCheckBlank
    } = usePostQuery({listKeyId: KEYS.checkBlank})
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Справочники',
            path: '/handbook',
        },
        {
            id: 2,
            title: 'BCO',
            path: '/handbook/bco',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const getBranchEmpList = (branchList = [], branchId = null) => {
        if (isNil(branchId) || isEmpty(branchList)) {
            return [];
        }
        return getSelectOptionsListFromData(get(find(branchList, ({_id}) => _id == branchId), 'employees', []), '_id', 'fullname')

    }

    const create = ({data}) => {
        createRequest({
            url: URLS.acts,
            attributes: {
                ...data,
                bco_data: bcoListData.map(({policy_type_id,...rest})=>({...rest,policy_type_id:get(policy_type_id,'_id')})),
            }
        }, {
            onSuccess: () => {
                navigate('/accounting/act')
            },
            onError: () => {

            }
        })
    }
    const checkBlank = ({data}) => {
        const {policy_blank_number_from,policy_blank_number_to,...rest} = data
        checkBlankRequest({
                url: URLS.checkBlank,
                attributes: {
                    policy_blank_number_to:parseInt(policy_blank_number_to),
                    policy_blank_number_from:parseInt(policy_blank_number_from),
                    ...rest,
                }
            },
            {
                onSuccess: ({data}) => {
                        setBcoListData(prev => [...prev, get(data, 'data', {})])
                        setOpen(false)
                }
            })
    }
    if (bcoStatusListIsLoading || isLoadingBranches || isLoadingBcoList) {
        return <OverlayLoader/>
    }
    return (
        <>
            {
                isLoadingPost && <ContentLoader/>
            }
            <Section>
                <Row className={'mb-25'} align={'center'}>
                    <Col xs={12}>
                        <Title>Добавление акта</Title>
                    </Col>
                </Row>
                <Row className={'mb-20'}>
                    <Col xs={6}>
                        <Form getValueFromField={(value, name) => setFormParams(prev => ({...prev, [name]: value}))}
                              formRequest={create}
                              footer={<Button type={'submit'} className={'mr-16'}> Добавить</Button>}>
                            <Row className={'mb-25'}>
                                <Col xs={6}><Field type={'input'} label={'Номер акта'} name={'act_number'}/></Col>
                                <Col xs={6}><Field type={'select'} label={'Статус'} name={'statusofact'}
                                                   options={bcoStatusList}/></Col>
                                <Col xs={6}><Field type={'datepicker'} label={'Дата акта'} name={'act_date'}/></Col>
                                <Col xs={6}><Field type={'datepicker'} label={'Дата статуса'}
                                                   name={'status_date'}/></Col>
                            </Row>
                            <Row className={'mb-25'} align={'center'}>
                                <Col xs={12}>
                                    <Title sm>Отправитель</Title>
                                </Col>
                            </Row>
                            <Row className={'mb-25'}>
                                <Col xs={6}><Field type={'select'} label={'Филиал'} name={'sender_branch_id'}
                                                   options={branchesList}/></Col>
                                <Col xs={6}><Field type={'select'} label={'Работник'} name={'sender_employee_id'}
                                                   options={getBranchEmpList(get(branches, 'data.data', []), get(formParams, 'sender_branch_id'))}/></Col>

                            </Row>
                            <Row className={'mb-25'} align={'center'}>
                                <Col xs={12}>
                                    <Title sm>Получатель</Title>
                                </Col>
                            </Row>
                            <Row className={'mb-25'}>
                                <Col xs={6}><Field type={'select'} label={'Филиал'} name={'receiver_branch_id'}
                                                   options={branchesList}/></Col>
                                <Col xs={6}><Field type={'select'} label={'Работник'} name={'receiver_employee_id'}
                                                   options={getBranchEmpList(get(branches, 'data.data', []), get(formParams, 'receiver_branch_id'))}/></Col>
                            </Row>
                            <Row className={'mb-25'} align={'center'}>
                                <Col xs={12}>
                                    <Flex justify={'space-between'}>
                                        <Title sm>Передаваемые полиса</Title>
                                        <Button type={'button'} onClick={() => setOpen(true)}>Add police blank</Button>
                                    </Flex>

                                </Col>
                            </Row>
                            <Row className={'mb-20'}>
                                <Col xs={12} className={'horizontal-scroll'}>
                                    {isEmpty(bcoListData) ? <EmptyPage/> :
                                        <Table bordered hideThead={false} thead={['№', 'Тип полиса', 'Начальный №', 'Конечный №','Blank numbers', 'Количество','Action']}>{bcoListData.map((item, i) =>
                                            <tr key={get(item, '_id')}>
                                                <td>{i + 1}</td>
                                                <td>{get(item, 'policy_type_id.policy_type_name','-')}</td>
                                                <td>{get(item,'policy_blank_number_from')}</td>
                                                <td>{get(item,'policy_blank_number_to')}</td>

                                                <td >
                                                    <div style={{maxHeight:'25vh',overflowY:'scroll'}}>
                                                        {get(item,'blanks',[]).map(_blank=><div>{_blank}</div>)}
                                                    </div>
                                                </td>
                                                <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                                  value={get(item, 'blank_counts') || 0}/>
                                                </td>
                                                <td>
                                                    <Trash2 onClick={()=>{
                                                        setBcoListData(filter(bcoListData,(_item)=>!isEqual(get(_item,'policy_type_id._id'),get(item,'policy_type_id._id'))))
                                                    }} className={'cursor-pointer'} color={'red'} />
                                                </td>

                                            </tr>)}</Table>}
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Modal title={'Add police'} visible={open} hide={() => setOpen(false)}>
                    <Form formRequest={(val) => checkBlank(val)} footer={<Button type={'submit'}>Send</Button>}>
                        <Row className={'mt-15'}>
                            <Col xs={6}>
                                <Field options={bcoListSelect} type={'select'} name={'policy_type_id'}/>
                            </Col>
                            <Col xs={6}>
                                <Field type={'input'} name={'policy_blank_number_from'}/>
                            </Col>
                            <Col xs={6}>
                                <Field type={'input'} name={'policy_blank_number_to'}/>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </Section>
        </>
    );
};

export default AddActContainer;