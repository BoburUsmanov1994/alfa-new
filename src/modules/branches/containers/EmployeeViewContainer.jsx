import React, {useEffect, useMemo,useState} from 'react';
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
import Form from "../../../containers/form/form";
import Field from "../../../containers/form/field";
import Rodal from "rodal";
import {getSelectOptionsListFromData} from "../../../utils";

const EmployeeViewContainer = ({...rest}) => {
    const {t} = useTranslation();
    const {id} = useParams()
    const [open, setOpen] = useState(false)
    let {data, isLoading, isError} = useGetOneQuery({id, key: KEYS.employee, url: URLS.employee})
    let {data:roles} = useGetAllQuery({key:KEYS.accountroles,url:URLS.accountroles})
    roles = getSelectOptionsListFromData(get(roles,`data.data`,[]),'_id','name')
    let {data:status} = useGetAllQuery({key:KEYS.accountstatus,url:URLS.accountstatus})
    status = getSelectOptionsListFromData(get(status,`data.data`,[]),'_id','name')
    const {mutate: createRequest, isLoading: postLoading} = usePostQuery({listKeyId: [KEYS.employee,id]})

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Employee'),
            path: '/branches',
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
                ...request,
                branch_Id:get(data, "data.data.branch._id"),
                emp_id:id
            }
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
                        <Title>{t("Employee view")}</Title>
                    </Col>
                    <Col className={'text-right'} xs={2}>
                        <Button onClick={() => setOpen(true)}>{t("Add Account")}</Button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("Branch name")}</td>
                                <td><strong>{get(data, "data.data.branch.branchname")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Region")}</td>
                                <td><strong>{get(data, "data.data.regions.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("District")}</td>
                                <td><strong>{get(data, "data.data.districts.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Address")}</td>
                                <td><strong>{get(data, "data.data.address")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Position")}</td>
                                <td><strong>{get(data, "data.data.position.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("name")}</td>
                                <td><strong>{get(data, "data.data.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("secondname")}</td>
                                <td><strong>{get(data, "data.data.secondname")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Middlename")}</td>
                                <td><strong>{get(data, "data.data.middlename")}</strong></td>
                            </tr>

                        </Table>
                    </Col>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("passportSeries")}</td>
                                <td><strong>{get(data, "data.data.passportSeries")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("passportNumber")}</td>
                                <td><strong>{get(data, "data.data.passportNumber")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("dateofbirth")}</td>
                                <td><strong>{dayjs(get(data, "data.data.dateofbirth")).format("DD/MM/YYYY")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("PINFL")}</td>
                                <td><strong>{get(data, "data.data.pin")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("telephone")}</td>
                                <td><strong>{get(data, "data.data.telephonenumber")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Citizenship")}</td>
                                <td><strong>{get(data, "data.data.citizenship.name")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Gender")}</td>
                                <td><strong>{get(data, "data.data.gender.name")}</strong></td>
                            </tr>

                        </Table>
                    </Col>
                    <Col xs={12} className={'mt-15'}>
                        <Title sm>{t("Account info")}</Title>
                    </Col>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("Email")}</td>
                                <td><strong>{get(data, "data.data.user_id.email")}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Account role")}</td>
                                <td><strong>{get(data, "data.data.user_id.accountrole.name")}</strong></td>
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
                        footer={<Button>{t("Add")}</Button>} formRequest={(values) => addAccount(values)}>
                        <Row className={'mt-15'}>
                            <Col xs={6}>
                                <Field name={'email'} type={'input'} label={t("Email")}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={6}>
                                <Field name={'password'} type={'input'} label={t("Password")}
                                       params={{required: true}}  property={{type: 'password'}}/>
                            </Col>
                            <Col xs={6}>
                                <Field  name={'accountrole'} type={'select'} label={t("Role")} options={roles}  params={{required: true}} />
                            </Col>
                            <Col xs={6}>
                                <Field  name={'accountstatus'} type={'select'} label={t("Status")} options={status}  params={{required: true}} />
                            </Col>
                        </Row>
                    </Form>
                </Rodal>

            </Section>
        </>
    );
};

export default EmployeeViewContainer;