import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {find, get, includes, isEmpty, isEqual, isNil} from "lodash";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
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
import Button from "../../../components/ui/button";
import Form from "../../../containers/form/form";
import Field from "../../../containers/form/field";
import {getSelectOptionsListFromData} from "../../../utils";
import {useNavigate} from "react-router-dom";

const AddPoliceBlankContainer = ({...rest}) => {
    const [params,setParams] = useState({})
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const navigate = useNavigate()
    let {data: policy, isLoading: policyListLoading} = useGetAllQuery({
        key: KEYS.typeofbco,
        url: URLS.typeofbco
    })
    let policyList = getSelectOptionsListFromData(get(policy, `data.data`, []), '_id', 'policy_type_name')


    let {data: statusList, isLoading: isLoadingStatusList} = useGetAllQuery({key: KEYS.statusbcopolicy, url: URLS.statusbcopolicy})
    statusList = getSelectOptionsListFromData(get(statusList, `data.data`, []), '_id', 'name') || []

    const {
        mutate: createRequest,
        isLoading: isLoadingPost
    } = usePostQuery({listKeyId: KEYS.warehouse})
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Справочники',
            path: '/handbook',
        },
        {
            id: 2,
            title: 'Police blank',
            path: '/handbook/warehouse/create',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


    const create = ({data}) => {
        const {policy_number_of_digits_start,policy_number_of_digits_end,language,policy_size_id,policy_series,policy_number_of_digits,...rest} = data;
        createRequest({
            url: URLS.warehouse,
            attributes: {
                ...rest,
                policy_number_of_digits_start:parseInt(policy_number_of_digits_start),
                policy_number_of_digits_end:parseInt(policy_number_of_digits_end)
            }
        }, {
            onSuccess: () => {
                navigate('/accounting/warehouse')
            },
            onError: () => {

            }
        })
    }
    const getPolicType = () => {
        return find(get(policy, `data.data`, []),item=>isEqual(get(item,'_id'),get(params,'policy_type_id')))
    }
    if (policyListLoading || isLoadingStatusList) {
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
                        <Title>Добавление на склад</Title>
                    </Col>
                </Row>
                <Row className={'mb-20'}>
                    <Col xs={6}>
                        <Form
                            getValueFromField={(value, name) => {
                                if (includes(['policy_type_id'], name)) {
                                    setParams(prev => ({...prev, [name]: value}))
                                }
                            }}
                              formRequest={create}
                              footer={<Button type={'submit'} className={'mr-16'}> Добавить</Button>}>
                            <Row className={'mb-25'}>
                                <Col xs={6}><Field type={'select'} label={'Выбрать тип полиса'} name={'policy_type_id'} options={policyList}/></Col>
                                {get(params,'policy_type_id') && <>
                                    <Col xs={6}><Field defaultValue={get(getPolicType(),'policy_size_id.name')} type={'input'} label={'Policy format'} name={'policy_size_id'}
                                                   property={{disabled:true}}/></Col>
                                    <Col xs={6}><Field defaultValue={get(getPolicType(),'language',[]).map(({name})=>name)} type={'input'} label={'Language'} name={'language'}
                                                                                                       property={{disabled:true}}/></Col>
                                    <Col xs={6}><Field defaultValue={get(getPolicType(),'policy_series')} type={'input'} label={'Policy serie'} name={'policy_series'}
                                                       property={{disabled:true}}/></Col>
                                    <Col xs={6}><Field defaultValue={get(getPolicType(),'policy_number_of_digits')} type={'input'} label={'Policy number digit'} name={'policy_number_of_digits'}
                                                       property={{disabled:true}}/></Col>
                                </>}
                                <Col xs={6}><Field type={'select'} label={'Статус'} name={'statusofpolicy'}
                                                   options={statusList}/></Col>
                                <Col xs={6}><Field type={'input'} label={'Начальный номер'} name={'policy_number_of_digits_start'}
                                                 /></Col>
                                <Col xs={6}><Field type={'input'} label={'Конечный номер'} name={'policy_number_of_digits_end'}
                                /></Col>
                            </Row>

                        </Form>
                    </Col>
                </Row>

            </Section>
        </>
    );
};

export default AddPoliceBlankContainer;