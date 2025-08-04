import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {useTranslation} from 'react-i18next';
import Form from "../../../containers/form/form";
import {Col, Row} from "react-grid-system";
import Field from "../../../containers/form/field";
import Button from "../../../components/ui/button";
import Flex from "../../../components/flex";
import {Filter, Trash} from "react-feather";
import {useNavigate} from "react-router-dom";

const BranchesContainer = () => {
    const [filter, setFilter] = useState({})
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const navigate = useNavigate();
    const {t} = useTranslation()
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Справочники"),
            path: '/handbook',
        },
        {
            id: 2,
            title: t("Branches"),
            path: '/handbook/branches',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    return (
        <>
            <GridView
                extraFilters={<Form formRequest={({data: {group, subGroup, ...rest} = {}}) => {
                    setFilter(rest);
                }}
                                    mainClassName={'mt-15'}>

                    {() => <Row align={'flex-end'}>

                        <Col xs={3}>
                            <Field label={t('branchName')} type={'input'}
                                   name={'branchName'}
                                   defaultValue={get(filter, 'branchName')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('fondId')} type={'input'}
                                   name={'fondId'}
                                   defaultValue={get(filter, 'fondId')}

                            />
                        </Col>

                        <Col xs={6}>
                            <div className="mb-25">
                                <Button htmlType={'submit'}><Flex justify={'center'}><Filter size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("ПРИМЕНИТЬ")}</span></Flex></Button>
                                <Button onClick={() => {
                                    navigate(0)
                                }} className={'ml-15'} danger type={'button'}><Flex justify={'center'}><Trash
                                    size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("ОЧИСТИТЬ")}</span></Flex></Button>
                            </div>
                        </Col>
                    </Row>}
                </Form>}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'branchName',
                        title: t("Branch name")
                    },
                    {
                        id: 2,
                        key: 'fondId',
                        title: t("Fond id")
                    },
                ]}
                keyId={[KEYS.branches, filter]}
                params={{...filter}}
                url={URLS.branches}
                listUrl={`${URLS.branches}/list`}
                title={t("Branches")}
                responseDataKey={'data.data'}
                isHideColumn
                hideCreateBtn
                hideDeleteBtn
            />
        </>
    );
};

export default BranchesContainer;
