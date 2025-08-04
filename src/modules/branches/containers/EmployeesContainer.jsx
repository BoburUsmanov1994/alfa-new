import React, {useEffect, useMemo, useState} from "react";
import {useStore} from "../../../store";
import {get, includes} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {Col, Row} from "react-grid-system";
import {useTranslation} from "react-i18next";
import Form from "../../../containers/form/form";
import Button from "../../../components/ui/button";
import Flex from "../../../components/flex";
import {FileText, Filter, Trash} from "react-feather";
import {useNavigate} from "react-router-dom";
import config from "../../../config";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData, saveFile} from "../../../utils";
import {PERSON_TYPE} from "../../../constants";

const EmployeesContainer = () => {
    const [filter, setFilter] = useState({})
    const user = useStore(state => get(state, 'user'))
    const navigate = useNavigate();
    const setBreadcrumbs = useStore((state) =>
        get(state, "setBreadcrumbs", () => {
        })
    );
    const {t} = useTranslation();

    const breadcrumbs = useMemo(
        () => [
            {
                id: 1,
                title: t("Справочники"),
                path: "/handbook",
            },
            {
                id: 2,
                title: t("Employees"),
                path: "/handbook/branches",
            },
        ],
        []
    );
    let {data: branches} = useGetAllQuery({
        key: KEYS.branches, url: `${URLS.branches}/list`, params: {
            params: {
                limit: 100
            }
        }
    })
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')

    let {refetch:report} = useGetAllQuery({
        key: [KEYS.employeeReport,filter],
        url: URLS.employeeReport,
        params: {
            params: {
                ...filter
            },
            responseType: 'blob'
        },
        enabled: false,
        cb: {
            success: (res) => {
                saveFile(res)
            }
        }
    })
    useEffect(() => {
        setBreadcrumbs(breadcrumbs);
    }, []);

    return (
        <>
            <GridView
                extraFilters={<Form formRequest={({data: {group, subGroup, ...rest} = {}}) => {
                    setFilter(rest);
                }}
                                    mainClassName={'mt-15'}>

                    {() => <Row align={'flex-end'}>

                        <Col xs={3}>
                            <Field label={t('fullname')} type={'input'}
                                   name={'fullname'}
                                   defaultValue={get(filter, 'fullname')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('passportNumber')} type={'input'}
                                   name={'passportNumber'}
                                   defaultValue={get(filter, 'passportNumber')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('job_title')} type={'input'}
                                   name={'job_title'}
                                   defaultValue={get(filter, 'job_title')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('telephonenumber')} type={'input'}
                                   name={'telephonenumber'}
                                   defaultValue={get(filter, 'telephonenumber')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('emailforcontacts')} type={'input'}
                                   name={'emailforcontacts'}
                                   defaultValue={get(filter, 'emailforcontacts')}

                            />
                        </Col>
                        <Col xs={3}><Field   type={'select'} label={'Филиал'} name={'branch'}
                                             options={branches || []} defaultValue={get(filter, 'branch')}
                                             isDisabled={!includes([config.ROLES.admin], get(user, 'role.name'))}/></Col>

                        <Col xs={6}>
                            <div className="mb-25">
                                <Button htmlType={'submit'}><Flex justify={'center'}><Filter size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("ПРИМЕНИТЬ")}</span></Flex></Button>
                                <Button onClick={() => {
                                    navigate(0)
                                }} className={'ml-15'} danger type={'button'}><Flex justify={'center'}><Trash
                                    size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("ОЧИСТИТЬ")}</span></Flex></Button>
                                <Button  className={'ml-15'} onClick={() => {
                                    report()
                                }} green type={'button'}><Flex justify={'center'}><FileText
                                    size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("Report")}</span></Flex></Button>
                            </div>
                        </Col>
                    </Row>}
                </Form>}
                tableHeaderData={[
                    {
                        id: 1,
                        key: "fullname",
                        title: t("Fullname"),
                    },
                    {
                        id: 2,
                        key: "photo",
                        title: t("Photo"),
                    },
                    {
                        id: 3,
                        key: "documentnumber",
                        title: t("Passport"),
                    },
                    {
                        id: 4,
                        key: "position.name",
                        title: t("Position"),
                    },
                    {
                        id: 6,
                        key: "telephonenumber",
                        title: t("Phone"),
                    },
                    {
                        id: 7,
                        key: "emailforcontacts",
                        title: t("Email"),
                    },
                ]}
                keyId={[KEYS.employee, filter]}
                url={URLS.employee}
                listUrl={`${URLS.employee}/list`}
                title={t("Employees")}
                responseDataKey={"data.data"}
                createUrl={"/branches/employee/create"}
                params={{...filter}}
                isHideColumn
            />
        </>
    );
};

export default EmployeesContainer;
