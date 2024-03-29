import React from 'react';
import {Row, Col} from "react-grid-system";
import Search from "../../../components/search";
import Panel from "../../../components/panel";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Field from "../../../containers/form/field";
import {get} from "lodash";
import {usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Form from "../../../containers/form/form";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import {OverlayLoader} from "../../../components/loader";
import dayjs from "dayjs";

const EmployeeAddContainer = () => {
    const navigate = useNavigate();

    const {mutate: createRequest, isLoading} = usePostQuery({listKeyId: KEYS.employee})

    const create = ({data}) => {
        createRequest({
            url: URLS.employee,
            attributes: {...data, dateofmanagerdocument: dayjs(get(data, 'dateofmanagerdocument')),expirationdate:dayjs(get(data, 'expirationdate'))}
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
                            <Field name={'photo'} type={'input'}
                                   label={'Photo'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'fullname'} type={'input'}
                                   label={'Fullname'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'positions'} type={'input'} label={'Position'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'typeofdocumentsformanager'} type={'input'}
                                   label={'Document type'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'documentnumber'} type={'input-mask'}
                                   label={'Passport'}
                                   property={{mask: 'aa9999999', maskChar: '_'}}
                                   params={{required: true}}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'dateofmanagerdocument'} type={'datepicker'}
                                   label={'Document date'}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'expirationdate'} type={'datepicker'}
                                   label={'Expration date'}
                            />
                        </Col>


                        <Col xs={4}>
                            <Field name={'telephonenumber'} type={'input'}
                                   label={'Phone'}
                                   params={{required: true}}/>
                        </Col>

                        <Col xs={4}>
                            <Field name={'emailforcontacts'} type={'input'} label={'Email'}
                                   params={{
                                       required: true,
                                       pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                   }}/>
                        </Col>

                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default EmployeeAddContainer;