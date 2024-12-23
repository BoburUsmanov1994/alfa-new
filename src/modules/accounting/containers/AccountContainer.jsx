import React, { useEffect, useMemo } from "react";
import { useStore } from "../../../store";
import { get } from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import { KEYS } from "../../../constants/key";
import { URLS } from "../../../constants/url";
import Field from "../../../containers/form/field";
import { useTranslation } from "react-i18next";

const AccountContainer = ({ ...rest }) => {
  const { t } = useTranslation();
  const setBreadcrumbs = useStore((state) =>
    get(state, "setBreadcrumbs", () => {})
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
    <>
      <Field
        name={"account_name"}
        type={"input"}
        label={t("Account name")}
        defaultValue={rowId ? get(data, "account_name") : null}
        params={{ required: true }}
      />
      <Field
        name={"account_ID"}
        property={{ type: "number" }}
        type={"input"}
        label={t("Account number")}
        defaultValue={rowId ? get(data, "account_ID") : null}
        params={{ required: true, valueAsNumber: true }}
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
            key: "account_name",
            title: t("Account name"),
          },
          {
            id: 2,
            key: "account_ID",
            title: t("Account number"),
          },
        ]}
        keyId={KEYS.account}
        url={URLS.account}
        listUrl={`${URLS.account}/list`}
        title={t("Account")}
        responseDataKey={"data.data"}
      />
    </>
  );
};

export default AccountContainer;
