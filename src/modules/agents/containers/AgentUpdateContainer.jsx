import React, {useEffect, useState, useMemo} from 'react';
import {Row, Col} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import {get, isEqual, range} from "lodash";
import {useGetAllQuery, useGetOneQuery, usePostQuery, usePutQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {OverlayLoader} from "../../../components/loader";
import {useStore} from "../../../store";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import Form from "../../../containers/form/form";
import Button from "../../../components/ui/button";
import Field from "../../../containers/form/field";
import {Minus, Plus} from "react-feather";
import {getSelectOptionsListFromData} from "../../../utils";
import Panel from "../../../components/panel";
import Search from "../../../components/search";

const AgentUpdateContainer = ({...rest}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {id} = useParams()
    const [personType, setPersonType] = useState(null)
    const [empCount, setEmpCount] = useState(0);

    let {data: agent, isLoading, isError} = useGetOneQuery({id, key: KEYS.agents, url: URLS.agents})
    const {mutate: updateRequest, isLoading: updateIsLoading} = usePutQuery({listKeyId: KEYS.agents})

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))




    const setPersonTypeForSelect = (val, name) => {
        if (isEqual(name, 'typeofpersons')) {
            setPersonType(val)
        }
    }
    let {data: branches} = useGetAllQuery({key: KEYS.branches, url: URLS.branches})
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchname')

    let {data: regions} = useGetAllQuery({key: KEYS.regions, url: URLS.regions})
    regions = getSelectOptionsListFromData(get(regions, `data.data`, []), '_id', 'name')

    let {data: agentTypes} = useGetAllQuery({key: KEYS.typeofagent, url: URLS.typeofagent})
    agentTypes = getSelectOptionsListFromData(get(agentTypes, `data.data`, []), '_id', 'name')

    let {data: persons} = useGetAllQuery({key: KEYS.typeofpersons, url: URLS.typeofpersons})
    persons = getSelectOptionsListFromData(get(persons, `data.data`, []), '_id', 'name')

    let {data: accountstatus} = useGetAllQuery({key: KEYS.accountstatus, url: URLS.accountstatus})
    accountstatus = getSelectOptionsListFromData(get(accountstatus, `data.data`, []), '_id', 'name')

    let {data: accountrole} = useGetAllQuery({key: KEYS.accountroles, url: URLS.accountroles})
    accountrole = getSelectOptionsListFromData(get(accountrole, `data.data`, []), '_id', 'name')

    let {data: genders} = useGetAllQuery({key: KEYS.genders, url: URLS.genders})
    genders = getSelectOptionsListFromData(get(genders, `data.data`, []), '_id', 'name')

    let {data: citizenship} = useGetAllQuery({key: KEYS.citizenship, url: URLS.citizenship})
    citizenship = getSelectOptionsListFromData(get(citizenship, `data.data`, []), '_id', 'name')

    let {data: typeofdocuments} = useGetAllQuery({key: KEYS.typeofdocuments, url: URLS.typeofdocuments})
    typeofdocuments = getSelectOptionsListFromData(get(typeofdocuments, `data.data`, []), '_id', 'name')

    let {data: districts} = useGetAllQuery({key: KEYS.districts, url: URLS.districts})
    districts = getSelectOptionsListFromData(get(districts, `data.data`, []), '_id', 'name')

    let {data: positions} = useGetAllQuery({key: KEYS.position, url: URLS.position})
    positions = getSelectOptionsListFromData(get(positions, `data.data`, []), '_id', 'name')

    const update = ({data}) => {
        updateRequest({url: `${URLS.agents}/${id}`, attributes: {...data,isbeneficiary:null,isfixedpolicyholde:null}}, {
            onSuccess: () => {
                navigate('/agents/insurance-agents')
            },
            onError: () => {

            }
        })
    }


    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Agents'),
            path: '/agents',
        },
        {
            id: 2,
            title: id,
            path: '#',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    useEffect(() => {
        if (get(agent, 'data.data.corporateentitiesdata.employees',[])?.length) {
            setEmpCount(get(agent, 'data.data.corporateentitiesdata.employees').length)
        }
    }, [get(agent, 'data.data')])

    if (isLoading) {
        return <OverlayLoader/>
    }
    return (
        <>
            {updateIsLoading && <OverlayLoader/>}
            <Section>
                <Row className={'mb-25'}>
                    <Col xs={12}>
                        <Title>Agent update</Title>
                    </Col>
                </Row>
                <Form getValueFromField={(val, name) => setPersonTypeForSelect(val, name)}
                      footer={<Button>Update</Button>} formRequest={(values) => update(values)}>
                    <Row>
                        <Col xs={4}>
                            <Field name={'branch'} type={'select'} label={'Branch'} options={branches}
                                   params={{required: true}}
                                   defaultValue={get(agent, 'data.data.branch')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'inn'} type={'input-mask'} label={'INN'}
                                   property={{mask: '999999999', maskChar: '_'}}
                                   params={{required: true, pattern: /^[0-9]*$/}}
                                   defaultValue={get(agent, 'data.data.inn')}
                            />
                        </Col>

                        <Col xs={4}>
                            <Field name={'agreementnumber'} type={'input'}
                                   label={'agreementnumber'}
                                   params={{required: true}}
                                   defaultValue={get(agent, 'data.data.agreementnumber')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'agreementdate'} dateFormat={"MM/DD/YYYY"} type={'datepicker'}
                                   label={'agreementdate'}
                                   params={{required: true}}
                                   defaultValue={get(agent, 'data.data.agreementdate')}
                            />
                        </Col>

                        <Col xs={4}>
                            <Field name={'typeofagent'} type={'select'} label={'Agent type'} options={agentTypes}
                                   defaultValue={get(agent, 'data.data.typeofagent._id')}

                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'typeofpersons'} type={'select'} label={'Person type'} options={persons}
                                   defaultValue={get(agent, 'data.data.typeofpersons._id')}
                                   params={{required: true}}/>
                        </Col>
                        {isEqual(personType, '6292025f8982798b6996bc34') && <>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.name'} type={'input'} label={'name'}
                                       params={{required: true}}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.name')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.secondname'} type={'input'} label={'secondname'}
                                       params={{required: true}}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.secondname')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.middlename'} type={'input'} label={'middlename'}
                                       params={{required: true}} defaultValue={get(agent, 'data.data.forindividualsdata.middlename')}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.gender'} type={'select'} label={'Gender'}
                                       options={genders}
                                       params={{required: true}} defaultValue={get(agent, 'data.data.forindividualsdata.gender')}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.dateofbirth'} dateFormat={"MM/DD/YYYY"} type={'datepicker'}
                                       label={'dateofbirth'}
                                       params={{required: true}} defaultValue={get(agent, 'data.data.forindividualsdata.dateofbirth')}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.citizenship'} type={'select'} label={'Citizenship'}
                                       options={citizenship}
                                       params={{required: true}} defaultValue={get(agent, 'data.data.forindividualsdata.citizenship')}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.typeofdocument'} type={'select'}
                                       label={'typeofdocument'} options={typeofdocuments}
                                       params={{required: true}} defaultValue={get(agent, 'data.data.forindividualsdata.typeofdocument')}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportSeries'} type={'input-mask'}
                                       label={'Passport seria'}
                                       property={{mask: 'aa', maskChar: '_'}}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.passportSeries')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportNumber'} type={'input-mask'}
                                       label={'Passport number'}
                                       property={{mask: '9999999', maskChar: '_'}}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.passportNumber')}
                                />
                            </Col>
                            <Col xs={4}>

                                <Field name={'forindividualsdata.pin'} type={'input-mask'} label={'PINFL'}
                                       property={{mask: '99999999999999', maskChar: '_'}}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.pin')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportissuancedate'} dateFormat={"MM/DD/YYYY"} type={'datepicker'}
                                       label={'passportissuancedate'}
                                       defaultValue={get(agent, 'forindividualsdata.passportissuancedate')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportissuedby'} type={'input'}
                                       label={'passportissuedby'}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.passportissuedby')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.regions'} type={'select'} label={'Region'}
                                       options={regions}
                                       params={{required: true}} defaultValue={get(agent, 'data.data.forindividualsdata.regions')}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.districts'} type={'select'} label={'District'}
                                       options={districts}
                                       params={{required: true}} defaultValue={get(agent, 'data.data.forindividualsdata.districts')}/>
                            </Col>

                            <Col xs={4}>
                                <Field name={'forindividualsdata.address'} type={'input'}
                                       label={'address'}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.address')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.postcode'} type={'input'}
                                       label={'postcode'}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.postcode')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.telephonenumber'} type={'input'}
                                       label={'telephonenumber'}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.telephonenumber')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.emailforcontact'} type={'input'}
                                       label={'emailforcontact'}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.emailforcontact')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.personalaccount'} type={'input'}
                                       label={'personalaccount'}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.personalaccount')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.transitaccount'} type={'input'}
                                       label={'transitaccount'}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.transitaccount')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.mfo'} type={'input'}
                                       label={'mfo'}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.mfo')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.nameofbank'} type={'input'}
                                       label={'nameofbank'}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.nameofbank')}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.numberofcard'} type={'input'} label={'numberofcard'}
                                       defaultValue={get(agent, 'data.data.forindividualsdata.numberofcard')}
                                />
                            </Col>
                        </>
                        }
                        {isEqual(personType, '629202448982798b6996bc32') &&
                            <>

                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.nameoforganization'} type={'input'}
                                           label={'nameoforganization'}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.nameoforganization')}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.oked'} type={'input'} label={'oked'}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.oked')}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.mfo'} type={'input'} label={'mfo'}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.mfo')}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.nameofbank'} type={'input'} label={'nameofbank'}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.nameofbank')}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.innofbank'} type={'input'} label={'innofbank'}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.innofbank')}
                                    />
                                </Col>

                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.scheduledaccount'} type={'input'}
                                           label={'scheduledaccount'}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.scheduledaccount')}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.region'} type={'select'} label={'Region'}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.region')}
                                           options={regions}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.districts'} type={'select'} label={'District'}
                                           options={districts}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.districts')}
                                           params={{required: true}}/>
                                </Col>

                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.address'} type={'input'}
                                           label={'address'}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.address')}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.postcode'} type={'input'}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.postcode')}
                                           label={'postcode'}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.checkingaccount'} type={'input'}
                                           label={'checkingaccount'}
                                           defaultValue={get(agent, 'data.data.corporateentitiesdata.checkingaccount')}
                                    />
                                </Col>
                                <Col xs={11} className={"mb-15"}>
                                    <Title sm>Add employee</Title>
                                </Col>
                                <Col xs={1} className={'text-right'}>
                                    <Button onClick={() => setEmpCount(prev => ++prev)} sm type={"button"}
                                            inline><Plus/></Button>
                                </Col>
                                {range(0,empCount).map(count => <Col xs={12} className={'box__outlined'}><Row align={"center"}>
                                    <Col xs={11}>
                                        <Row>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].fullname`} type={'input'}
                                                       label={'Employee fullname'}
                                                       params={{required:true}}
                                                       defaultValue={get(agent, `data.data.corporateentitiesdata.employees[${count}].fullname`)}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].positions`} type={'select'} options={positions}
                                                       label={'Employee position'}
                                                       params={{required:true}}
                                                       defaultValue={get(agent, `data.data.corporateentitiesdata.employees[${count}].positions`)}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].typeofdocumentsformanager`} type={'select'} options={typeofdocuments}
                                                       label={'Employee doc type'}
                                                       params={{required:true}}
                                                       defaultValue={get(agent, `data.data.corporateentitiesdata.employees[${count}].typeofdocumentsformanager`)}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].documentnumber`} type={'input'}
                                                       label={'Employee documentnumber'}
                                                       defaultValue={get(agent, `data.data.corporateentitiesdata.employees[${count}].documentnumber`)}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].dateofmanagerdocument`} dateFormat={"MM/DD/YYYY"} type={'datepicker'}
                                                       label={'dateofmanagerdocument'}
                                                       defaultValue={get(agent, `data.data.corporateentitiesdata.employees[${count}].dateofmanagerdocument`)}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].expirationdate`} dateFormat={"MM/DD/YYYY"} type={'datepicker'}
                                                       label={'expirationdate'}
                                                       defaultValue={get(agent, `data.data.corporateentitiesdata.employees[${count}].expirationdate`)}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].telephonenumber`} type={'input'}
                                                       label={'telephonenumber'}
                                                       defaultValue={get(agent, `data.data.corporateentitiesdata.employees[${count}].telephonenumber`)}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].emailforcontacts`} type={'input'}
                                                       label={'emailforcontacts'}
                                                       defaultValue={get(agent, `data.data.corporateentitiesdata.employees[${count}].emailforcontacts`)}
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
                                params={{required: true}}
                                defaultValue={get(agent, 'data.data.isUsedourpanel')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field
                                label={'isUserRestAPI'}
                                type={'switch'}
                                name={'isUserRestAPI'}
                                params={{required: true}}
                                defaultValue={get(agent, 'data.data.isUserRestAPI')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'email'} type={'input'} label={'Email'}
                                   params={{required: true}} defaultValue={get(agent, 'data.data.email')}/>
                        </Col>

                        <Col xs={4}>
                            <Field name={'password'} type={'input'} label={'password'} property={{type:"password"}}
                                   params={{required: true}} defaultValue={get(agent, 'data.data.password')}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'accountstatus'} type={'select'} label={'Account status'}
                                   options={accountstatus}
                                   params={{required: true}} defaultValue={get(agent, 'data.data.accountstatus._id')}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'accountrole'} type={'select'} label={'Account role'} options={accountrole}
                                   params={{required: true}} defaultValue={get(agent, 'data.data.accountrole._id')}/>
                        </Col>
                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default AgentUpdateContainer;