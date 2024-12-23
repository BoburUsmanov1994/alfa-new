import React, { useEffect, useMemo, useState } from "react";
import { find, get, head, isEqual, round, upperCase } from "lodash";
import Panel from "../../../../components/panel";
import Search from "../../../../components/search";
import { Col, Row } from "react-grid-system";
import Section from "../../../../components/section";
import Title from "../../../../components/ui/title";
import Button from "../../../../components/ui/button";
import Form from "../../../../containers/form/form";
import Flex from "../../../../components/flex";
import Field from "../../../../containers/form/field";
import {
  useDeleteQuery,
  useGetAllQuery,
  usePostQuery,
} from "../../../../hooks/api";
import { KEYS } from "../../../../constants/key";
import { URLS } from "../../../../constants/url";
import { getSelectOptionsListFromData } from "../../../../utils";
import { OverlayLoader } from "../../../../components/loader";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../../store";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import CarNumber from "../../../../components/car-number";
import Checkbox from "rc-checkbox";
import Table from "../../../../components/table";

const ViewContainer = ({ application_number = null }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setBreadcrumbs = useStore((state) =>
    get(state, "setBreadcrumbs", () => {})
  );
  const breadcrumbs = useMemo(
    () => [
      {
        id: 1,
        title: "ОСАГО",
        path: "/insurance/osago",
      },
      {
        id: 2,
        title: "ОСАГО",
        path: "/insurance/osago",
      },
    ],
    []
  );

  const [regionId, setRegionId] = useState(null);

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
  }, []);
  let { data, isLoading } = useGetAllQuery({
    key: KEYS.osagoView,
    url: URLS.osagoView,
    params: {
      params: {
        application_number: application_number,
      },
    },
    enabled: !!application_number,
  });

  const { data: filials } = useGetAllQuery({
    key: KEYS.branches,
    url: `${URLS.branches}/list`,
  });
  const filialList = getSelectOptionsListFromData(
    get(filials, `data.data`, []),
    "_id",
    "branchName"
  );

  const { data: insuranceTerms, isLoading: isLoadingInsuranceTerms } =
    useGetAllQuery({
      key: KEYS.osagoInsuranceTerms,
      url: `${URLS.osagoInsuranceTerms}`,
    });
  const insuranceTermsList = getSelectOptionsListFromData(
    get(insuranceTerms, `data`, []),
    "id",
    "name"
  );

  const { data: termCategory, isLoading: isLoadingTermCategory } =
    useGetAllQuery({
      key: KEYS.termCategories,
      url: URLS.termCategories,
    });
  const termCategoryList = getSelectOptionsListFromData(
    get(termCategory, `data`, []),
    "id",
    "name"
  );

  const { data: accidentType, isLoading: isLoadingAccidentType } =
    useGetAllQuery({
      key: KEYS.accidentTypes,
      url: URLS.accidentTypes,
    });
  const accidentTypeList = getSelectOptionsListFromData(
    get(accidentType, `data`, []),
    "id",
    "name"
  );

  const { data: discounts, isLoading: isLoadingDiscount } = useGetAllQuery({
    key: KEYS.discounts,
    url: URLS.discounts,
  });
  const discountList = getSelectOptionsListFromData(
    get(discounts, `data`, []),
    "id",
    "name"
  );

  const { data: region, isLoading: isLoadingRegion } = useGetAllQuery({
    key: KEYS.osagoRegions,
    url: URLS.osagoRegions,
  });
  const regionList = getSelectOptionsListFromData(
    get(region, `data`, []),
    "id",
    "name"
  );

  const { data: genders } = useGetAllQuery({
    key: KEYS.osagoGenders,
    url: URLS.osagoGenders,
  });
  const genderList = getSelectOptionsListFromData(
    get(genders, `data`, []),
    "id",
    "name"
  );

  const { data: residentTypes } = useGetAllQuery({
    key: KEYS.osagoResidentTypes,
    url: URLS.osagoResidentTypes,
  });
  const residentTypeList = getSelectOptionsListFromData(
    get(residentTypes, `data`, []),
    "id",
    "name"
  );

  const { data: vehicleTypes } = useGetAllQuery({
    key: KEYS.osagoVehicleTypes,
    url: URLS.osagoVehicleTypes,
  });
  const vehicleTypeList = getSelectOptionsListFromData(
    get(vehicleTypes, `data`, []),
    "id",
    "name"
  );

  const { data: driverTypes } = useGetAllQuery({
    key: KEYS.driverTypes,
    url: URLS.driverTypes,
  });
  const driverTypeList = getSelectOptionsListFromData(
    get(driverTypes, `data`, []),
    "id",
    "name"
  );

  const { data: relatives } = useGetAllQuery({
    key: KEYS.relatives,
    url: URLS.relatives,
  });
  const relativeList = getSelectOptionsListFromData(
    get(relatives, `data`, []),
    "id",
    "name"
  );

  const { data: district } = useGetAllQuery({
    key: [KEYS.osagoDistricts, regionId],
    url: URLS.osagoDistricts,
    params: {
      params: {
        region: regionId,
      },
    },
    enabled: !!regionId,
  });
  const districtList = getSelectOptionsListFromData(
    get(district, `data`, []),
    "id",
    "name"
  );

  const { data: agents } = useGetAllQuery({
    key: [KEYS.agents],
    url: `${URLS.agents}/list`,
    params: {
      params: {
        branch: null,
      },
    },
  });
  const agentsList = getSelectOptionsListFromData(
    get(agents, `data.data`, []),
    "_id",
    ["organization.nameoforganization", "person.secondname", "person.name"]
  );

  const { mutate: sendFond, isLoading: isLoadingFond } = usePostQuery({
    listKeyId: KEYS.view,
  });
  const { mutate: confirmPayedRequest, isLoading: isLoadingConfirmPayed } =
    usePostQuery({ listKeyId: KEYS.view });

  const { mutate: deleteRequest, isLoading: deleteLoading } = useDeleteQuery({
    listKeyId: KEYS.delete,
  });

  const send = () => {
    sendFond(
      {
        url: `${URLS.send}?application_number=${application_number}`,
        attributes: {},
      },
      {
        onSuccess: ({ data }) => {},
      }
    );
  };

  const confirmPayed = () => {
    confirmPayedRequest(
      {
        url: URLS.confirmPayment,
        attributes: {
          uuid: get(data, "data.uuid"),
          polisUuid: get(head(get(data, "data.policies", [])), "uuid"),
          paidAt: dayjs(
            get(head(get(data, "data.policies", [])), "issueDate")
          ).format("YYYY-MM-DD HH:mm:ss"),
          insurancePremium: get(
            head(get(data, "data.policies", [])),
            "insurancePremium"
          ),
          startDate: get(head(get(data, "data.policies", [])), "startDate"),
          endDate: get(head(get(data, "data.policies", [])), "endDate"),
        },
      },
      {
        onSuccess: ({ data }) => {},
      }
    );
  };

  const remove = () => {
    Swal.fire({
      position: "center",
      icon: "error",
      backdrop: "rgba(0,0,0,0.9)",
      background: "none",
      title: t("Are you sure?"),
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#13D6D1",
      confirmButtonText: t("Delete"),
      cancelButtonText: t("Cancel"),
      customClass: {
        title: "title-color",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRequest(
          { url: `${URLS.delete}?application_number=${application_number}` },
          {
            onSuccess: () => {
              navigate("/osaga");
            },
          }
        );
      }
    });
  };

  if (
    isLoading ||
    isLoadingAccidentType ||
    isLoadingTermCategory ||
    isLoadingRegion ||
    isLoadingInsuranceTerms ||
    isLoadingDiscount
  ) {
    return <OverlayLoader />;
  }

  return (
    <>
      {(isLoadingFond || deleteLoading || isLoadingConfirmPayed) && (
        <OverlayLoader />
      )}
      <Panel>
        <Row>
          <Col xs={12}>
            <Search />
          </Col>
        </Row>
      </Panel>
      <Section>
        <Row>
          <Col xs={12}>
            <Title>{t("Параметры полиса")}</Title>
          </Col>
        </Row>
        <Form
          footer={
            !isEqual(get(data, "data.status"), "payed") && (
              <Flex className={"mt-32"}>
                {(isEqual(get(data, "data.status"), "new") ||
                  isEqual(get(data, "data.status"), "edited")) && (
                  <>
                    <Button
                      onClick={remove}
                      danger
                      type={"button"}
                      className={"mr-16"}>
                      {t("Удалить")}
                    </Button>
                    <Button
                      onClick={() =>
                        navigate(`/osgor/update/${application_number}`)
                      }
                      yellow
                      type={"button"}
                      className={"mr-16"}>
                      {t("Изменить")}
                    </Button>
                  </>
                )}
                <Button
                  onClick={
                    isEqual(get(data, "data.status"), "new") ||
                    isEqual(get(data, "data.status"), "edited")
                      ? () => send()
                      : () => {}
                  }
                  gray={
                    !(
                      isEqual(get(data, "data.status"), "new") ||
                      isEqual(get(data, "data.status"), "edited")
                    )
                  }
                  type={"button"}
                  className={"mr-16"}>
                 {t("Отправить в Фонд")}
                </Button>
                <Button
                  onClick={
                    isEqual(get(data, "data.status"), "sent")
                      ? () => confirmPayed()
                      : () => {}
                  }
                  type={"button"}
                  gray={!isEqual(get(data, "data.status"), "sent")}
                  className={"mr-16"}>
                  {t("Подтвердить оплату")}
                </Button>
              </Flex>
            )
          }>
          <Row gutterWidth={60} className={"mt-32"}>
            <Col xs={4} style={{ borderRight: "1px solid #DFDFDF" }}>
              <Row align={"center"} className={"mb-25"}>
                <Col xs={5}>{t("Status")}</Col>
                <Col xs={7}>
                  <Button green>{get(data, "data.status")}</Button>
                </Col>
              </Row>
              <Row align={"center"} className={"mb-25"}>
                <Col xs={5}>{t("Филиал")} </Col>
                <Col xs={7}>
                  <Field
                    disabled
                    defaultValue={get(data, "data.branch")}
                    label={t("Filial")}
                    params={{ required: true }}
                    options={filialList}
                    property={{ hideLabel: true }}
                    type={"select"}
                    name={"agencyId"}
                  />
                </Col>
              </Row>

              {/*<Row align={'center'} className={'mb-25'}>*/}
              {/*    <Col xs={5}>Наличие страховых случаев:</Col>*/}
              {/*    <Col xs={7}><Field options={accidentTypeList} defaultValue={get(data, 'data.agencyId')} params={{required: true}}*/}
              {/*                       label={'Accident type'} property={{hideLabel: true}}*/}
              {/*                       type={'select'}*/}
              {/*                       name={'accident'}/></Col>*/}
              {/*</Row>*/}
            </Col>
            <Col xs={4}>
              <Row align={"center"} className={"mb-25"}>
                <Col xs={5}>{t("Страховая сумма:")} </Col>
                <Col xs={7}>
                  <Field
                    defaultValue={get(data, "data.cost.sumInsured")}
                    property={{ hideLabel: true, disabled: true }}
                    type={"number-format-input"}
                    name={"policies[0].insuranceSum"}
                  />
                </Col>
              </Row>
              <Row align={"center"} className={"mb-25"}>
                <Col xs={5}>{t("Страховая премия:")} </Col>
                <Col xs={7}>
                  <Field
                    defaultValue={get(data, "data.cost.insurancePremium")}
                    property={{ hideLabel: true, disabled: true }}
                    type={"number-format-input"}
                    name={"policies[0].insurancePremium"}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={4}>
              <Row align={"center"} className={"mb-25"}>
                <Col xs={5}>{t("Дата начала покрытия")}: </Col>
                <Col xs={7}>
                  <Field
                    disabled
                    defaultValue={get(data, "data.details.startDate")}
                    params={{ required: true }}
                    property={{ hideLabel: true }}
                    type={"datepicker"}
                    name={"details.startDate"}
                  />
                </Col>
              </Row>
              <Row align={"center"} className={"mb-25"}>
                <Col xs={5}>{t("Дача окончания покрытия")}: </Col>
                <Col xs={7}>
                  <Field
                    disabled
                    defaultValue={get(data, "data.details.endDate")}
                    property={{ hideLabel: true }}
                    type={"datepicker"}
                    name={"details.endDate"}
                  />
                </Col>
              </Row>
              <Row align={"center"} className={"mb-25"}>
                <Col xs={5}>{t("Дата выдачи полиса")}: </Col>
                <Col xs={7}>
                  <Field
                    disabled
                    defaultValue={get(data, "data.details.issueDate")}
                    property={{ hideLabel: true }}
                    type={"datepicker"}
                    name={"details.issueDate"}
                  />
                </Col>
              </Row>
              {/*<Row align={'center'} className={'mb-25'}>*/}
              {/*    <Col xs={5}>Наличие льгот:</Col>*/}
              {/*    <Col xs={7}><Field options={discountList} params={{required: true}}*/}
              {/*                       label={'Discounts'} property={{hideLabel: true}}*/}
              {/*                       type={'select'}*/}
              {/*                       name={'discount'}/></Col>*/}
              {/*</Row>*/}
            </Col>
          </Row>
          <Row gutterWidth={60} className={"mt-30"}>
            <Col xs={12} className={"mb-25"}>
              <Title>{t("Транспортное средство")}</Title>
            </Col>
            <Col xs={4} style={{ borderRight: "1px solid #DFDFDF" }}>
              <div className={"mb-15"}>{t("Государственный номер")}</div>
              <div className={"mb-25"}>
                <CarNumber
                  disabled
                  defaultValue={get(data, "data.vehicle.govNumber")}
                  getGovNumber={() => {}}
                />
              </div>
              <Row align={"center"} className={"mb-25"}>
                <Col xs={5}>{t("Серия тех.паспорта")}:</Col>
                <Col xs={7}>
                  <Field
                    defaultValue={get(data, "data.vehicle.techPassport.seria")}
                    property={{ hideLabel: true, disabled: true }}
                    type={"input"}
                    name={"vehicle.techPassport.seria"}
                  />
                </Col>
              </Row>
              <Row align={"center"} className={"mb-25"}>
                <Col xs={5}>{t("Номер тех.паспорта")}:</Col>
                <Col xs={7}>
                  <Field
                    defaultValue={get(data, "data.vehicle.techPassport.number")}
                    property={{ hideLabel: true, disabled: true }}
                    type={"input"}
                    name={"vehicle.techPassport.number"}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={8}>
              <Row>
                <Col xs={4} className="mb-25">
                  <Field
                    disabled
                    defaultValue={get(data, "data.vehicle.regionId")}
                    options={regionList}
                    params={{ required: true }}
                    label={t("Территория пользования")}
                    type={"select"}
                    name={"vehicle.regionId"}
                  />
                </Col>
                <Col xs={4} className="mb-25">
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(data, "data.vehicle.modelCustomName")}
                    params={{ required: true }}
                    label={t("Марка / модель")}
                    type={"input"}
                    name={"vehicle.modelCustomName"}
                  />
                </Col>
                <Col xs={4} className="mb-25">
                  <Field
                    disabled
                    defaultValue={get(data, "data.vehicle.typeId")}
                    options={vehicleTypeList}
                    params={{ required: true }}
                    label={t("Вид транспорта")}
                    type={"select"}
                    name={"vehicle.typeId"}
                  />
                </Col>
                <Col xs={4} className="mb-25">
                  <Field
                    disabled
                    defaultValue={get(data, "data.vehicle.issueYear")}
                    property={{ mask: "9999", maskChar: "_" }}
                    params={{ required: true }}
                    label={t("Год")}
                    type={"input-mask"}
                    name={"vehicle.issueYear"}
                  />
                </Col>
                <Col xs={4} className="mb-25">
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(data, "data.vehicle.bodyNumber")}
                    params={{ required: true }}
                    label={t("Номер кузова (шасси)")}
                    type={"input"}
                    name={"vehicle.bodyNumber"}
                  />
                </Col>
                <Col xs={4} className="mb-25">
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(data, "data.vehicle.engineNumber")}
                    params={{ required: true }}
                    label={t("Номер двигателя")}
                    type={"input"}
                    name={"vehicle.engineNumber"}
                  />
                </Col>
                <Col xs={4} className="mb-25">
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(data, "data.vehicle.fullWeight")}
                    params={{ required: true }}
                    label={t("Объем")}
                    type={"input"}
                    name={"vehicle.fullWeight"}
                  />
                </Col>
                <Col xs={4} className="mb-25">
                  <Field
                    disabled
                    defaultValue={get(
                      data,
                      "data.vehicle.techPassport.issueDate"
                    )}
                    params={{ required: true }}
                    label={t("Дата выдачи тех.паспорта")}
                    type={"datepicker"}
                    name={"vehicle.techPassport.issueDate"}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutterWidth={60} className={"mt-30"}>
            <Col xs={12} className={"mb-25"}>
              <Title>{t("Собственник")} </Title>
            </Col>
            <Col xs={12}>
              <Row>
                <Col xs={4}>
                  <Flex>
                    <h4 className={"mr-16"}>{t("Собственник")} </h4>
                    <Button
                      gray={!get(data, "data.owner.person")}
                      className={"mr-16"}
                      type={"button"}>
                      {t("Физ. лицо")}
                    </Button>
                    <Button
                      gray={!get(data, "data.owner.organization")}
                      type={"button"}>
                      {t("Юр. лицо")}
                    </Button>
                  </Flex>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <hr className={"mt-15 mb-15"} />
            </Col>
            {get(data, "data.owner.person") && (
              <>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(
                      data,
                      "data.owner.person.fullName.firstname"
                    )}
                    label={t("Firstname")}
                    type={"input"}
                    name={"owner.person.fullName.firstname"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(
                      data,
                      "data.owner.person.fullName.lastname"
                    )}
                    label={t("Lastname")}
                    type={"input"}
                    name={"owner.person.fullName.lastname"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(
                      data,
                      "data.owner.person.fullName.middlename"
                    )}
                    label={t("Middlename")}
                    type={"input"}
                    name={"owner.person.fullName.middlename"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(
                      data,
                      "data.owner.person.passportData.pinfl"
                    )}
                    label={t("ПИНФЛ")}
                    type={"input"}
                    name={"owner.person.passportData.pinfl"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    params={{ required: true }}
                    property={{
                      mask: "aa",
                      placeholder: "AA",
                      maskChar: "_",
                    }}
                    defaultValue={get(
                      data,
                      "data.owner.person.passportData.seria"
                    )}
                    label={t("Passport seria")}
                    type={"input-mask"}
                    name={"owner.person.passportData.seria"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    params={{ required: true }}
                    property={{
                      mask: "9999999",
                      placeholder: "1234567",
                      maskChar: "_",
                    }}
                    defaultValue={get(
                      data,
                      "data.owner.person.passportData.number"
                    )}
                    label={t("Passport number")}
                    type={"input-mask"}
                    name={"owner.person.passportData.number"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    params={{ required: true }}
                    defaultValue={get(data, "data.owner.person.issueDate")}
                    label={t("Issue date")}
                    type={"datepicker"}
                    name={"owner.person.passportData.issueDate"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(
                      data,
                      "data.owner.person.passportData.issuedBy"
                    )}
                    label={t("Issued by")}
                    type={"input"}
                    name={"owner.person.passportData.issuedBy"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    params={{ required: true }}
                    defaultValue={get(data, "data.owner.person.birthDate")}
                    label={t("Birth date")}
                    type={"datepicker"}
                    name={"owner.person.birthDate"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    defaultValue={get(data, "data.owner.person.gender")}
                    options={genderList}
                    label={t("Gender")}
                    type={"select"}
                    name={"owner.person.gender"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(
                      data,
                      "data.owner.person.birthCountryCode"
                    )}
                    label={t("Country")}
                    type={"input"}
                    name={"owner.person.birthCountryCode"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    params={{ required: true }}
                    options={regionList}
                    defaultValue={get(data, "data.owner.person.regionId")}
                    label={t("Region")}
                    type={"select"}
                    name={"owner.person.regionId"}
                  />
                </Col>
                {/*<Col xs={3} className={'mb-25'}>*/}
                {/*    <Field*/}
                {/*        disabled*/}
                {/*        params={{required: true}}*/}
                {/*        options={districtList}*/}
                {/*        defaultValue={get(data,'data.owner.person.districtId')}*/}
                {/*        label={'District'}*/}
                {/*        type={'select'}*/}
                {/*        name={'owner.person.districtId'}/>*/}
                {/*</Col>*/}
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    options={residentTypeList}
                    defaultValue={get(data, "data.owner.person.residentType")}
                    label={t("Resident type")}
                    type={"select"}
                    name={"owner.person.residentType"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    label={t("Address")}
                    type={"input"}
                    defaultValue={get(data, "data.owner.person.address")}
                    name={"owner.person.address"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(data, "data.owner.person.phone")}
                    label={t("Phone")}
                    type={"input"}
                    name={"owner.person.phone"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(data, "data.owner.person.email")}
                    label={t("Email")}
                    type={"input"}
                    name={"owner.person.email"}
                  />
                </Col>
              </>
            )}
            {isEqual(data, "data.owner") && (
              <>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    params={{ required: true }}
                    label={t("Inn")}
                    defaultValue={get(data, "data.owner.organization.inn")}
                    property={{
                      mask: "999999999",
                      placeholder: "Inn",
                      maskChar: "_",
                    }}
                    name={"owner.organization.inn"}
                    type={"input-mask"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(data, "data.owner.organization.name")}
                    label={t("Name")}
                    type={"input"}
                    name={"owner.organization.name"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(
                      data,
                      "data.owner.organization.representativeName"
                    )}
                    label={t("Руководитель")}
                    type={"input"}
                    name={"owner.organization.representativeName"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(data, "data.owner.organization.position")}
                    label={t("Должность")}
                    type={"input"}
                    name={"owner.organization.position"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(data, "data.owner.organization.phone")}
                    params={{ required: true }}
                    label={t("Phone")}
                    type={"input"}
                    name={"owner.organization.phone"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(data, "data.owner.organization.email")}
                    label={t("Email")}
                    type={"input"}
                    name={"owner.organization.email"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(
                      data,
                      "data.owner.organization.checkingAccount"
                    )}
                    label={t("Расчетный счет")}
                    type={"input"}
                    name={"owner.organization.checkingAccount"}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    disabled
                    defaultValue={get(
                      data,
                      "data.owner.organization.checkingAccount"
                    )}
                    label={t("Область")}
                    params={{ required: true }}
                    options={regionList}
                    type={"select"}
                    name={"owner.organization.regionId"}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    disabled
                    defaultValue={get(
                      data,
                      "data.owner.organization.checkingAccount"
                    )}
                    label={t("Форма собственности")}
                    params={{ required: true }}
                    options={[]}
                    type={"select"}
                    name={"owner.organization.ownershipFormId"}
                  />
                </Col>
              </>
            )}
            <Col xs={12} className={"mt-15"}>
              <Checkbox
                disabled
                checked={get(data, "data.owner.applicantIsOwner")}
                className={"mr-5"}
              />
              <strong>{t("Собственник является Заявителем")}</strong>
            </Col>
          </Row>
          <Row gutterWidth={60} className={"mt-30"}>
            <Col xs={12} className={"mb-25"}>
              <Title>{t("Заявитель")} </Title>
            </Col>
            <Col xs={12}>
              <Row>
                <Col xs={12}>
                  <Flex>
                    <h4 className={"mr-16"}>{t("Заявитель")} </h4>
                    <Button
                      gray={!get(data, "data.applicant.person")}
                      className={"mr-16"}
                      type={"button"}>
                      {t("Физ. лицо")}
                    </Button>
                    <Button
                      gray={!get(data, "data.applicant.organization")}
                      type={"button"}>
                      {t("Юр. лицо")}
                    </Button>
                  </Flex>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <hr className={"mt-15 mb-15"} />
            </Col>
            {get(data, "data.applicant.person") && (
              <>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(
                      data,
                      "data.applicant.person.fullName.firstname"
                    )}
                    label={t("Firstname")}
                    type={"input"}
                    name={"applicant.person.fullName.firstname"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(
                      data,
                      "data.applicant.person.fullName.lastname"
                    )}
                    label={t("Lastname")}
                    type={"input"}
                    name={"applicant.person.fullName.lastname"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(
                      data,
                      "data.applicant.person.fullName.middlename"
                    )}
                    label={t("Middlename")}
                    type={"input"}
                    name={"applicant.person.fullName.middlename"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    params={{ required: true }}
                    property={{ disabled: true }}
                    defaultValue={get(
                      data,
                      "data.applicant.person.passportData.pinfl"
                    )}
                    label={t("ПИНФЛ")}
                    type={"input"}
                    name={"applicant.person.passportData.pinfl"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    params={{ required: true }}
                    property={{
                      mask: "aa",
                      placeholder: "AA",
                      maskChar: "_",
                    }}
                    defaultValue={get(
                      data,
                      "data.applicant.person.passportData.seria"
                    )}
                    label={t("Passport seria")}
                    type={"input-mask"}
                    name={"applicant.person.passportData.seria"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    params={{ required: true }}
                    property={{
                      mask: "9999999",
                      placeholder: "1234567",
                      maskChar: "_",
                    }}
                    defaultValue={get(
                      data,
                      "data.applicant.person.passportData.number"
                    )}
                    label={t("Passport number")}
                    type={"input-mask"}
                    name={"applicant.person.passportData.number"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    defaultValue={get(
                      data,
                      "data.applicant.person.passportData.issueDate"
                    )}
                    params={{ required: true }}
                    label={t("Issue date")}
                    type={"datepicker"}
                    name={"applicant.person.passportData.issueDate"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    params={{ required: true }}
                    defaultValue={get(
                      data,
                      "data.applicant.person.passportData.issuedBy"
                    )}
                    label={t("Issued by")}
                    type={"input"}
                    name={"applicant.person.passportData.issuedBy"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    defaultValue={get(data, "data.applicant.person.birthDate")}
                    label={t("Birth date")}
                    type={"datepicker"}
                    name={"applicant.person.birthDate"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    defaultValue={get(data, "data.applicant.person.gender")}
                    options={genderList}
                    label={t("Gender")}
                    type={"select"}
                    name={"applicant.person.gender"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(
                      data,
                      "data.applicant.person.birthCountryCode"
                    )}
                    label={t("Country")}
                    type={"input"}
                    name={"applicant.person.birthCountryCode"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    options={regionList}
                    defaultValue={get(data, "data.applicant.person.regionId")}
                    label={t("Region")}
                    type={"select"}
                    name={"applicant.person.regionId"}
                  />
                </Col>

                <Col xs={3} className={"mb-25"}>
                  <Field
                    disabled
                    options={residentTypeList}
                    defaultValue={get(
                      data,
                      "data.applicant.person.residentType"
                    )}
                    label={t("Resident type")}
                    type={"select"}
                    name={"applicant.person.residentType"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(data, "data.applicant.person.districtId")}
                    label={t("Address")}
                    type={"input"}
                    name={"applicant.person.address"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(
                      data,
                      "data.applicant.person.phoneNumber"
                    )}
                    label={t("Phone")}
                    type={"input"}
                    name={"applicant.person.phoneNumber"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(data, "data.applicant.person.email")}
                    label={t("Email")}
                    type={"input"}
                    name={"applicant.person.email"}
                  />
                </Col>
              </>
            )}
            {get(data, "data.applicant.organization") && (
              <>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    params={{ required: true }}
                    label={t("Inn")}
                    defaultValue={get(data, "data.applicant.person.inn")}
                    property={{
                      mask: "999999999",
                      placeholder: "Inn",
                      maskChar: "_",
                    }}
                    name={"applicant.organization.inn"}
                    type={"input-mask"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    params={{ required: true }}
                    defaultValue={get(data, "data.applicant.person.name")}
                    label={t("Наименование")}
                    type={"input"}
                    name={"applicant.organization.name"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    label={t("Руководитель")}
                    type={"input"}
                    name={"applicant.organization.representativeName"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    label={t("Должность")}
                    type={"input"}
                    name={"applicant.organization.position"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(
                      data,
                      "data.applicant.organization.phone"
                    )}
                    params={{ required: true }}
                    label={t("Телефон")}
                    type={"input"}
                    name={"applicant.organization.phone"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    property={{ disabled: true }}
                    defaultValue={get(
                      data,
                      "data.applicant.organization.email"
                    )}
                    label={t("Email")}
                    type={"input"}
                    name={"applicant.organization.email"}
                  />
                </Col>
                <Col xs={3} className={"mb-25"}>
                  <Field
                    label={t("Расчетный счет")}
                    type={"input"}
                    name={"applicant.organization.checkingAccount"}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    label={t("Область")}
                    params={{ required: true }}
                    options={regionList}
                    type={"select"}
                    name={"applicant.organization.regionId"}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    label={t("Форма собственности")}
                    params={{ required: true }}
                    options={[]}
                    type={"select"}
                    name={"applicant.organization.ownershipFormId"}
                  />
                </Col>
              </>
            )}
          </Row>
          <Row gutterWidth={60} className={"mt-30"}>
            <Col xs={12} className={"mb-25"}>
              <Title>{t("Водители / Родственники")}</Title>
            </Col>
            <Col xs={12}>
              <div className={"horizontal-scroll "}>
                <Table
                  bordered
                  hideThead={false}
                  thead={[
                    "Фамилия ",
                    "Имя",
                    "Отчество",
                    "Сария паспорта",
                    "Номер паспорта",
                    "Pinfl",
                    "Дата паспорта",
                    "Серия вод.удостоверения",
                    "Номер вод.удостоверения",
                    "Дата вод.удостоверения",
                    "Степень родства",
                  ]}>
                  {get(data, "data.drivers", []).map((item, index) => (
                    <tr>
                      <td>{get(item, "fullName.lastname")}</td>
                      <td>{get(item, "fullName.firstname")}</td>
                      <td>{get(item, "fullName.middlename")}</td>
                      <td>{upperCase(get(item, "passportData.seria", ""))}</td>
                      <td>{get(item, "passportData.number")}</td>
                      <td>{get(item, "passportData.pinfl")}</td>
                      <td>{get(item, "passportData.issueDate")}</td>
                      <td>{get(item, "licenseSeria")}</td>
                      <td>{get(item, "licenseNumber")}</td>
                      <td>{get(item, "licenseIssueDate")}</td>
                      <td>
                        {get(
                          find(
                            relativeList,
                            (r) => get(r, "value") == get(item, "relative")
                          ),
                          "label"
                        )}
                      </td>
                    </tr>
                  ))}
                </Table>
              </div>
            </Col>
          </Row>
          <Row gutterWidth={60} className={"mt-30"}>
            <Col xs={12} className={"mb-25"}>
              <Title>{t("Агентсткое вознограждение и РПМ")}</Title>
            </Col>
            <Col xs={6}>
              <Row>
                <Col xs={12} className={"mb-25"}>
                  <Field
                    disabled
                    defaultValue={get(data, "data.agent")}
                    options={[...agentsList]}
                    label={t("Агент")}
                    type={"select"}
                    name={"agentId"}
                  />
                </Col>

                <Col xs={6} className={"mb-25"}>
                  <Field
                    params={{ required: true }}
                    property={{ type: "number", disabled: true }}
                    defaultValue={20}
                    label={t("Вознограждение %")}
                    type={"input"}
                    name={"agentReward"}
                  />
                </Col>
                <Col xs={6} className={"mb-25"}>
                  <Field
                    params={{ required: true }}
                    defaultValue={5}
                    property={{ disabled: true }}
                    label={t("Отчисления в РПМ  %")}
                    type={"input"}
                    name={"rpmPercent"}
                  />
                </Col>
                <Col xs={6} className={"mb-25"}>
                  <Field
                    defaultValue={round(
                      (get(data, "data.agentReward", 20) *
                        get(data, "data.cost.insurancePremium", 0)) /
                        100,
                      2
                    )}
                    property={{ disabled: true }}
                    label={t("Сумма")}
                    type={"number-format-input"}
                    name={"rewardSum"}
                  />
                </Col>
                <Col xs={6} className={"mb-25"}>
                  <Field
                    defaultValue={round(
                      (5 * get(data, "data.cost.insurancePremium", 0)) / 100,
                      2
                    )}
                    property={{ disabled: true }}
                    label={t("Сумма")}
                    type={"number-format-input"}
                    name={"rpmSum"}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Section>
    </>
  );
};

export default ViewContainer;
