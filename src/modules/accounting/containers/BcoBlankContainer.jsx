import React, { useEffect, useMemo } from "react";
import { useStore } from "../../../store";
import { get } from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import { KEYS } from "../../../constants/key";
import { URLS } from "../../../constants/url";
import { Col, Row } from "react-grid-system";
import Field from "../../../containers/form/field";
import { useGetAllQuery } from "../../../hooks/api";
import { getSelectOptionsListFromData } from "../../../utils";
import { useTranslation } from "react-i18next";

const BcoBlankContainer = ({ ...rest }) => {
  const { t } = useTranslation();
  const setBreadcrumbs = useStore((state) =>
    get(state, "setBreadcrumbs", () => {})
  );
  let { data: warehouse } = useGetAllQuery({
    key: KEYS.warehouse,
    url: `${URLS.warehouse}/list`,
  });
  warehouse = getSelectOptionsListFromData(
    get(warehouse, `data.data`, []),
    "_id",
    "name"
  );

  let { data: branchList } = useGetAllQuery({
    key: KEYS.branches,
    url: `${URLS.branches}/list`,
  });
  branchList = getSelectOptionsListFromData(
    get(branchList, `data.data`, []),
    "_id",
    "branchName"
  );

  let { data: bcoTypeList } = useGetAllQuery({
    key: KEYS.typeofbco,
    url: `${URLS.bcoType}/list`,
  });
  bcoTypeList = getSelectOptionsListFromData(
    get(bcoTypeList, `data.data`, []),
    "_id",
    "policy_type_name"
  );

  let { data: policyList } = useGetAllQuery({
    key: KEYS.policy,
    url: `${URLS.policy}/list`,
  });
  policyList = getSelectOptionsListFromData(
    get(policyList, `data.data`, []),
    "_id",
    "name"
  );

  let { data: bcoStatusList } = useGetAllQuery({
    key: KEYS.statusoftypebco,
    url: `${URLS.bcoStatus}/list`,
  });
  bcoStatusList = getSelectOptionsListFromData(
    get(bcoStatusList, `data.data`, []),
    "_id",
    "name"
  );

  const breadcrumbs = useMemo(
    () => [
      {
        id: 1,
        title: t("Accounting"),
        path: "/accounting",
      },
      {
        id: 2,
        title: t("Bco blanks"),
        path: "/accounting/bco-blanks",
      },
    ],
    []
  );

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
  }, []);

  const ModalBody = ({ data, rowId = null }) => (
    <Row>
      <Col xs={6}>
        <Field
          name={"warehouse_id"}
          type={"select"}
          options={warehouse}
          label={t("Warehouse")}
          defaultValue={rowId ? get(data, "warehouse_id") : null}
        />
      </Col>
      <Col xs={6}>
        <Field
          name={"branch"}
          options={branchList}
          type={"select"}
          label={t("Branch")}
          defaultValue={rowId ? get(data, "branch") : null}
        />
      </Col>
      <Col xs={6}>
        <Field
          name={"bco_type"}
          options={bcoTypeList}
          type={"select"}
          label={t("Bco type")}
          defaultValue={rowId ? get(data, "bco_type") : null}
          params={{ required: true }}
        />
      </Col>
      <Col xs={6}>
        <Field
          name={"blank_number"}
          type={"input"}
          label={t("Blank number")}
          defaultValue={rowId ? get(data, "blank_number") : null}
          params={{ required: true }}
        />
      </Col>
      <Col xs={6}>
        <Field
          name={"policy"}
          options={policyList}
          type={"select"}
          label={t("Policy")}
          defaultValue={rowId ? get(data, "policy") : null}
        />
      </Col>
      <Col xs={6}>
        <Field
          name={"status"}
          options={bcoStatusList}
          type={"select"}
          label={t("Policy status")}
          defaultValue={rowId ? get(data, "status") : null}
          params={{ required: true }}
        />
      </Col>
    </Row>
  );

  return (
    <>
      <GridView
        ModalBody={ModalBody}
        tableHeaderData={[
          {
            id: 1,
            key: "blank_number",
            title: t("Blank number"),
          },
          {
            id: 2,
            key: "policy.name",
            title: t("Policy"),
          },
          {
            id: 3,
            key: "status.name",
            title: t("Status"),
          },
          {
            id: 4,
            key: "warehouse_id.name",
            title: t("Warehouse"),
          },
        ]}
        keyId={KEYS.policyblank}
        url={URLS.policyblank}
        listUrl={`${URLS.policyblank}/list`}
        title={t("Blanks")}
        responseDataKey={"data.data"}
      />
    </>
  );
};

export default BcoBlankContainer;
