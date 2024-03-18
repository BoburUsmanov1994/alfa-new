import React, {useEffect, useMemo, useState} from 'react';
import {Row, Col} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import {get} from "lodash";
import {useGetAllQuery, useGetOneQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {OverlayLoader} from "../../../components/loader";
import Table from "../../../components/table";
import {useStore} from "../../../store";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import dayjs from "dayjs";
import Button from "../../../components/ui/button";
import Rodal from "rodal";
import Field from "../../../containers/form/field";
import Form from "../../../containers/form/form";
import {getSelectOptionsListFromData} from "../../../utils";

const AgentViewContainer = ({...rest}) => {
    const [open, setOpen] = useState(false)
    const {t} = useTranslation();
    const {id} = useParams()
    let {data, isLoading, isError} = useGetOneQuery({id, key: KEYS.agents, url: URLS.agents})
    let {data:roles} = useGetAllQuery({key:KEYS.accountroles,url:URLS.accountroles})
    roles = getSelectOptionsListFromData(get(roles,`data.data`,[]),'_id','name')
    let {data:status} = useGetAllQuery({key:KEYS.accountstatus,url:URLS.accountstatus})
    status = getSelectOptionsListFromData(get(status,`data.data`,[]),'_id','name')
    const {mutate: createRequest, isLoading: postLoading} = usePostQuery({listKeyId: [KEYS.agents,id]})

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
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
    ], [data])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    if (isLoading) {
        return <OverlayLoader/>
    }

    const addAccount = ({data:request}) => {
        createRequest({
            url:URLS.user,
            attributes:{
                ...request,   branch_Id:get(data, "data.data.branch._id"),
                agentId:id
            },
        },{
            onSuccess:()=>{
                setOpen(false)
            }
        })
    }
    return (
        <>
            <Section>
                <Row className={''}>
                    <Col xs={10}>
                        <Title>Agent view</Title>
                    </Col>
                    <Col className={'text-right'} xs={2}>
                        <Button onClick={() => setOpen(true)}>Add Account</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("accountrole")}</td>
                                <td><strong>{get(data, "data.data.accountrole.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("accountstatus")}</td>
                                <td><strong>{get(data, "data.data.accountstatus.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("agreementdate")}</td>
                                <td><strong>{dayjs(get(data, "data.data.agreementdate")).format("DD/MM/YYYY")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("agreementnumber")}</td>
                                <td><strong>{get(data, "data.data.agreementnumber")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("branch")}</td>
                                <td><strong>{get(data, "data.data.branch.branchname")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("checkingaccount")}</td>
                                <td><strong>{get(data, "data.data.checkingaccount")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("email")}</td>
                                <td><strong>{get(data, "data.data.email")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("inn")}</td>
                                <td><strong>{get(data, "data.data.inn")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("typeofagent")}</td>
                                <td><strong>{get(data, "data.data.typeofagent.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("typeofpersons")}</td>
                                <td><strong>{get(data, "data.data.typeofpersons.name")}</strong></td>
                            </tr>

                        </Table>
                    </Col>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            {
                                get(data, `data.data.corporateentitiesdata.districts`) && <>
                                    <tr>
                                        <td>{t("Juridic address")}</td>
                                        <td><strong>{get(data, "data.data.corporateentitiesdata.address")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Juridic checkingaccount")}</td>
                                        <td><strong>{get(data, "data.data.corporateentitiesdata.checkingaccount")}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Juridic districts")}</td>
                                        <td><strong>{get(data, "data.data.corporateentitiesdata.districts.name")}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Juridic innofbank")}</td>
                                        <td><strong>{get(data, "data.data.corporateentitiesdata.innofbank")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Juridic mfo")}</td>
                                        <td><strong>{get(data, "data.data.corporateentitiesdata.mfo")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Juridic nameofbank")}</td>
                                        <td><strong>{get(data, "data.data.corporateentitiesdata.nameofbank")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Juridic nameoforganization")}</td>
                                        <td>
                                            <strong>{get(data, "data.data.corporateentitiesdata.nameoforganization")}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Juridic oked")}</td>
                                        <td><strong>{get(data, "data.data.corporateentitiesdata.oked")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Juridic postcode")}</td>
                                        <td><strong>{get(data, "data.data.corporateentitiesdata.postcode")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Juridic region")}</td>
                                        <td><strong>{get(data, "data.data.corporateentitiesdata.region.name")}</strong>
                                        </td>
                                    </tr>

                                </>
                            }
                            {
                                get(data, `data.data.forindividualsdata`) && <>
                                    <tr>
                                        <td>{t("Physical region")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.address")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical citizenship")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.citizenship")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical dateofbirth")}</td>
                                        <td>
                                            <strong>{dayjs(get(data, "data.data.forindividualsdata.dateofbirth")).format("DD/MM/YYYY")}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical districts")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.districts")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical emailforcontact")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.emailforcontact")}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical emailforcontact")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.emailforcontact")}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical gender")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.gender.name")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical mfo")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.mfo")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical middlename")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.middlename")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical name")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.name")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical nameofbank")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.nameofbank")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical numberofcard")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.numberofcard")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical passportSeries")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.passportSeries")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical passportNumber")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.passportNumber")}</strong></td>
                                    </tr>

                                    <tr>
                                        <td>{t("Physical passportissuedby")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.passportissuedby")}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical personalaccount")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.personalaccount")}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical pin")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.pin")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical postcode")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.postcode")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical regions")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.regions")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical secondname")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.secondname")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical telephonenumber")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.telephonenumber")}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical transitaccount")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.transitaccount")}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>{t("Physical typeofdocument")}</td>
                                        <td><strong>{get(data, "data.data.forindividualsdata.typeofdocument")}</strong></td>
                                    </tr>
                                </>
                            }
                        </Table>
                    </Col>
                    <Col xs={12} className={'mt-15'}>
                        <Title sm>Account info</Title>
                    </Col>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("Email")}</td>
                                <td><strong>{get(data, "data.data.user_id.email")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Account role")}</td>
                                <td><strong>{get(data, "data.data.user_id.accountrole.name")}</strong> </td>
                            </tr>
                            <tr>
                                <td>{t("Account status")}</td>
                                <td><strong>{get(data, "data.data.user_id.accountstatus.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Branch")}</td>
                                <td><strong>{get(data, "data.data.user_id.branch_Id.branchname")}</strong></td>
                            </tr>

                        </Table>
                    </Col>
                </Row>
                <Rodal visible={open} onClose={() => setOpen(false)}>
                    <Form
                          footer={<Button>Add</Button>} formRequest={(values) => addAccount(values)}>
                        <Row className={'mt-15'}>
                            <Col xs={6}>
                                <Field name={'email'} type={'input'} label={'Email'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={6}>
                                <Field name={'password'} type={'input'} label={'Password'}
                                       params={{required: true}}  property={{type: 'password'}}/>
                            </Col>
                            <Col xs={6}>
                                <Field  name={'accountrole'} type={'select'} label={'Role'} options={roles}  params={{required: true}} />
                            </Col>
                            <Col xs={6}>
                                <Field  name={'accountstatus'} type={'select'} label={'Status'} options={status}  params={{required: true}} />
                            </Col>
                        </Row>
                    </Form>
                </Rodal>
            </Section>
        </>
    );
};

export default AgentViewContainer;