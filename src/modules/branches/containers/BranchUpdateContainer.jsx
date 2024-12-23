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

const BranchUpdateContainer = ({...rest}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {id} = useParams()

    let {data: branch, isLoading, isError} = useGetOneQuery({id, key: KEYS.branches, url: URLS.branches})

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))

    let {data: branchLevels} = useGetAllQuery({key: KEYS.levelofbranch, url: URLS.levelofbranch})
    branchLevels = getSelectOptionsListFromData(get(branchLevels, `data.data`, []), '_id', 'name')

    let {data: regions} = useGetAllQuery({key: KEYS.regions, url: URLS.regions})
    regions = getSelectOptionsListFromData(get(regions, `data.data`, []), '_id', 'name')

    let {data: positions} = useGetAllQuery({key: KEYS.position, url: URLS.position})
    positions = getSelectOptionsListFromData(get(positions, `data.data`, []), '_id', 'name')

    let {data: branchStatusList} = useGetAllQuery({key: KEYS.breanchstatus, url: URLS.breanchstatus})
    branchStatusList = getSelectOptionsListFromData(get(branchStatusList, `data.data`, []), '_id', 'name')

    const {mutate: updateRequest, isLoading: updateIsLoading} = usePutQuery({listKeyId: KEYS.branches})

    const [empCount, setEmpCount] = useState(1);

    const update = ({data}) => {
        updateRequest({url: `${URLS.branches}/${id}`, attributes: data}, {
            onSuccess: () => {
                navigate('/branches')
            },
            onError: () => {

            }
        })
    }


    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Branches'),
            path: '/branches',
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
        if (get(branch, 'data.data.employees',[])?.length) {
            setEmpCount(get(branch, 'data.data.employees').length)
        }
    }, [get(branch, 'data.data')])

    if (isLoading) {
        return <OverlayLoader/>
    }
    return (
        <>
            {updateIsLoading && <OverlayLoader/>}
            <Section>
                <Row className={'mb-25'}>
                    <Col xs={12}>
                        <Title>{t("Branch update")}</Title>
                    </Col>
                </Row>
                <Form footer={<Button type={"submit"} lg>{t("Update")}</Button>} formRequest={(values) => update(values)}>
                    <Row className={'mb-15'}>
                        <Col xs={4}>
                            <Field name={'levelofbreanches'} type={'select'} label={t("Branch level")}
                                   options={branchLevels}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.levelofbreanches')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'codeofbreanches'} type={'input'}
                                   label={t("codeofbreanches")}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.codeofbreanches')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'inn'} type={'input-mask'} label={t("INN")}
                                   property={{mask: '999999999', maskChar: '_'}}
                                   params={{required: true, pattern: /^[0-9]*$/}}
                                   defaultValue={get(branch, 'data.data.inn')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'region'} type={'select'} label={t("Region")} options={regions}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.region._id')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'branchname'} type={'input'}
                                   label={t("branchname")}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.branchname')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'shorttitleofbranch'} type={'input'}
                                   label={t("shorttitleofbranch")}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.shorttitleofbranch')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'address'} type={'input'}
                                   label={t("address")}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.address')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'telephone'} type={'input'}
                                   label={t("telephone")}
                                   params={{required: true, pattern: {
                                           value: /^998[0-9]{9}$/,
                                           message: 'Invalid format'
                                       }}}
                                   defaultValue={get(branch, 'data.data.telephone')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'email'} type={'input'}
                                   label={t("Email")}
                                   property={{type: "email"}}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.email')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'agreementnumber'} type={'input'}
                                   label={t("agreementnumber")}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.agreementnumber')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'agreementdate'} type={'datepicker'}
                                   label={t("agreementdate")}
                                   defaultValue={get(branch, 'data.data.agreementdate')}

                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'expirationdate'} type={'datepicker'}
                                   label={t("expirationdate")}
                                   defaultValue={get(branch, 'data.data.expirationdate')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={`checkingaccount`} type={'input'}
                                   label={t("checkingaccount")}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.checkingaccount')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={`mfo`} type={'input'}
                                   label={t("mfo")}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.mfo')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={`nameofbank`} type={'input'}
                                   label={t("nameofbank")}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.nameofbank')}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'breanchstatus'} type={'select'} label={t("Branch status")}
                                   options={branchStatusList}
                                   params={{required: true}}
                                   defaultValue={get(branch, 'data.data.breanchstatus._id')}
                            />
                        </Col>


                    </Row>
                    <Row className={"mb-15"}>
                        <Col xs={12}>
                            <Title sm>{t("Add employee")}</Title>
                        </Col>
                    </Row>
                    {range(0, empCount).map((count, i) => <Row align={'center'}>
                        <Col xs={11}>
                            <Row>
                                <Col xs={3}>
                                    <Field name={`employees[${count}].fullname`} type={'input'}
                                           label={t("Fullname")}
                                           params={{required: true}}
                                           defaultValue={get(branch, `data.data.employees[${count}].fullname`)}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field name={`employees[${count}].positions`} type={'select'} label={t("Positions")}
                                           options={positions}
                                           params={{required: true}}
                                           defaultValue={get(branch, `data.data.employees[${count}].positions._id`)}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field name={`employees[${count}].telephonenumber`} type={'input'}
                                           label={t("telephonenumber")}
                                           params={{required: true, pattern: {
                                                   value: /^998[0-9]{9}$/,
                                                   message: 'Invalid format'
                                               }}}
                                           defaultValue={get(branch, `data.data.employees[${count}].telephonenumber`)}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field name={`employees[${count}].emailforcontacts`} type={'input'}
                                           label={t("emailforcontacts")}
                                           property={{type: "email"}}
                                           params={{required: true}}
                                           defaultValue={get(branch, `data.data.employees[${count}].emailforcontacts`)}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={1} className={"text-right"}>
                            {isEqual(empCount, count + 1) ?
                                <Button onClick={() => setEmpCount(prev => ++prev)} sm type={"button"}
                                        inline><Plus/></Button> :
                                <Button danger onClick={() => setEmpCount(prev => --prev)} sm type={"button"}
                                        inline><Minus/></Button>}
                        </Col>
                    </Row>)}
                </Form>
            </Section>
        </>
    );
};

export default BranchUpdateContainer;