import dayjs from "dayjs";
import { find, get, includes, isEqual, isNil, setWith,isArray } from "lodash";
import React, { useState } from "react";
import { Trash2 } from "react-feather";
import { Col, Row } from "react-grid-system";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Flex from "../../../components/flex";
import { OverlayLoader } from "../../../components/loader";
import Panel from "../../../components/panel";
import Search from "../../../components/search";
import Section from "../../../components/section";
import Table from "../../../components/table";
import Button from "../../../components/ui/button";
import Title from "../../../components/ui/title";
import { PERSON_TYPE } from "../../../constants";
import { KEYS } from "../../../constants/key";
import { URLS } from "../../../constants/url";
import Field from "../../../containers/form/field";
import Form from "../../../containers/form/form";
import { useGetAllQuery, usePostQuery } from "../../../hooks/api";
import { useSettingsStore } from "../../../store";
import { getSelectOptionsListFromData } from "../../../utils";

const AgentsCreateContainer = () => {
  const [tarif, setTarif] = useState({});
  const [tariffList, setTariffList] = useState([]);
  const navigate = useNavigate();
  const [productGroupId, setProductGroupId] = useState(null);
  const [productSubGroupId, setProductSubGroupId] = useState(null);
  const [productId, setProductId] = useState(null);
  const { t } = useTranslation();
  const [personType, setPersonType] = useState(null);
  const [region, setregion] = useState(null);
  const setPersonTypeForSelect = (val, name) => {
    if (isEqual(name, "typeofpersons")) {
      setPersonType(val);
    }
    if (isEqual(name, "organization.region")) {
      setregion(val);
    }
    if (isEqual(name, "person.region")) {
      setregion(val);
    }
  };
  let {data: groups} = useGetAllQuery({key: KEYS.groupsofproducts, url: `${URLS.groupsofproducts}/list`})
  groups = getSelectOptionsListFromData(get(groups, `data.data`, []), '_id', 'name')

  let {data: subGroups} = useGetAllQuery({
    key: [KEYS.subgroupsofproductsFilter, productGroupId],
    url: URLS.subgroupsofproductsFilter,
    params: {
      params: {
        group: productGroupId
      }
    },
    enabled: !!productGroupId
  })
  subGroups = getSelectOptionsListFromData(get(subGroups, `data.data`, []), '_id', 'name')
  let {data: productsList} = useGetAllQuery({
    key: [KEYS.productsfilter, productSubGroupId],
    url: URLS.products,
    params: {
      params: {
        subGroup: productSubGroupId
      }
    },
    enabled: !!productSubGroupId
  })
  const product = useSettingsStore((state) => get(state, "product", {}));
  let { data: branches } = useGetAllQuery({
    key: KEYS.branches,
    url: `${URLS.branches}/list`,
  });
  branches = getSelectOptionsListFromData(
    get(branches, `data.data`, []),
    "_id",
    "branchName"
  );

  let { data: citizenshipList } = useGetAllQuery({
    key: KEYS.residentType,
    url: `${URLS.residentType}`,
  });
  citizenshipList = getSelectOptionsListFromData(
    get(citizenshipList, `data.data`, []),
    "_id",
    "name"
  );

  let { data: documentTypeList } = useGetAllQuery({
    key: KEYS.documentType,
    url: `${URLS.documentType}/list`,
  });
  documentTypeList = getSelectOptionsListFromData(
    get(documentTypeList, `data.data`, []),
    "_id",
    "name"
  );

  let { data: regions } = useGetAllQuery({
    key: KEYS.regions,
    url: `${URLS.regions}/list`,
  });
  regions = getSelectOptionsListFromData(
    get(regions, `data.data`, []),
    "_id",
    "name"
  );

  let { data: agentTypes } = useGetAllQuery({
    key: KEYS.typeofagent,
    url: `${URLS.typeofagent}/list`,
  });
  agentTypes = getSelectOptionsListFromData(
    get(agentTypes, `data.data`, []),
    "_id",
    "name"
  );

  let { data: genders } = useGetAllQuery({
    key: KEYS.genders,
    url: `${URLS.genders}/list`,
  });
  genders = getSelectOptionsListFromData(
    get(genders, `data.data`, []),
    "_id",
    "name"
  );

  let { data: employeeList } = useGetAllQuery({
    key: KEYS.employee,
    url: `${URLS.employee}/list`,
  });
  employeeList = getSelectOptionsListFromData(
    get(employeeList, `data.data`, []),
    "_id",
    "fullname"
  );

  let { data: districts } = useGetAllQuery({
    key: KEYS.districtsByRegion,
    url: `${URLS.districts}/list`,
    params: {
      params: {
        region,
      },
    },
    enabled: !!region,
  });
  districts = getSelectOptionsListFromData(
    get(districts, `data.data`, []),
    "_id",
    "name"
  );

  //

  let products = getSelectOptionsListFromData(
    get(productsList, `data.data`, []),
    "_id",
    ["name"]
  );

  let { data: classes } = useGetAllQuery({
    key: KEYS.classes,
    url: `${URLS.insuranceClass}/list`,
  });
  const classOptions = getSelectOptionsListFromData(
    get(classes, `data.data`, []),
    "_id",
    "name"
  );

  const setFieldValue = (value, name = "") => {
    if (
      includes(
        [
          "tariff[0].product",
          "tariff[0].allowAgreement",
          "tariff[0].limitOfAgreement",
        ],
        name
      )
    ) {
      setTarif((prev) => ({ ...prev, [name]: value }));
    }

    if (includes(name, "tariff[0].tariffPerClass")) {
      setTarif({ ...setWith(tarif, name, value) });
    }
  };

  const findItem = (list = [], id = null) => {
    return find(list, (l) => isEqual(get(l, "_id"), id));
  };

  const addTariff = () => {
    let result = [];
    let { ...rest } = tarif;
    if (!isNil(get(tarif, "tariff[0].product"))) {
      const res = tariffList.filter(
        (t) =>
          !isEqual(get(t, "tariff[0].product"), get(rest, "tariff[0].product"))
      );
      result = [...res, rest];
      setTariffList(result);
      setTarif({
        ...tarif,
        tariffPerClass: get(tarif, "tariff.tariffPerClass", []).map(
          ({ class: classes, min, max }) => ({
            classes,
            min: 0,
            max: 0,
          })
        ),
      });
    } else {
      toast.warn("Select all fields");
    }
  };

  const removeTariffFromList = (i) => {
    setTariffList((prev) => prev.filter((f, j) => !isEqual(i, j)));
  };

  //
  const { mutate: createRequest, isLoading } = usePostQuery({
    listKeyId: KEYS.products,
  });

  const create = ({ data }) => {
    createRequest(
      {
        url: URLS.agents,
        attributes: {
          ...data,
          agreementdate: dayjs(get(data, "agreementdate")),
        },
      },
      {
        onSuccess: () => {
          navigate("/agents/insurance-agents");
        },
        onError: () => {},
      }
    );
  };

  console.log('productList',get(productsList, `data.data`, []))
  console.log('tariffList',tariffList)

  return (
    <>
      {isLoading && <OverlayLoader />}
      <Panel>
        <Row>
          <Col xs={12}>
            <Search />
          </Col>
        </Row>
      </Panel>
      <Section>
        <Row className={"mb-25"}>
          <Col xs={12}>
            <Title>Создать агента</Title>
          </Col>
        </Row>
        <Form
          getValueFromField={(val, name) => {
            setPersonTypeForSelect(val, name);
            setFieldValue(val, name);
          }}
          footer={<Button>Save</Button>}
          formRequest={(values) => create(values)}
        >
          <Row>
            <Col xs={4}>
              <Field
                name={"branch"}
                type={"select"}
                label={"Branch"}
                options={branches}
                params={{ required: true }}
              />
            </Col>
            <Col xs={4}>
              <Field
                name={"inn"}
                type={"input-mask"}
                label={"INN"}
                property={{ mask: "999999999", maskChar: "_" }}
                params={{ pattern: /^[0-9]*$/ }}
              />
            </Col>

            <Col xs={4}>
              <Field
                name={"agreementnumber"}
                type={"input"}
                label={"agreementnumber"}
                params={{ required: true }}
              />
            </Col>
            <Col xs={4}>
              <Field
                name={"agreementdate"}
                dateFormat={"MM/DD/YYYY"}
                type={"datepicker"}
                label={"agreementdate"}
                params={{ required: true }}
              />
            </Col>

            <Col xs={4}>
              <Field
                params={{ required: true }}
                name={"typeofagent"}
                type={"select"}
                label={"Agent type"}
                options={agentTypes}
              />
            </Col>
            <Col xs={4}>
              <Field
                label={"isbeneficiary"}
                type={"switch"}
                name={"isbeneficiary"}
                params={{ required: true }}
              />
            </Col>
            <Col xs={4}>
              <Field
                label={"isfixedpolicyholder"}
                type={"switch"}
                name={"isfixedpolicyholder"}
                params={{ required: true }}
              />
            </Col>
            <Col xs={4}>
              <Field
                name={"typeofpersons"}
                type={"select"}
                label={"Person type"}
                options={[
                  {
                    value: PERSON_TYPE.person,
                    label: t(PERSON_TYPE.person),
                  },
                  {
                    value: PERSON_TYPE.organization,
                    label: t(PERSON_TYPE.organization),
                  },
                ]}
                params={{ required: true }}
              />
            </Col>
            {isEqual(personType, PERSON_TYPE.person) && (
              <>
                <Col xs={4}>
                  <Field name={"person.photo"} type={"input"} label={"Photo"} />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.name"}
                    type={"input"}
                    label={"name"}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.secondname"}
                    type={"input"}
                    label={"secondname"}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.middlename"}
                    type={"input"}
                    label={"middlename"}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.gender"}
                    type={"select"}
                    label={"Gender"}
                    options={genders}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.dateofbirth"}
                    dateFormat={"MM/DD/YYYY"}
                    type={"datepicker"}
                    label={"dateofbirth"}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.citizenship"}
                    type={"select"}
                    options={citizenshipList}
                    label={"Citizenship"}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.typeofdocument"}
                    type={"dropzone"}
                    label={"typeofdocument"}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.passportSeries"}
                    type={"input-mask"}
                    label={"Passport seria"}
                    property={{ mask: "aa", maskChar: "_" }}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.passportNumber"}
                    type={"input-mask"}
                    label={"Passport number"}
                    property={{ mask: "9999999", maskChar: "_" }}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.pin"}
                    type={"input-mask"}
                    label={"PINFL"}
                    property={{ mask: "99999999999999", maskChar: "_" }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.passportissuancedate"}
                    dateFormat={"MM/DD/YYYY"}
                    type={"datepicker"}
                    label={"passportissuancedate"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.passportissuedby"}
                    type={"input"}
                    label={"passportissuedby"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.region"}
                    type={"select"}
                    label={"Region"}
                    options={regions}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.district"}
                    type={"select"}
                    label={"District"}
                    options={districts}
                    params={{ required: true }}
                  />
                </Col>

                <Col xs={4}>
                  <Field
                    name={"person.address"}
                    type={"input"}
                    label={"address"}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.postcode"}
                    type={"input"}
                    label={"postcode"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.telephonenumber"}
                    type={"input"}
                    label={"telephonenumber"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.emailforcontact"}
                    type={"input"}
                    label={"emailforcontact"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.personalaccount"}
                    type={"input"}
                    label={"personalaccount"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.transitaccount"}
                    type={"input"}
                    label={"transitaccount"}
                  />
                </Col>
                <Col xs={4}>
                  <Field name={"person.mfo"} type={"input"} label={"mfo"} />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.nameofbank"}
                    type={"input"}
                    label={"nameofbank"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"person.numberofcard"}
                    type={"input"}
                    label={"numberofcard"}
                  />
                </Col>
              </>
            )}
            {isEqual(personType, PERSON_TYPE.organization) && (
              <>
                <Col xs={4}>
                  <Field
                    name={"organization.nameoforganization"}
                    type={"input"}
                    label={"nameoforganization"}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"organization.oked"}
                    type={"input"}
                    label={"oked"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"organization.mfo"}
                    type={"input"}
                    label={"mfo"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"organization.nameofbank"}
                    type={"input"}
                    label={"nameofbank"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"organization.innofbank"}
                    type={"input"}
                    label={"innofbank"}
                  />
                </Col>

                <Col xs={4}>
                  <Field
                    name={"organization.scheduledaccount"}
                    type={"input"}
                    label={"scheduledaccount"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"organization.region"}
                    type={"select"}
                    label={"Region"}
                    options={regions}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"organization.district"}
                    type={"select"}
                    label={"District"}
                    options={districts}
                    params={{ required: true }}
                  />
                </Col>

                <Col xs={4}>
                  <Field
                    name={"organization.address"}
                    type={"input"}
                    label={"address"}
                    params={{ required: true }}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"organization.postcode"}
                    type={"input"}
                    label={"postcode"}
                  />
                </Col>
                <Col xs={4}>
                  <Field
                    name={"organization.checkingaccount"}
                    type={"input"}
                    label={"checkingaccount"}
                  />
                </Col>
                <Col xs={8}>
                  <Field
                    isMulti
                    name={"organization.employees"}
                    type={"select"}
                    options={employeeList}
                    label={"Employees"}
                    params={{ required: true }}
                  />
                </Col>
              </>
            )}
            <Col xs={4}>
              <Field
                label={"isUsedourpanel"}
                type={"switch"}
                name={"isUsedourpanel"}
                params={{ required: true }}
              />
            </Col>
            <Col xs={4}>
              <Field
                label={"isUserRestAPI"}
                type={"switch"}
                name={"isUserRestAPI"}
                params={{ required: true }}
              />
            </Col>
          </Row>

          <Row className={"mb-15"}>
            <Col xs={12}>
              <Title>Тарифы</Title>
            </Col>
          </Row>

          <Row className={"mb-25"}>
            <Col xs={12}>
              <Row align={"flex-end"}>
                <Col xs={3}>
                  <Field label={t('Выберите категорию')} options={groups} type={'select'}
                         name={'group'}
                         property={{onChange: (val) => setProductGroupId(val)}}
                  />
                </Col>
                <Col xs={3}>
                  <Field label={t('Выберите подкатегорию')} options={subGroups} type={'select'}
                         name={'subGroup'}
                         property={{onChange: (val) => setProductSubGroupId(val)}}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    label={"Продукты"}
                    type={"select"}
                    name={"tariff[0].product"}
                    options={products}
                    defaultValue={get(product, "tariff[0].product")}
                    params={{
                      required: get(product, "riskData", []).length > 0,
                    }}
                    property={{onChange: (val) => setProductId(val)}}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    label={"Разрешить заключение договоров"}
                    type={"switch"}
                    name={"tariff[0].allowAgreement"}
                    defaultValue={get(find(get(productsList, `data.data`, []),(_item)=>isEqual(get(_item,'_id'),productId)),'tariff.allowAgreement',false)}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    label={"Лимит ответственности"}
                    type={"number-format-input"}
                    name={"tariff[0].limitOfAgreement"}
                    defaultValue={get(find(get(productsList, `data.data`, []),(_item)=>isEqual(get(_item,'_id'),productId)),'tariff.limitOfAgreement',0)}
                    property={{ placeholder: "Введите значение" }}
                  />
                </Col>
                <Col xs={3}>
                  <Button
                    onClick={addTariff}
                    type={"button"}
                    className={"mb-25"}
                  >
                    Применить
                  </Button>
                </Col>
              </Row>
            </Col>

            {tariffList.length > 0 && (
              <Col xs={12} className={"horizontal-scroll"}>
                <hr />
                <Table
                  hideThead={false}
                  thead={[
                    "Продукт",
                    "Разрешить заключение договоров",
                    "Лимит ответственности",
                    "Class",
                    "Max",
                    "Min",
                    "Delete",
                  ]}
                >
                  {tariffList.map((item, i) => (
                    <tr key={i + 1}>
                      <td>
                        <Field
                          className={"minWidth300"}
                          options={products}
                          type={"select"}
                          name={`tariff[${i + 1}].product`}
                          defaultValue={get(item, "tariff[0].product")}
                          property={{ hideLabel: true }}
                          isDisabled={true}
                        />
                      </td>

                      <td className={"text-center"}>
                        <Field
                          property={{ hideLabel: true }}
                          type={"switch"}
                          name={`tariff[${i + 1}].allowAgreement`}
                          defaultValue={get(
                            item,
                            "tariff[0].allowAgreement",
                            false
                          )}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Field
                          type={"number-format-input"}
                          name={`tariff[${i + 1}].limitOfAgreement`}
                          defaultValue={get(
                            item,
                            "tariff[0].limitOfAgreement",
                            0
                          )}
                          property={{
                            disabled: true,
                            placeholder: "Введите значение",
                            hideLabel: true,
                          }}
                        />
                      </td>
                      <td colSpan={3}>
                        {isArray(get(find(get(productsList, `data.data`, []),(_item)=>isEqual(get(_item,'_id'),get(item,'tariff[0].product'))),'tariff',[])) && get(find(get(productsList, `data.data`, []),(_item)=>isEqual(get(_item,'_id'),get(item,'tariff[0].product'))),'tariff',[]).map(
                          (c, j) => (
                            <Flex>
                              <Field
                                key={j}
                                className={"mb-15 mr-16 flex-none"}
                                name={`tariff[${
                                  i + 1
                                }].tariffPerClass[${j}].class`}
                                type={"select"}
                                property={{
                                  hideLabel: true,
                                  bgColor: get(
                                    findItem(
                                      get(classes, "data.data"),
                                      get(c, "tariffPerClass[0].class._id")
                                    ),
                                    "color"
                                  ),
                                }}
                                options={classOptions}
                                defaultValue={get(
                                  findItem(
                                    get(classes, "data.data"),
                                    get(c, "tariffPerClass[0].class._id")
                                  ),
                                  "_id"
                                )}
                                // isDisabled={true}
                              />
                              <Field
                                key={j}
                                className={"mb-15 mr-16 ml-15"}
                                type={"number-format-input"}
                                name={`tariff[${
                                  i + 1
                                }].tariffPerClass[${j}].max`}
                                defaultValue={get(c, "tariffPerClass[0].max", 0)}
                                property={{
                                  // disabled: true,
                                  placeholder: "Введите значение",
                                  hideLabel: true,
                                }}
                              />
                              <Field
                                key={j}
                                className={"mb-15"}
                                type={"number-format-input"}
                                name={`tariff[${
                                  i + 1
                                }].tariffPerClass[${j}].min`}
                                defaultValue={get(c, "tariffPerClass[0].min", 0)}
                                property={{
                                  // disabled: true,
                                  placeholder: "Введите значение",
                                  hideLabel: true,
                                }}
                              />
                            </Flex>
                          )
                        )}
                      </td>
                      <td
                        className={"cursor-pointer"}
                        onClick={() => removeTariffFromList(i)}
                      >
                        <Trash2 color={"#dc2626"} />
                      </td>
                    </tr>
                  ))}
                </Table>
              </Col>
            )}
          </Row>
        </Form>
      </Section>
    </>
  );
};

export default AgentsCreateContainer;
