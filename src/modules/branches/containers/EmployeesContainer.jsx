import React, { useEffect, useMemo } from "react";
import { useStore } from "../../../store";
import { get, isEqual } from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import { KEYS } from "../../../constants/key";
import { URLS } from "../../../constants/url";
import Field from "../../../containers/form/field";
import { useGetAllQuery } from "../../../hooks/api";
import { getSelectOptionsListFromData } from "../../../utils";
import { Col, Row } from "react-grid-system";
import { useTranslation } from "react-i18next";

const EmployeesContainer = ({ ...rest }) => {
  const setBreadcrumbs = useStore((state) =>
    get(state, "setBreadcrumbs", () => {})
  );
  const { t } = useTranslation();

  const breadcrumbs = useMemo(
    () => [
      {
        id: 1,
        title: t("Справочники"),
        path: "/handbook",
      },
      {
        id: 2,
        title: t("Employees"),
        path: "/handbook/branches",
      },
    ],
    []
  );

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <>
      <GridView
        tableHeaderData={[
          {
            id: 1,
            key: "fullname",
            title: t("Fullname"),
          },
          {
            id: 2,
            key: "photo",
            title: t("Photo"),
          },
          {
            id: 3,
            key: "documentnumber",
            title: t("Passport"),
          },
          {
            id: 4,
            key: "position.name",
            title: t("Position"),
          },
          {
            id: 6,
            key: "telephonenumber",
            title: t("Phone"),
          },
          {
            id: 7,
            key: "emailforcontacts",
            title: t("Email"),
          },
        ]}
        keyId={KEYS.employee}
        url={URLS.employee}
        listUrl={`${URLS.employee}/list`}
        title={t("Employees")}
        responseDataKey={"data.data"}
        // viewUrl={'/branches/employee/view'}
        createUrl={"/branches/employee/create"}
        // updateUrl={'/branches/employee/update'}
        isHideColumn
      />
    </>
  );
};

export default EmployeesContainer;
