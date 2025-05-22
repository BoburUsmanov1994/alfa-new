import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get, includes} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";
import {PERSON_TYPE} from "../../../constants";
import config from "../../../config";
import Form from "../../../containers/form/form";
import {Col, Row} from "react-grid-system";
import Flex from "../../../components/flex";
import Button from "../../../components/ui/button";
import {Filter, Trash} from "react-feather";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";


const ClientsContainer = () => {
    const {t} = useTranslation()
    const user = useStore(state => get(state, 'user'))
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [filter, setFilter] = useState({});
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Клиенты',
            path: '/clients',
        },
        {
            id: 2,
            title: 'Тип человека',
            path: '/clients/person-type',
        }
    ], [])
    let {data: branches} = useGetAllQuery({
        key: KEYS.branches, url: `${URLS.branches}/list`, params: {
            params: {
                limit: 100
            }
        }
    })
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={'Название'} defaultValue={rowId ? get(data, 'name') : null}
               params={{required: true}}/>
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}

                tableHeaderData={[
                    {
                        id: 1,
                        key: 'person.fullName.firstname',
                        title: 'Firstname'
                    },
                    {
                        id: 2,
                        key: 'person.fullName.lastname',
                        title: 'Lastname'
                    },
                    {
                        id: 3,
                        key: 'person.fullName.middlename',
                        title: 'Middlename'
                    },
                    {
                        id: 4,
                        key: 'person.passportData.pinfl',
                        title: 'Pinfl'
                    },
                    {
                        id: 5,
                        key: 'person.passportData.seria',
                        title: 'Passport seria'
                    },
                    {
                        id: 6,
                        key: 'person.passportData.number',
                        title: 'Passport number'
                    },
                    {
                        id: 7,
                        key: 'person.phone',
                        title: 'Phone number'
                    },
                    {
                        id: 8,
                        key: 'branch.branchName',
                        title: 'Branch'
                    },

                ]}
                keyId={[KEYS.clients,filter]}
                url={URLS.clients}
                listUrl={`${URLS.clients}/list`}
                title={t('Clients')}
                responseDataKey={'data.data'}
                params={{
                    type: PERSON_TYPE.person,
                    branch: !includes([config.ROLES.admin], get(user, 'role.name')) ? get(user, 'branch._id') : undefined,
                    ...filter,
                }}
                createUrl={'/clients/physical/create'}
                updateUrl={'/clients/physical/update'}
                hasUpdateBtn
                hideDeleteBtn
                extraFilters={<Form sm formRequest={({data: {group, subGroup, ...rest} = {}}) => {
                    setFilter(rest);
                }}
                                    mainClassName={'mt-15'}>

                    {() => <Row align={'end'} gutterWidth={10}>


                        <Col xs={2}>
                            <Field sm label={t('Имя')} type={'input'}
                                   name={'firstname'}
                                   defaultValue={get(filter, 'firstname')}

                            />
                        </Col>
                        <Col xs={2}>
                            <Field sm label={t('Фамилия')} type={'input'}
                                   name={'lastname'}
                                   defaultValue={get(filter, 'lastname')}

                            />
                        </Col>
                        <Col xs={2}>
                            <Field sm label={t('Отчество')} type={'input'}
                                   name={'middlename'}
                                   defaultValue={get(filter, 'middlename')}

                            />
                        </Col>

                        <Col xs={2}>
                            <Field sm label={t('ПИНФЛ')}
                                   name={'pinfl'}
                                   defaultValue={get(filter, 'pinfl')}
                                   type={'input-mask'}
                                   property={{
                                       mask: '99999999999999',
                                       maskChar: '_',
                                       hideErrorMsg: true
                                   }}

                            />

                        </Col>
                        <Col xs={2}>
                            <Field sm label={t('Passport seria')}
                                   name={'seria'}
                                   defaultValue={get(filter, 'seria')}
                                   type={'input-mask'}
                                   property={{mask: "aa", maskChar: "_"}}

                            />

                        </Col>
                        <Col xs={2}>
                            <Field sm label={t('Passport number')}
                                   name={'number'}
                                   defaultValue={get(filter, 'number')}
                                   type={'input-mask'}
                                   property={{mask: "9999999", maskChar: "_"}}

                            />
                        </Col>

                        <Col xs={2}>
                            <Field sm label={t('Телефон')} type={'input'}
                                   name={'phone'}
                                   defaultValue={get(filter, 'phone')}

                            />
                        </Col>
                        <Col xs={2}><Field sm  type={'select'} label={'Филиал'} name={'branch'}
                                           options={branches || []} defaultValue={get(filter, 'branch')}
                                           isDisabled={!includes([config.ROLES.admin], get(user, 'role.name'))}/></Col>
                        <Col  xs={2} >
                            <Flex justify={'center'}>
                                <Field sm
                                    label={'Is NBU'}
                                    type={'switch'}
                                    name={'isNbu'}/>
                            </Flex>
                        </Col>

                        <Col xs={2}>
                            <Flex>
                                <Button xs htmlType={'submit'}><Flex justify={'center'}><Filter
                                    size={14}/><span>{t("Применить")}</span></Flex></Button>
                                <Button onClick={() => setFilter({})} className={'mt-15 mb-15 mr-8'} xs danger
                                        type={'reset'}><Flex justify={'center'}><Trash
                                    size={14}/><span>{t("Очистить")}</span></Flex></Button>

                            </Flex>
                        </Col>
                    </Row>}
                </Form>}
            />
        </>
    );
};

export default ClientsContainer;
