import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {filter, find, get, head, includes, isEmpty, isEqual, isNil, last, range} from "lodash";
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
        url: `${URLS.actstatus}/list`
    })
    bcoStatusList = getSelectOptionsListFromData(get(bcoStatusList, `data.data`, []), '_id', 'name')

    let {data: branches, isLoading: isLoadingBranches} = useGetAllQuery({
        key: KEYS.branches,
        url: `${URLS.branches}/list`
    })
    let branchesList = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')

    let {data: bcoList, isLoading: isLoadingBcoList} = useGetAllQuery({
        key: KEYS.typeofbco,
        url: `${URLS.bcoType}/list`
    })
    let bcoListSelect = getSelectOptionsListFromData(get(bcoList, `data.data`, []), '_id', 'policy_type_name')

    let {data: employeeList} = useGetAllQuery({key: KEYS.employee, url: `${URLS.employee}/list`})
    employeeList = getSelectOptionsListFromData(get(employeeList, `data.data`, []), '_id', 'fullname')

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
                bco_data: bcoListData.map(({...rest}) => ({
                    ...rest,
                })),
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
        setBcoListData(prev => [...prev, data])
        setOpen(false)
    }
    if (bcoStatusListIsLoading || isLoadingBranches || isLoadingBcoList) {
        return <OverlayLoader/>
    }
    console.log('bcoListData', bcoListData)
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
                    <Col xs={12}>
                        <Form getValueFromField={(value, name) => setFormParams(prev => ({...prev, [name]: value}))}
                              formRequest={create}
                              footer={<Button type={'submit'} className={'mr-16'}> Добавить</Button>}>
                            <Row className={'mb-25'}>
                                <Col xs={4}><Field type={'input'} label={'Номер акта'} name={'act_number'}
                                                   params={{required: true}}/></Col>
                                <Col xs={4}><Field type={'select'} label={'Статус'} name={'statusofact'}
                                                   options={bcoStatusList} params={{required: true}}/></Col>
                                <Col xs={4}><Field type={'datepicker'} label={'Дата акта'} name={'act_date'}
                                                   params={{required: true}}/></Col>
                                <Col xs={6}>
                                    <Row className={'mb-25'} align={'center'}>
                                        <Col xs={12}>
                                            <Title sm>Отправитель</Title>
                                        </Col>
                                    </Row>
                                    <Row className={'mb-25'}>
                                        <Col xs={6}><Field type={'select'} label={'Филиал'} name={'sender_branch_id'}
                                                           options={branchesList}/></Col>
                                        <Col xs={6}><Field type={'select'} label={'Работник'}
                                                           name={'sender_employee_id'}
                                                           options={employeeList}/></Col>

                                    </Row>
                                </Col>
                                <Col xs={6}>
                                    <Row className={'mb-25'} align={'center'}>
                                        <Col xs={12}>
                                            <Title sm>Получатель</Title>
                                        </Col>
                                    </Row>
                                    <Row className={'mb-25'}>
                                        <Col xs={6}><Field type={'select'} label={'Филиал'} name={'receiver_branch_id'}
                                                           options={branchesList}/></Col>
                                        <Col xs={6}><Field type={'select'} label={'Работник'}
                                                           name={'receiver_employee_id'}
                                                           options={employeeList}/></Col>
                                    </Row>
                                </Col>
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
                                        <Table bordered hideThead={false}
                                               thead={['№', 'Тип полиса', 'Начальный №', 'Конечный №', 'Action']}>{bcoListData.map((item, i) =>
                                            <tr key={get(item, '_id')}>
                                                <td>{i + 1}</td>
                                                <td>{get(item, 'bco_type', '-')}</td>
                                                <td>{get(item, 'policy_blank_number_from')}</td>
                                                <td>{get(item, 'policy_blank_number_to')}</td>
                                                <td>
                                                    <Trash2 onClick={() => {
                                                        setBcoListData(filter(bcoListData, (_item) => !isEqual(get(_item, 'policy_type_id'), get(item, 'policy_type_id'))))
                                                    }} className={'cursor-pointer'} color={'red'}/>
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
                                <Field label={'Тип полиса'} options={bcoListSelect} type={'select'} name={'bco_type'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={6}>
                                <Field label={'Начальный №'} type={'input'} name={'policy_blank_number_from'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={6}>
                                <Field label={'Конечный №'} type={'input'} name={'policy_blank_number_to'}
                                       params={{required: true}}/>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </Section>
        </>
    );
};

export default AddActContainer;