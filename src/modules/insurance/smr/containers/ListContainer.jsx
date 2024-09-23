import React, {useEffect, useMemo, useState} from "react";
import {useStore} from "../../../../store";
import {get, includes} from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import {useTranslation} from "react-i18next";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import Form from "../../../../containers/form/form";
import {Col, Row} from "react-grid-system";
import config from "../../../../config";
import Button from "../../../../components/ui/button";
import Flex from "../../../../components/flex";
import {Filter, Trash} from "react-feather";
import {useGetAllQuery} from "../../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../../utils";
import {useNavigate} from "react-router-dom";

const ListContainer = () => {
    const {t} = useTranslation()
    const user = useStore(state => get(state, 'user', null))
    const navigate = useNavigate();
    const [filter, setFilter] = useState({
        branch: get(user, 'branch._id'),
    });

    let {data: branches} = useGetAllQuery({
        key: KEYS.branches, url: `${URLS.branches}/list`, params: {
            params: {
                limit: 100
            }
        }
    })
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')

    const setBreadcrumbs = useStore((state) =>
        get(state, "setBreadcrumbs", () => {
        })
    );
    const breadcrumbs = useMemo(
        () => [
            {
                id: 1,
                title: "СМР",
                path: "/insurance/smr",
            },
            {
                id: 2,
                title: "СМР",
                path: "/insurance/smr",
            },
        ],
        []
    );

    useEffect(() => {
        setBreadcrumbs(breadcrumbs);
    }, []);

    const ModalBody = ({data, rowId = null}) => (
        <>
            <Field
                name={"name"}
                type={"input"}
                label={"Название продукта"}
                defaultValue={rowId ? get(data, "name") : null}
                params={{required: true}}
            />
        </>
    );
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'insurant',
                        title: 'Страхователь',
                        render: (tr) => get(tr, 'insurant.name')
                    },
                    {
                        id: 2,
                        key: 'branch.branchName',
                        title: 'Филиал',
                    },
                    {
                        id: 3,
                        key: 'contract_id',
                        title: 'Номер договора',
                        render: (tr) => get(tr, 'policy.number')
                    },
                    {
                        id: 4,
                        key: 'policy',
                        title: 'Серия полиса',
                        render: (tr) => get(tr, 'policy.seria')
                    },
                    {
                        id: 5,
                        key: 'insurant',
                        title: 'Номер полиса',
                        render: (tr) => get(tr, 'policy.number')
                    },
                    {
                        id: 7,
                        key: 'policy.ins_sum',
                        title: 'Insurance sum',
                        render: (tr) => <NumberFormat displayType={'text'} thousandSeparator={' '}
                                                      value={get(tr, 'policy.ins_sum')}/>
                    },
                    {
                        id: 6,
                        key: 'policy.ins_premium',
                        title: 'Insurance premium',
                        render: (tr) => <NumberFormat displayType={'text'} thousandSeparator={' '}
                                                      value={get(tr, 'policy.ins_premium')}/>
                    },
                    {
                        id: 7,
                        key: 'createdAt',
                        title: 'Created at',
                        render: (tr) => get(tr, 'createdAt') ? dayjs(get(tr, 'createdAt')).format("DD-MM-YYYY HH:mm") : '-'
                    },
                    {
                        id: 9,
                        key: 'status',
                        title: 'Status',
                    },
                ]}
                keyId={[KEYS.smrList, filter]}
                url={URLS.smrList}
                title={t('СМР')}
                responseDataKey={'data.docs'}
                viewUrl={'/insurance/smr/view'}
                updateUrl={'/insurance/smr/update'}
                isHideColumn
                dataKey={'contract_id'}
                deleteUrl={URLS.smrDelete}
                hideCreateBtn={true}
                hasUpdateBtn
                params={{
                    ...filter
                }}
                extraFilters={<Form formRequest={({data: {group, subGroup, ...rest} = {}}) => {
                    setFilter(rest);
                }}
                                    mainClassName={'mt-15'}>

                    {() => <Row align={'flex-end'}>
                        <Col xs={3}>
                            <Field label={t('Номер договора')} type={'input'}
                                   name={'number'}
                                   defaultValue={get(filter, 'number')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('Страхователь')} type={'input'}
                                   name={'dir_name'}
                                   defaultValue={get(filter, 'dir_name')}

                            />
                        </Col>

                        <Col xs={3}><Field type={'select'} label={'Status'} name={'status'}
                                           options={[{value: 'new', label: 'new'}, {
                                               value: 'partialPaid',
                                               label: 'partialPaid'
                                           }, {value: 'paid', label: 'paid'}, {value: 'sent', label: 'sent'}]}
                                           defaultValue={get(filter, 'status')}
                        /></Col>
                        <Col xs={3}>
                            <Field label={t('Дата создания')} type={'datepicker'}
                                   name={'createdAt'}
                                   defaultValue={get(filter, 'createdAt')}

                            />
                        </Col>

                        <Col xs={3}><Field type={'select'} label={'Филиал'} name={'branch'}
                                           options={branches} defaultValue={get(filter, 'branch')}
                                           isDisabled={!includes([config.ROLES.admin], get(user, 'role.name'))}/></Col>
                        <Col xs={9}>
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
            />
        </>
    );
};

export default ListContainer;
