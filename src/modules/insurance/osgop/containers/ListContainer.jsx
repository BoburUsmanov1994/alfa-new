import React, {useEffect, useMemo, useState} from "react";
import { useStore } from "../../../../store";
import {get, includes, isEqual, isNil} from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import { KEYS } from "../../../../constants/key";
import { URLS } from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {DollarSign, Download, FileText, Filter, Trash} from "react-feather";
import config from "../../../../config";
import Modal from "../../../../components/modal";
import {ContentLoader} from "../../../../components/loader";
import Table from "../../../../components/table";
import Checkbox from "rc-checkbox";
import {Col, Row} from "react-grid-system";
import Button from "../../../../components/ui/button";
import Form from "../../../../containers/form/form";
import Pagination from "../../../../components/pagination";
import {Flex} from "@chakra-ui/react";
import {getSelectOptionsListFromData, saveFile} from "../../../../utils";
import {useNavigate} from "react-router-dom";

const ListContainer = () => {
  const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useStore(state => get(state, 'user', null))
    const [filter, setFilter] = useState({
        branch: get(user, 'branch._id'),
    });
    const [tr, setTr] = useState(null);
    const [page, setPage] = useState(1);
    const [branch, setBranch] = useState(null);
    const [transactionId, setTransactionId] = useState(null);

  const setBreadcrumbs = useStore((state) =>
    get(state, "setBreadcrumbs", () => {})
  );
  const breadcrumbs = useMemo(
    () => [
      {
        id: 1,
        title: "ОСГОП",
        path: "/insurance/osgop",
      },
      {
        id: 2,
        title: "ОСГОП",
        path: "/insurance/osgop",
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
                isAvailable:true
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
    const {mutate: attachRequest, isLoading: isLoadingAttach} = usePostQuery({listKeyId: [KEYS.osgopList,filter]})

    const attach = ({data}) => {
        const {attachmentSum,attach} = data;
        attachRequest({
            url: `${URLS.osgopTransactionAttach}?osgop_formId=${get(tr,'osgop_formId')}`,
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
    let {refetch:osgopReport} = useGetAllQuery({
        key: KEYS.osgopPortfelReport,
        url: URLS.osgopPortfelReport,
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
        extraActions={(_tr)=>includes(['new', 'partialPaid','sent'],get(_tr,'attachStatus')) && <DollarSign onClick={()=>setTr(_tr)} size={22} style={{marginLeft:10,cursor:'pointer',color:'#306962'}}/>}
        tableHeaderData={[
          {
            id: 3,
            key: "number",
            title: "Номер соглашения",
          },
            {
                id: 31,
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
                key: "policies[0].number",
                title: "ИНН/ ПИНФЛ",
                render: (row) =>
                    get(row, "insurant.person.passportData.pinfl", get(row, "insurant.organization.inn","-"))
            },
            {
                id: 55,
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
            id: 5,
            key: "owner",
            title: "Собственник",
            render: (row) =>
              get(row, "owner.person")
                ? `${get(row, "owner.person.fullName.lastname")} ${get(
                    row,
                    "owner.person.fullName.firstname"
                  )}  ${get(row, "owner.person.fullName.middlename")}`
                : get(row, "owner.organization.name"),
          },
            {
                id: 51,
                key: "policies[0].objects[0].vehicle.govNumber",
                title: "Гос.номер ТС",
            },

          {
            id: 7,
            key: "sum",
            title: "Insurance sum",
            render: (row) => (
              <NumberFormat
                displayType={"text"}
                thousandSeparator={" "}
                value={get(row, "sum")}
              />
            ),
          },
            {
                id: 6,
                key: "premium",
                title: "Insurance premium",
                render: (row) => (
                    <NumberFormat
                        displayType={"text"}
                        thousandSeparator={" "}
                        value={get(row, "premium")}
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
                title: "Дата вқдачи полис",
            },
            // {
            //     id: 93,
            //     key: "sentDate",
            //     title: "Дата выдачи полиса",
            // },
          {
            id: 8,
            key: "premium",
            title: "Оплачено",
            render: (row) =>
              get(row, "status") == "payed" ? (
                <NumberFormat
                  displayType={"text"}
                  thousandSeparator={" "}
                  value={get(row, "premium")}
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
        keyId={[KEYS.osgopList,filter]}
        url={URLS.osgopList}
        listUrl={`${URLS.osgopList}`}
        title={t("Osgop agreements list")}
        responseDataKey={"data.docs"}
        viewUrl={"/insurance/osgop/view"}
        createUrl={"/insurance/osgop/create"}
        updateUrl={"/insurance/osgop/update"}
        isHideColumn
        dataKey={"osgop_formId"}
        deleteUrl={URLS.osgopDelete}
        deleteParam={"osgop_formId"}
        deleteQueryParam={"osgop_formId"}
        params={{...filter}}
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
                    <Field label={t('ИНН/ ПИНФЛ')} type={'input'}
                           name={'innOrpinfl'}
                           defaultValue={get(filter, 'innOrpinfl')}

                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Страхователь')} type={'input'}
                           name={'insurant'}
                           defaultValue={get(filter, 'insurant')}

                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Собственник')} type={'input'}
                           name={'owner'}
                           defaultValue={get(filter, 'owner')}

                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Гос.номер ТС')} type={'input'}
                           name={'govNumber'}
                           defaultValue={get(filter, 'govNumber')}

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
                    <Field label={t('Дата начало периода')} type={'datepicker'}
                           name={'contractStartDate'}
                           defaultValue={get(filter, 'contractStartDate')}

                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Дата окончания периода')} type={'datepicker'}
                           name={'contractEndDate'}
                           defaultValue={get(filter, 'contractEndDate')}

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
                            osgopReport()
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
