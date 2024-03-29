import React, {useState} from 'react';
import {Row, Col} from "react-grid-system";
import Search from "../../../components/search";
import Panel from "../../../components/panel";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Field from "../../../containers/form/field";
import {get, isEqual, range} from "lodash";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {getSelectOptionsListFromData} from "../../../utils";
import Form from "../../../containers/form/form";
import {OverlayLoader} from "../../../components/loader";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import {Minus, Plus} from "react-feather";
import dayjs from "dayjs";

const AgentsCreateContainer = ({...rest}) => {
    const navigate = useNavigate();

    const [personType, setPersonType] = useState(null)
    const [empCount, setEmpCount] = useState(0);
    const [region, setregion] = useState(null);
    const setPersonTypeForSelect = (val, name) => {
        if (isEqual(name, 'typeofpersons')) {
            setPersonType(val)
        }
        if (isEqual(name, 'corporateentitiesdata.region')) {
            setregion(val)
        }
        if (isEqual(name, 'forindividualsdata.regions')) {
            setregion(val)
        }
    }
    let {data: branches} = useGetAllQuery({key: KEYS.branches, url: `${URLS.branches}/list`})
    branches = getSelectOptionsListFromData(get(branches, `data`, []), '_id', 'branchName')

    let {data: regions} = useGetAllQuery({key: KEYS.regions, url: `${URLS.regions}/list`})
    regions = getSelectOptionsListFromData(get(regions, `data`, []), '_id', 'name')

    let {data: agentTypes} = useGetAllQuery({key: KEYS.typeofagent, url: `${URLS.typeofagent}/list`})
    agentTypes = getSelectOptionsListFromData(get(agentTypes, `data`, []), '_id', 'name')

    let {data: persons} = useGetAllQuery({key: KEYS.typeofpersons, url: `${URLS.personType}/list`})
    persons = getSelectOptionsListFromData(get(persons, `data`, []), '_id', 'name')


    let {data: genders} = useGetAllQuery({key: KEYS.genders, url: `${URLS.genders}/list`})
    genders = getSelectOptionsListFromData(get(genders, `data`, []), '_id', 'name')


    let {data: districts} = useGetAllQuery({
        key: KEYS.districtsByRegion,
        url: `${URLS.districts}/list`,
        params: {
            params: {
                region
            }
        },
        enabled: !!(region)
    })
    districts = getSelectOptionsListFromData(get(districts, `data`, []), '_id', 'name')



    const {mutate: createRequest, isLoading} = usePostQuery({listKeyId: KEYS.agents})
    const create = ({data}) => {
        createRequest({
            url: URLS.agents,
            attributes: {...data, agreementdate: dayjs(get(data, 'agreementdate')), user_id: '123'}
        }, {
            onSuccess: () => {
                navigate('/agents/insurance-agents')
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
                        <Title>Agent create</Title>
                    </Col>
                </Row>
                <Form getValueFromField={(val, name) => setPersonTypeForSelect(val, name)}
                      footer={<Button>Save</Button>} formRequest={(values) => create(values)}>
                    <Row>
                        <Col xs={4}>
                            <Field name={'branch'} type={'select'} label={'Branch'} options={branches}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'inn'} type={'input-mask'} label={'INN'}
                                   property={{mask: '999999999', maskChar: '_'}}
                                   params={{required: true, pattern: /^[0-9]*$/}}/>
                        </Col>

                        <Col xs={4}>
                            <Field name={'agreementnumber'} type={'input'}
                                   label={'agreementnumber'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'agreementdate'} dateFormat={"MM/DD/YYYY"} type={'datepicker'}
                                   label={'agreementdate'}
                                   params={{required: true}}/>
                        </Col>

                        <Col xs={4}>
                            <Field params={{required: true}} name={'typeofagent'} type={'select'} label={'Agent type'}
                                   options={agentTypes}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                label={'isbeneficiary'}
                                type={'switch'}
                                name={'isbeneficiary'}
                                params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field
                                label={'isfixedpolicyholde'}
                                type={'switch'}
                                name={'isfixedpolicyholde'}
                                params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'typeofpersons'} type={'select'} label={'Person type'} options={persons}
                                   params={{required: true}}/>
                        </Col>
                        {isEqual(personType, '6606f75dadf406e7876a4573') && <>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.photo'} type={'input'} label={'Photo'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.name'} type={'input'} label={'name'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.secondname'} type={'input'} label={'secondname'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.middlename'} type={'input'} label={'middlename'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.gender'} type={'select'} label={'Gender'}
                                       options={genders}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.dateofbirth'} dateFormat={"MM/DD/YYYY"}
                                       type={'datepicker'}
                                       label={'dateofbirth'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.citizenship'} type={'input'} label={'Citizenship'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.typeofdocument'} type={'input'}
                                       label={'typeofdocument'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportSeries'} type={'input-mask'}
                                       label={'Passport seria'}
                                       property={{mask: 'aa', maskChar: '_'}}
                                       params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportNumber'} type={'input-mask'}
                                       label={'Passport number'}
                                       property={{mask: '9999999', maskChar: '_'}}
                                       params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>

                                <Field name={'forindividualsdata.pin'} type={'input-mask'} label={'PINFL'}
                                       property={{mask: '99999999999999', maskChar: '_'}}
                                       params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportissuancedate'} dateFormat={"MM/DD/YYYY"}
                                       type={'datepicker'}
                                       label={'passportissuancedate'}
                                       params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportissuedby'} type={'input'}
                                       label={'passportissuedby'}
                                       params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.regions'} type={'select'} label={'Region'}
                                       options={regions}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.districts'} type={'select'} label={'District'}
                                       options={districts}
                                       params={{required: true}}/>
                            </Col>

                            <Col xs={4}>
                                <Field name={'forindividualsdata.address'} type={'input'}
                                       label={'address'}
                                       params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.postcode'} type={'input'}
                                       label={'postcode'}
                                       params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.telephonenumber'} type={'input'}
                                       label={'telephonenumber'}
                                       params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.emailforcontact'} type={'input'}
                                       label={'emailforcontact'}
                                       params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.personalaccount'} type={'input'}
                                       label={'personalaccount'}
                                       params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.transitaccount'} type={'input'}
                                       label={'transitaccount'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.mfo'} type={'input'}
                                       label={'mfo'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.nameofbank'} type={'input'}
                                       label={'nameofbank'} params={{required: true}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.numberofcard'} type={'input'} label={'numberofcard'}
                                       params={{required: true}}
                                />
                            </Col>
                        </>
                        }
                        {isEqual(personType, '6606f764adf406e7876a457a') &&
                        <>

                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.nameoforganization'} type={'input'}
                                       label={'nameoforganization'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.oked'} type={'input'} label={'oked'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.mfo'} type={'input'} label={'mfo'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.nameofbank'} type={'input'} label={'nameofbank'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.innofbank'} type={'input'} label={'innofbank'}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.scheduledaccount'} type={'input'}
                                       label={'scheduledaccount'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.region'} type={'select'} label={'Region'}
                                       options={regions}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.districts'} type={'select'} label={'District'}
                                       options={districts}
                                       params={{required: true}}/>
                            </Col>

                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.address'} type={'input'}
                                       label={'address'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.postcode'} type={'input'}
                                       label={'postcode'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'corporateentitiesdata.checkingaccount'} type={'input'}
                                       label={'checkingaccount'}
                                />
                            </Col>
                            <Col xs={11} className={"mb-15"}>
                                <Title sm>Add employee</Title>
                            </Col>
                            <Col xs={1} className={'text-right'}>
                                <Button onClick={() => setEmpCount(prev => ++prev)} sm type={"button"}
                                        inline><Plus/></Button>
                            </Col>
                            {range(0, empCount).map(count => <Col xs={12} className={'box__outlined'}><Row
                                align={"center"}>
                                <Col xs={11}>
                                    <Row>
                                        <Col xs={4}>
                                            <Field name={`corporateentitiesdata.employees[${count}].fullname`}
                                                   type={'input'}
                                                   label={'Employee fullname'}
                                                   params={{required: true}}
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <Field name={`corporateentitiesdata.employees[${count}].positions`}
                                                   type={'input'}
                                                   label={'Employee position'}
                                                   params={{required: true}}
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <Field
                                                name={`corporateentitiesdata.employees[${count}].typeofdocumentsformanager`}
                                                type={'input'}
                                                label={'Employee doc type'}
                                                params={{required: true}}
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <Field name={`corporateentitiesdata.employees[${count}].documentnumber`}
                                                   type={'input'}
                                                   label={'Employee documentnumber'}
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <Field
                                                name={`corporateentitiesdata.employees[${count}].dateofmanagerdocument`}
                                                dateFormat={"MM/DD/YYYY"} type={'datepicker'}
                                                label={'dateofmanagerdocument'}
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <Field name={`corporateentitiesdata.employees[${count}].expirationdate`}
                                                   dateFormat={"MM/DD/YYYY"} type={'datepicker'}
                                                   label={'expirationdate'}
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <Field name={`corporateentitiesdata.employees[${count}].telephonenumber`}
                                                   type={'input'}
                                                   label={'telephonenumber'}
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <Field name={`corporateentitiesdata.employees[${count}].emailforcontacts`}
                                                   type={'input'}
                                                   label={'emailforcontacts'}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={1} className={"text-right "}>
                                    <Button danger onClick={() => setEmpCount(prev => --prev)} sm type={"button"}
                                            inline><Minus/></Button>
                                </Col>
                            </Row></Col>)}

                        </>
                        }
                        <Col xs={4}>
                            <Field
                                label={'isUsedourpanel'}
                                type={'switch'}
                                name={'isUsedourpanel'}
                                params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field
                                label={'isUserRestAPI'}
                                type={'switch'}
                                name={'isUserRestAPI'}
                                params={{required: true}}/>
                        </Col>
                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default AgentsCreateContainer;