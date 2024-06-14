import React, { useEffect, useMemo } from "react";
import { useSettingsStore, useStore } from "../../../../store";
import { get } from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import { KEYS } from "../../../../constants/key";
import { URLS } from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";

const ListContainer = ({ ...rest }) => {
  const { t } = useTranslation();

  const setBreadcrumbs = useStore((state) =>
    get(state, "setBreadcrumbs", () => {})
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
            id: 1,
            key: "seria",
            title: "Наименование",
            render: (row) => get(row, "insurant.name"),
          },
          {
            id: 2,
            key: "branch_id",
            title: "Филиал",
          },
          {
            id: 3,
            key: "contract_id",
            title: "Номер договора",
          },
          {
            id: 4,
            key: "policy",
            title: "Серия полиса",
            render: (row) => get(row, "policy.number"),
          },
          {
            id: 5,
            key: "insurant",
            title: "Номер полиса",
            render: (row) => get(row, "policy.number"),
          },
          {
            id: 7,
            key: "policy.ins_sum",
            title: "Insurance sum",
            render: (row) => (
              <NumberFormat
                displayType={"text"}
                thousandSeparator={" "}
                value={get(row, "policy.ins_sum")}
              />
            ),
          },
          {
            id: 6,
            key: "policy.ins_premium",
            title: "Insurance premium",
            render: (row) => (
              <NumberFormat
                displayType={"text"}
                thousandSeparator={" "}
                value={get(row, "policy.ins_premium")}
              />
            ),
          },
          {
            id: 7,
            key: "createdAt",
            title: "Created at",
            render: (row) =>
              get(row, "createdAt")
                ? dayjs(get(row, "createdAt")).format("DD-MM-YYYY HH:mm")
                : "-",
          },
          {
            id: 9,
            key: "status",
            title: "Status",
          },
        ]}
        keyId={KEYS.smrList}
        url={URLS.smrList}
        title={t("СМР")}
        responseDataKey={"data.docs"}
        viewUrl={"/insurance/smr/view"}
        // createUrl={'/smr/create'}
        updateUrl={"/insurance/smr/update"}
        isHideColumn
        dataKey={"contract_id"}
        deleteUrl={URLS.smrDelete}
        hideCreateBtn={true}
      />
    </>
  );
};

export default ListContainer;
