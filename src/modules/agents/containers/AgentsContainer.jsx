import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get, includes, isEqual} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {Download, FileText, Filter, RefreshCcw, Trash} from "react-feather";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {ContentLoader} from "../../../components/loader";
import config from "../../../config";
import { useTranslation } from 'react-i18next';
import dayjs from "dayjs";
import Form from "../../../containers/form/form";
import {Col, Row} from "react-grid-system";
import Field from "../../../containers/form/field";
import Button from "../../../components/ui/button";
import Flex from "../../../components/flex";
import {getSelectOptionsListFromData} from "../../../utils";

const AgentsContainer = () => {

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const user = useStore(state => get(state, 'user'))
    const {t} = useTranslation()
    const [filter, setFilter] = useState({
        // branch: get(user, 'branch._id'),
    });
    const {mutate:generateAgentAgreement,isLoading} = usePostQuery({listKeyId:[KEYS.agents,1]})

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Агенты"),
            path: '/agents',
        },
        {
            id: 2,
            title: t("Страховые агенты"),
            path: '/agents/insurance-agents',
        }
    ], [])
    let {data: branches} = useGetAllQuery({
        key: KEYS.branches, url: `${URLS.branches}/list`, params: {
            params: {
                limit: 200
            }
        }
    })
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


    return (
        <>
            {
                isLoading && <ContentLoader />
            }
            <GridView
                extraActions={(tr)=><><RefreshCcw onClick={()=>{
                    generateAgentAgreement({
                        url:`${URLS.agentAgreement}/${get(tr,"_id")}`
                    })
                }}  size={20} style={{marginLeft:10,cursor:'pointer',color:'#306962'}} /></>}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'inn',
                        title: t("INN")
                    },
                    {
                        id: 3,
                        key: 'typeofagent.name',
                        title: t("Agent type")
                    },
                    {
                        id: 4,
                        key: 'organization.nameoforganization',
                        title: t("organization name")
                    },
                    {
                        id: 5,
                        key: 'person.secondname',
                        title: t("Lastname")
                    },
                    {
                        id: 55,
                        key: 'person.name',
                        title: t("Firstname")
                    },

                    {
                        id: 556,
                        key: 'person.middlename',
                        title: t("Middlename")
                    },
                    {
                        id: 557,
                        key: 'agreementnumber',
                        title: t("agreementnumber")
                    },
                    {
                        id: 558,
                        key: 'agreementdate',
                        title: t("agreementdate"),
                        render:(_tr)=>dayjs(get(_tr,'agreementdate')).format("DD-MM-YYYY")
                    },
                    {
                        id: 555,
                        key: 'agreementPath',
                        title: t("Agreement file"),
                        render:(_tr)=>{
                            return get(_tr,'agreementPath') && <a href={`${config.FILE_URL}/${get(_tr,'agreementPath')}`} target={'_blank'}><Download /></a>
                        }
                    },
                ]}
                keyId={[KEYS.agents,filter]}
                url={URLS.agents}
                listUrl={`${URLS.agents}/list`}
                title={t("Страховые агенты")}
                responseDataKey={'data.data'}
                createUrl={'/agents/create'}
                updateUrl={'/agents/update'}
                isHideColumn
                params={{...filter}}
                hasUpdateBtn={true}
                extraFilters={<Form sm formRequest={({data: {group, subGroup, ...rest} = {}}) => {
                    setFilter(rest);
                }}
                                   mainClassName={'mt-15'}>

                    {() => <Row align={'end'} gutterWidth={10}>
                        <Col xs={4}>
                            <Field  type={'select'}
                                   label={t("Филиал")} name={'branch'}
                                   options={branches} defaultValue={get(filter, 'branch')}
                                   isDisabled={!includes([config.ROLES.admin], get(user, 'role.name'))}/>
                        </Col>

                        <Col xs={3}>
                            <div style={{display:'flex',marginBottom:'12px',marginLeft:'15px'}}>
                                <Button  htmlType={'submit'}><Flex justify={'center'}><Filter size={14}/><span
                                    style={{marginLeft: '5px'}}>{t("Применить")}</span></Flex></Button>
                                <Button className={'ml-15'}  onClick={() => {
                                    setFilter({})
                                }}  danger type={'reset'}><Flex justify={'center'}><Trash
                                    size={14}/><span
                                    style={{marginLeft: '5px'}}>{t("Очистить")}</span></Flex></Button>
                            </div>
                        </Col>
                    </Row>}
                </Form>}
            />
        </>
    );
};

export default AgentsContainer;
