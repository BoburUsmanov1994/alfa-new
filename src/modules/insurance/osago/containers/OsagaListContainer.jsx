import React, {useEffect, useMemo, useState} from "react";
import { useStore } from "../../../../store";
import {get, includes} from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import { KEYS } from "../../../../constants/key";
import { URLS } from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import Form from "../../../../containers/form/form";
import {useNavigate} from "react-router-dom";
import {useGetAllQuery} from "../../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../../utils";
import {Col, Row} from "react-grid-system";
import Button from "../../../../components/ui/button";
import {Filter, Trash} from "react-feather";
import Flex from "../../../../components/flex";
import config from "../../../../config";

const ListContainer = () => {
  const { t } = useTranslation();
    const user = useStore(state => get(state, 'user', null))
  const setBreadcrumbs = useStore((state) =>
    get(state, "setBreadcrumbs", () => {})
  );
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
  const breadcrumbs = useMemo(
    () => [
      {
        id: 1,
        title: "ОСАГО",
        path: "insurance/osago",
      },
      {
        id: 2,
        title: "ОСАГО",
        path: "insurance/osago",
      },
    ],
    []
  );

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
            id: 3,
            key: "seria",
            title: "Policy seria",
          },
          {
            id: 4,
            key: "number",
            title: "Policy number",
          },
          {
            id: 5,
            key: "owner",
            title: "Owner",
            render: (row) =>
              get(row, "owner.applicantIsOwner")
                ? get(row, "applicant.person")
                  ? `${get(row, "applicant.person.fullName.lastname")} ${get(
                      row,
                      "applicant.person.fullName.firstname"
                    )}  ${get(row, "applicant.person.fullName.middlename")}`
                  : get(row, "applicant.organization.name")
                : get(row, "owner.person")
                ? `${get(row, "owner.person.fullName.lastname")} ${get(
                    row,
                    "owner.person.fullName.firstname"
                  )}  ${get(row, "owner.person.fullName.middlename")}`
                : get(row, "owner.organization.name"),
          },
          {
            id: 55,
            key: "applicant",
            title: "Applicant",
            render: (row) =>
              get(row, "applicant.person")
                ? `${get(row, "applicant.person.fullName.lastname")} ${get(
                    row,
                    "applicant.person.fullName.firstname"
                  )}  ${get(row, "applicant.person.fullName.middlename")}`
                : get(row, "applicant.organization.name"),
          },
          {
            id: 44,
            key: "vehicle",
            title: "Vehicle",
            render: (row) => get(row, "vehicle.modelCustomName"),
          },
          {
            id: 6,
            key: "cost.insurancePremium",
            title: "Insurance premium",
            render: (row) => (
              <NumberFormat
                displayType={"text"}
                thousandSeparator={" "}
                value={get(row, "cost.insurancePremium")}
              />
            ),
          },
          {
            id: 7,
            key: "cost.sumInsured",
            title: "Insurance sum",
            render: (row) => (
              <NumberFormat
                displayType={"text"}
                thousandSeparator={" "}
                value={get(row, "cost.sumInsured")}
              />
            ),
          },
          {
            id: 8,
            key: "cost.insurancePremiumPaidToInsurer",
            title: "Оплачено",
            render: (row) =>
              get(row, "status") == "payed" ? (
                <NumberFormat
                  displayType={"text"}
                  thousandSeparator={" "}
                  value={get(row, "cost.insurancePremiumPaidToInsurer")}
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
        ]}
        keyId={[KEYS.osagoList,filter]}
        url={URLS.osagoList}
        listUrl={`${URLS.osagoList}`}
        deleteKey={`${URLS.osagoDelete}`}
        title={t("ОСАГО")}
        responseDataKey={"data.docs"}
        viewUrl={"/insurance/osago/view"}
        createUrl={"/insurance/osago/create"}
        updateUrl={"/insurance/osago/update"}
        isHideColumn
        dataKey={"application_number"}
        params={{...filter}}
        deleteUrl={URLS.osagoDelete}
        extraFilters={<Form formRequest={({data: {group, subGroup, ...rest} = {}}) => {
            setFilter(rest);
        }}
                            mainClassName={'mt-15'}>

            {() => <Row align={'flex-end'}>
                <Col xs={3}>
                    <Field label={t('Страховая премия')} type={'number-format-input'}
                           name={'insurancePremium'}
                           defaultValue={get(filter, 'insurancePremium', null)}
                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Страховая сумма')} type={'number-format-input'}
                           name={'sumInsured'}
                           defaultValue={get(filter, 'sumInsured', null)}
                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Оплачено')} type={'number-format-input'}
                           name={'sumInsured'}
                           defaultValue={get(filter, 'insurancePremiumPaidToInsurer', null)}
                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Транспортное средство')} type={'input'}
                           name={'modelCustomName'}
                           defaultValue={get(filter, 'modelCustomName')}

                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Applicant')} type={'input'}
                           name={'applicant'}
                           defaultValue={get(filter, 'applicant')}

                    />
                </Col>

                <Col xs={3}><Field type={'select'} label={'Status'} name={'status'}
                                   options={[{value: 'new', label: 'new'},{value: 'payed', label: 'paid'}]}
                                   defaultValue={get(filter, 'status')}
                /></Col>
                <Col xs={3}>
                    <Field label={t('Серия полиса')}
                           name={'seria'}
                           defaultValue={get(filter, 'seria')}

                    />
                </Col>
                <Col xs={3}>
                    <Field label={t('Номер полиса')}
                           name={'number'}
                           defaultValue={get(filter, 'number')}

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
