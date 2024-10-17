import React, { useEffect, useMemo } from "react";
import { useStore } from "../../../../store";
import { get } from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import { KEYS } from "../../../../constants/key";
import { URLS } from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";

const ListContainer = ({ ...rest }) => {
  const { t } = useTranslation();

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
              get(row, "owner.person")
                ? `${get(row, "owner.person.fullName.lastname")} ${get(
                    row,
                    "owner.person.fullName.firstname"
                  )}  ${get(row, "owner.person.fullName.middlename")}`
                : get(row, "owner.organization.name"),
          },
          {
            id: 55,
            key: "insurant",
            title: "Isnurant",
            render: (row) =>
              get(row, "insurant.person")
                ? `${get(row, "insurant.person.fullName.lastname")} ${get(
                    row,
                    "insurant.person.fullName.firstname"
                  )}  ${get(row, "insurant.person.fullName.middlename")}`
                : get(row, "insurant.organization.name"),
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
        ]}
        keyId={KEYS.osgopList}
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
      />
    </>
  );
};

export default ListContainer;
