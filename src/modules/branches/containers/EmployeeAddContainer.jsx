import React from 'react';
import {Row, Col} from "react-grid-system";
import Search from "../../../components/search";
import Panel from "../../../components/panel";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Field from "../../../containers/form/field";
import {get} from "lodash";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Form from "../../../containers/form/form";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import {OverlayLoader} from "../../../components/loader";
import dayjs from "dayjs";
import {getSelectOptionsListFromData} from "../../../utils";

const EmployeeAddContainer = () => {
    const navigate = useNavigate();
    let {data: positionList} = useGetAllQuery({key: KEYS.position, url: `${URLS.position}/list`})
    positionList = getSelectOptionsListFromData(get(positionList, `data.data`, []), '_id', 'name')
    let {data: documentTypeList} = useGetAllQuery({key: KEYS.documentType, url: `${URLS.documentType}/list`})
    documentTypeList = getSelectOptionsListFromData(get(documentTypeList, `data.data`, []), '_id', 'name')
    const {mutate: createRequest, isLoading} = usePostQuery({listKeyId: KEYS.employee})
    let {data: branchList} = useGetAllQuery({
        key: KEYS.branches,
        url: `${URLS.branches}/list`,
    })
    branchList = getSelectOptionsListFromData(get(branchList, `data.data`, []), '_id', 'branchName')
    const {data: genders} = useGetAllQuery({
        key: KEYS.genders, url: `${URLS.genders}/list`
    })
    const genderList = getSelectOptionsListFromData(get(genders, `data.data`, []), '_id', 'name')
    const create = ({data}) => {
        createRequest({
            url: URLS.employee,
            attributes: {
                ...data,
                dateofmanagerdocument: dayjs(get(data, 'dateofmanagerdocument')),
                expirationdate: dayjs(get(data, 'expirationdate'))
            }
        }, {
            onSuccess: () => {
                navigate('/branches/employees')
            },
            onError: () => {
            }
        })
    }


    return (
        <>
            {isLoading && <OverlayLoader/>}
            <Panel>
                <Row>
                    <Col xs={12}>
                        <Search/>
                    </Col>
                </Row>
            </Panel>
            <Section>
                <Row className={'mb-25'}>
                    <Col xs={12}>
                        <Title>Add employee</Title>
                    </Col>
                </Row>
                <Form getValueFromField={(val, name) => console.log(val, name)}
                      footer={<Button type={"submit"} lg>Add</Button>} formRequest={(values) => create(values)}>
                    <Row className={'mb-15'}>
                        <Col xs={4}>
                            <Field name={'fullname'} type={'input'}
                                   label={'Fullname'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'position'} type={'select'} label={'Position'} options={positionList}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'typeofdocumentsformanager'} type={'select'} options={documentTypeList}
                                   label={'Document type'}
                                   params={{required: true}}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'documentnumber'} type={'input'}
                                   params={{required: true}}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'dateofmanagerdocument'} type={'datepicker'}
                                   label={'Document date'}
                                   params={{required: true}}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'expirationdate'} type={'datepicker'}
                                   label={'Expration date'}
                                   params={{required: true}}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'telephonenumber'} type={'input'}
                                   label={'Phone'}
                                   params={{required: true}}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'emailforcontacts'} type={'input'} label={'Email'}
                                   params={{
                                       required: true,
                                       pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                   }}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'branch'} type={'select'} label={'Branch'} options={branchList}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'branch'} type={'select'} label={'Gender'} options={genderList}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field params={{required: true}} name={'passportSeries'} type={'input-mask'}
                                   label={'Passport seria'}
                                   property={{mask: 'aa', maskChar: '_'}}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field params={{required: true}} name={'passportNumber'} type={'input-mask'}
                                   label={'Passport number'}
                                   property={{mask: '9999999', maskChar: '_'}}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field params={{required: true}} name={'pin'} type={'input-mask'}
                                   label={'PIN'}
                                   property={{mask: '99999999999999', maskChar: '_'}}
                            />
                        </Col>
                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default EmployeeAddContainer;