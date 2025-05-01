import {get, includes, isEqual, isNil} from "lodash";
import React, {useEffect, useMemo, useState} from "react";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import { KEYS } from "../../../../constants/key";
import { URLS } from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import GridView from "../../../../containers/grid-view/grid-view";
import { useStore } from "../../../../store";
import {ContentLoader} from "../../../../components/loader";
import Table from "../../../../components/table";
import Checkbox from "rc-checkbox";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {Col, Row} from "react-grid-system";
import Pagination from "../../../../components/pagination";
import Modal from "../../../../components/modal";
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import config from "../../../../config";
import {DollarSign, Download, FileText, Filter, Trash} from "react-feather";
import Flex from "../../../../components/flex";
import {getSelectOptionsListFromData, saveFile} from "../../../../utils";
import {useNavigate} from "react-router-dom";

const ListContainer = () => {
  const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useStore(state => get(state, 'user', null))
    const [tr, setTr] = useState(null);
    const [page, setPage] = useState(1);
    const [transactionId, setTransactionId] = useState(null);
    const [branch, setBranch] = useState(null);

  const setBreadcrumbs = useStore((state) =>
    get(state, "setBreadcrumbs", () => {})
  );
    const [filter, setFilter] = useState({
        branch: get(user, 'branch._id'),
    });
    const [filterModal, setFilterModal] = useState({});
  const breadcrumbs = useMemo(
    () => [
      {
        id: 1,
        title: t("Продукты"),
        path: "/osgor",
      },
      {
        id: 2,
        title: t("Все продукты"),
        path: "/osgor/list",
      },
    ],
    []
  );
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
    let {data: branches} = useGetAllQuery({
        key: KEYS.branches, url: `${URLS.branches}/list`, params: {
            params: {
                limit: 100
            }
        }
    })
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchName')
    const {mutate: attachRequest, isLoading: isLoadingAttach} = usePostQuery({listKeyId: [KEYS.osgorList,filter]})

    let {refetch:osgorReport} = useGetAllQuery({
        key: KEYS.osgorPortfelReport,
        url: URLS.osgorPortfelReport,
        params: {
            params: {
                branch: includes([config.ROLES.admin], get(user, 'role.name')) ? branch : get(user, 'branch._id'),
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

    const attach = ({data}) => {
        const {attachmentSum,attach} = data;
        attachRequest({
            url: `${URLS.osgorTransactionAttach}?osgor_formId=${get(tr,'osgor_formId')}`,
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

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
  }, []);

  const ModalBody = ({ data, rowId = null }) => (
    <>
      <Field
        name={"name"}
        type={"input"}
        label={"Название продукта"}
        defaultValue={rowId ? get(data, "name") : null}
        params={{ required: true }}
      />
    </>
  );

  return (
    <>
      <GridView
        ModalBody={ModalBody}
        tableHeaderData={[
          {
            id: 2,
            key: "number",
            title: "Номер соглашения",
          },
          {
            id: 3,
            key: "policies[0].seria",
            title: "Policy seria",
          },
          {
            id: 4,
            key: "policies[0].number",
            title: "Policy number",
          },
            {
                id: 41,
                key: "insurant.organization.inn",
                title: "ИНН",
            },
          {
            id: 5,
            key: "insurant",
            title: "Страхователь",
            render: (row) =>
              get(row, "insurant.person")
                ? `${get(row, "insurant.person.fullName.lastname")} ${get(
                    row,
                    "insurant.person.fullName.firstname"
                  )}  ${get(row, "insurant.person.fullName.middlename")}`
                : get(row, "insurant.organization.name"),
          },

          {
            id: 7,
            key: "policies[0].insuranceSum",
            title: "Insurance sum",
            render: (row) => (
              <NumberFormat
                displayType={"text"}
                thousandSeparator={" "}
                value={get(row, "policies[0].insuranceSum")}
              />
            ),
          },
            {
                id: 6,
                key: "policies[0].insurancePremium",
                title: "Insurance premium",
                render: (row) => (
                    <NumberFormat
                        displayType={"text"}
                        thousandSeparator={" "}
                        value={get(row, "policies[0].insurancePremium")}
                    />
                ),
            },
            {
                id: 91,
                key: "contractStartDate",
                title: "Дата начало периода полиса",
            },
            {
                id: 92,
                key: "contractEndDate",
                title: "Дата окончания периода полиса",
            },
            {
                id: 93,
                key: "policies[0].issueDate",
                title: "Дата выдачи полиса",
            },
          {
            id: 8,
            key: "policies[0].insurancePremium",
            title: "Оплачено",
            render: (row) =>
              get(row, "status") == "payed" ? (
                <NumberFormat
                  displayType={"text"}
                  thousandSeparator={" "}
                  value={get(row, "policies[0].insurancePremium")}
                />
              ) : (
                0
              ),
          },
          {
            id: 9,
            key: "status",
            title: "Status",
          },
            {
                id: 10,
                key: "url",
                title: "Скачать",
                render: (row) =><a target={"_blank"}
                                   href={`${get(row,'url','#')}`}><Download
                    className={'cursor-pointer mr-8'}
                    color={'#13D6D1'}/></a>

            },
        ]}
        keyId={[KEYS.osgorList,filter]}
        extraActions={(_tr)=>includes(['new', 'partialPaid','sent'],get(_tr,'attachStatus')) && <DollarSign onClick={()=>setTr(_tr)} size={22} style={{marginLeft:10,cursor:'pointer',color:'#306962'}}/>}
        url={URLS.osgorList}
        listUrl={URLS.osgorList}
        title={t("Osgor agreements list")}
        responseDataKey={"data.docs"}
        viewUrl={"/insurance/osgor/view"}
        createUrl={"/insurance/osgor/create"}
        updateUrl={"/insurance/osgor/update"}
        isHideColumn
        dataKey={"osgor_formId"}
        deleteUrl={URLS.osgorDelete}
        deleteQueryParam={"osgor_formId"}
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
                    <Field label={t('ИНН')} type={'input'}
                           name={'inn'}
                           defaultValue={get(filter, 'inn')}

                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Страхователь')} type={'input'}
                           name={'insurant'}
                           defaultValue={get(filter, 'insurant')}

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
                <Col xs={3}>
                    <Field label={t('Дата начало периода полиса')} type={'datepicker'}
                           name={'startDate'}
                           defaultValue={get(filter, 'startDate')}

                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Дата окончания периода полиса')} type={'datepicker'}
                           name={'endDate'}
                           defaultValue={get(filter, 'endDate')}

                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Дата выдачи полиса')} type={'datepicker'}
                           name={'issueDate'}
                           defaultValue={get(filter, 'issueDate')}

                    />
                </Col>
                <Col xs={3}><Field type={'select'} label={'Status'} name={'status'}
                                   options={[{value: 'new', label: 'new'}, {
                                       value: 'partialPaid',
                                       label: 'partialPaid'
                                   }, {value: 'paid', label: 'paid'}, {value: 'sent', label: 'sent'}]}
                                   defaultValue={get(filter, 'status')}
                /></Col>


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
                            osgorReport()
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
            {transactionId && <Form formRequest={attach} footer={<Button type={'submit'}>{t("Send")}</Button>}>
                <Row className={'mt-15'}>
                    <Col xs={6}>
                        <Field defaultValue={get(tr, 'policies[0].insurancePremium', 0)}
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
