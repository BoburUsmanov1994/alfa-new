import React, {useEffect, useMemo, useState} from "react";
import {useStore} from "../../../../store";
import {get, includes, isEqual, isNil} from "lodash";
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
import {DollarSign, FileText, Filter, Trash} from "react-feather";
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {getSelectOptionsListFromData, saveFile} from "../../../../utils";
import {useNavigate} from "react-router-dom";
import Pagination from "../../../../components/pagination";
import Table from "../../../../components/table";
import {ContentLoader} from "../../../../components/loader";
import Modal from "../../../../components/modal";
import Checkbox from "rc-checkbox";
import Swal from "sweetalert2";

const ListContainer = () => {
    const {t} = useTranslation()
    const user = useStore(state => get(state, 'user', null))
    const navigate = useNavigate();
    const [filter, setFilter] = useState({
        branch: get(user, 'branch._id'),
    });
    const [filterModal, setFilterModal] = useState({
    });
    const [tr, setTr] = useState(null);
    const [branch, setBranch] = useState(null);
    const [page, setPage] = useState(1);
    const [transactionId, setTransactionId] = useState(null);

    let {data: branches} = useGetAllQuery({
        key: KEYS.branches, url: `${URLS.branches}/list`, params: {
            params: {
                limit: 100
            }
        }
    })
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')


    let {data: transactions, isLoading: _isLoading} = useGetAllQuery({
        key: KEYS.transactions, url: `${URLS.transactions}/list`, enabled: !!(get(user, 'branch._id')), params: {
            params: {
                page,
                branch: get(user, 'branch._id'),
                limit: 50,
                isAvailable:true,
                ...filterModal
            }
        }
    })
    const {mutate: attachRequest, isLoading: isLoadingAttach} = usePostQuery({listKeyId: [KEYS.smrList,filter]})
    const {mutate: unAttachRequest} = usePostQuery({listKeyId: [KEYS.smrList,filter]})

    const attach = ({data}) => {
        const {attachmentSum,attach} = data;
        attachRequest({
            url: `${URLS.smrTransactionAttach}?contract_id=${get(tr,'contract_id')}`,
            attributes: {
                attach,
                transaction: transactionId,
                attachmentSum,
            }
        }, {
            onSuccess: () => {
                setTransactionId(null)
                setTr(null)
            },
            onError: () => {

            }
        })
    }
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
    let {refetch:smrReport} = useGetAllQuery({
        key: KEYS.smrPortfelReport,
        url: URLS.smrPortfelReport,
        params: {
            params: {
                branch: includes([config.ROLES.admin], get(user, 'role.name')) ? branch : get(user, 'branch._id'),
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

    const unAttach = (_id) => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            backdrop: 'rgba(0,0,0,0.9)',
            background: 'none',
            title: t('Are you sure?'),
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#13D6D1',
            confirmButtonText: t('Unattach'),
            cancelButtonText: t('Cancel'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                unAttachRequest({url: `${URLS.smrUnAttachAll}?contract_id=${_id}`})
            }
        });
    }


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
                extraActions={(_tr)=>includes(['new', 'partialPaid','sent'],get(_tr,'attachStatus')) && <DollarSign onClick={()=>setTr(_tr)} size={22} style={{marginLeft:10,cursor:'pointer',color:'#306962'}}/>}
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
                    {
                        id: 11,
                        key: "contract_id",
                        title: "Открепить деньги",
                        render: (row) =><Button onClick={()=>unAttach(get(row, 'contract_id'))} sm inline danger>Открепить</Button>

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
                        <Col xs={3}>
                            <Field label={t('Policy seria')} type={'input'}
                                   name={'seriaPolicy'}
                                   defaultValue={get(filter, 'seriaPolicy')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('Policy number')} type={'input'}
                                   name={'numberPolicy'}
                                   defaultValue={get(filter, 'numberPolicy')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('Insurance sum')} type={'number-format-input-filter'}
                                   name={'insuranceSum'}
                                   defaultValue={get(filter, 'insuranceSum')}

                            />
                        </Col>
                        <Col xs={3}>
                            <Field label={t('Insurance premium')} type={'number-format-input-filter'}
                                   name={'insurancePremium'}
                                   defaultValue={get(filter, 'insurancePremium')}

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

                        <Col xs={3}><Field property={{onChange: (val) => setBranch(val)}} type={'select'} label={'Филиал'} name={'branch'}
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
                                <Button  className={'ml-15'} onClick={() => {
                                    smrReport()
                                }} green type={'button'}><Flex justify={'center'}><FileText
                                    size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("Portfel report")}</span></Flex></Button>
                            </div>
                        </Col>
                    </Row>}
                </Form>}
            />
            <Modal  title={'Распределение к полису'} visible={!isNil(tr)}
                    hide={() => setTr(null)}>
                <div style={{padding:'15px 0'}}>
                    <Form formRequest={({data}) => {
                        setPage(1)
                        setFilterModal({...data})
                    }}>
                        <Row align={'end'} gutterWidth={16}>
                            <Col xs={2}>
                                <Field sm label={t('Дата п/п от')} type={'datepicker'}
                                       name={'fromDate'}
                                       defaultValue={get(filter, 'fromDate')}

                                />
                                <Field sm label={t('Дата п/п до')} type={'datepicker'}
                                       name={'toDate'}
                                       defaultValue={get(filter, 'toDate')}

                                />

                            </Col>
                            <Col xs={2}>
                                <Field sm label={t('Сумма поступления от')} type={'number-format-input-filter'}
                                       name={'payment_amount_from'}
                                       defaultValue={get(filter, 'payment_amount_from', null)}
                                />
                                <Field sm label={t('Сумма поступления до')} type={'number-format-input-filter'}
                                       name={'payment_amount_to'}
                                       defaultValue={get(filter, 'payment_amount_to', null)}
                                />
                            </Col>
                            <Col xs={2}>
                                <Field sm label={t('Прикреплено от')} type={'number-format-input-filter'}
                                       name={'attached_sum_from'}
                                       defaultValue={get(filter, 'attached_sum_from', null)}
                                />
                                <Field sm label={t('Прикреплено до')} type={'number-format-input-filter'}
                                       name={'attached_sum_to'}
                                       defaultValue={get(filter, 'attached_sum_to', null)}
                                />
                            </Col>
                            <Col xs={2}>
                                <Field sm label={t('Доступный остаток от')} type={'number-format-input-filter'}
                                       name={'available_sum_from'}
                                       defaultValue={get(filter, 'available_sum_from', null)}
                                />
                                <Field sm label={t('Доступный остаток до')} type={'number-format-input-filter'}
                                       name={'available_sum_to'}
                                       defaultValue={get(filter, 'available_sum_to', null)}
                                />
                            </Col>
                            <Col xs={2}>

                                <Field  defaultValue={get(filter, 'is1C')} type={'switch'}
                                        name={'is1C'}
                                        label={t("is1C ?")}
                                />
                                <Field sm  defaultValue={get(filter, 'payment_details')} type={'input'}
                                       name={'payment_details'}
                                       label={t("Payment details ")}
                                />
                            </Col>
                            <Col xs={2} >
                                <div style={{marginBottom:'25px'}}>
                                    <Button xs htmlType={'submit'}><Flex justify={'center'}><Filter size={14}/><span
                                        style={{marginLeft: '5px'}}>{t("Применить")}</span></Flex></Button>
                                    <Button className={'mt-15'} xs onClick={() => {
                                        setFilterModal({})
                                    }} danger type={'reset'}><Flex justify={'center'}><Trash
                                        size={14}/><span
                                        style={{marginLeft: '5px'}}>{t("Очистить")}</span></Flex></Button>

                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
                {
                    isLoadingAttach && <ContentLoader/>
                }
                {
                    <Table bordered hideThead={false}
                           thead={['', '№', 'Дата п/п', 'Наименоменование отправителя', 'Сумма поступления','Детали платежа', 'Available sum']}>{get(transactions, 'data.data', []).map((item, i) =>
                        <tr key={get(item, '_id')}>
                            <td><Checkbox disabled={!get(item, 'available_sum', 0)}
                                          checked={isEqual(transactionId, get(item, '_id'))} onChange={(e) => {
                                if (e.target?.checked) {
                                    setTransactionId(get(item, '_id'))
                                } else {
                                    setTransactionId(null)
                                }
                            }}/></td>
                            <td>{(page-1)*50+(i + 1)}</td>
                            <td>{get(item, 'payment_order_date')}</td>
                            <td>{get(item, 'sender_name')}</td>
                            <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                              value={get(item, 'payment_amount', 0)}/></td>

                            <td>{get(item, 'payment_details')}</td>
                            <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                              value={get(item, 'available_sum', 0)}/></td>
                        </tr>)}</Table>}
                {transactionId && <Form formRequest={attach} footer={<Button type={'submit'}>{t("Прикрепить")}</Button>}>
                    <Row className={'mt-15'}>
                        <Col xs={6}>
                            <Field defaultValue={get(tr, 'policy.ins_premium_smr', 0)}
                                   label={t("Сумма оплаты по полису:")} property={{disabled: true}}
                                   type={'number-format-input'} name={'sumInsurancePremium'}/>
                        </Col>
                        <Col xs={6}>
                            <Field defaultValue={get(tr, 'attachedSum', 0)} property={{disabled: true}}
                                   type={'number-format-input'}
                                   name={'attachedSum'} label={t("Сумма прикреплённых средств:")}/>
                        </Col>
                        <Col xs={6}>
                            <Field type={'number-format-input'} name={'attachmentSum'} label={t("Сумма к прикреплению:")}/>
                        </Col>
                        <Col xs={6}>
                            <Field defaultValue={true} type={'switch'} name={'attach'} label={t("Attach or detach to policy")} options = {[
                                {
                                    value: false,
                                    label: t('Detach')
                                },
                                {
                                    value: true,
                                    label: t('Attach')
                                },
                            ]} />
                        </Col>
                    </Row>
                </Form>}
                <Pagination limit={50} page={page} setPage={setPage} totalItems={get(transactions, 'data.count', 0)} />
            </Modal>
        </>
    );
};

export default ListContainer;
