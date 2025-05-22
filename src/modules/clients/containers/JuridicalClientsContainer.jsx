import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get, includes, isNil} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";
import {PERSON_TYPE} from "../../../constants";
import config from "../../../config";
import Form from "../../../containers/form/form";
import {Col, Row} from "react-grid-system";
import Button from "../../../components/ui/button";
import Flex from "../../../components/flex";
import { Filter, Trash} from "react-feather";
import {KEYS} from "../../../constants/key";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";

const JuridicalClientsContainer = () => {
    const user = useStore(state => get(state, 'user'))
    const {t} = useTranslation()
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
                        key: 'organization.name',
                        title: 'Name'
                    },
                    {
                        id: 2,
                        key: 'organization.inn',
                        title: 'Inn'
                    },
                    {
                        id: 3,
                        key: 'organization.phone',
                        title: 'Phone'
                    },
                    {
                        id: 4,
                        key: 'organization.address',
                        title: 'Address'
                    },
                    {
                        id: 8,
                        key: 'branch.branchName',
                        title: 'Branch'
                    },

                ]}
                params={{...filter,
                    type:PERSON_TYPE.organization,branch: !includes([config.ROLES.admin],get(user,'role.name')) ? get(user, 'branch._id') : undefined
                }}
                keyId={[KEYS.clients, filter,PERSON_TYPE]}
                url={URLS.clients}
                listUrl={`${URLS.clients}/list`}
                title={t('Clients')}
                responseDataKey={'data.data'}
                createUrl={'/clients/juridical/create'}
                updateUrl={'/clients/juridical/update'}
                hasUpdateBtn
                hideDeleteBtn
                extraFilters={<Form sm formRequest={({data: {group, subGroup, ...rest} = {}}) => {
                    setFilter(rest);
                }}
                                    mainClassName={'mt-15'}>

                    {() => <Row align={'end'}  gutterWidth={10}>


                        <Col xs={2.4}>
                            <Field sm label={t('Имя')} type={'input'}
                                   name={'name'}
                                   defaultValue={get(filter, 'name')}

                            />
                        </Col>
                        <Col xs={2.4}>
                            <Field sm label={t('ИНН')}
                                   name={'inn'}
                                   defaultValue={get(filter, 'inn')}
                                   type={'input-mask'}
                                   property={{
                                       mask: '999999999',
                                       maskChar: '_',
                                       hideErrorMsg: true
                                   }}

                            />

                        </Col>

                        <Col xs={2.4}>
                            <Field sm label={t('Телефон')} type={'input'}
                                   name={'phone'}
                                   defaultValue={get(filter, 'phone')}

                            />
                        </Col>
                        <Col xs={2.4}>
                            <Field sm label={t('Адрес')} type={'input'}
                                   name={'address'}
                                   defaultValue={get(filter, 'address')}

                            />
                        </Col>
                        <Col  xs={2.4} >
                          <Flex justify={'center'}>
                              <Field
                                  sm
                                  label={'Is NBU'}
                                  type={'switch'}
                                  name={'isNbu'}/>
                          </Flex>
                        </Col>
                        <Col xs={2.4}><Field sm  type={'select'} label={'Филиал'} name={'branch'}
                                           options={branches || []} defaultValue={get(filter, 'branch')}
                                           isDisabled={!includes([config.ROLES.admin], get(user, 'role.name'))}/></Col>

                        <Col xs={2.4}>
                            <Flex>
                                <Button  xs htmlType={'submit'}><Flex justify={'center'}><Filter size={14}/><span>{t("Применить")}</span></Flex></Button>
                                <Button  onClick={() => setFilter({})} className={'mt-15 mb-15 mr-8'} xs   danger type={'reset'}><Flex justify={'center'}><Trash
                                    size={14}/><span>{t("Очистить")}</span></Flex></Button>

                            </Flex>
                        </Col>
                    </Row>}
                </Form>}
            />
        </>
    );
};

export default JuridicalClientsContainer;
