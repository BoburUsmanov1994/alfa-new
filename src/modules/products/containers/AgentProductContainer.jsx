import React, { useEffect, useMemo } from "react";
import { useStore } from "../../../store";
import { get } from "lodash";
import { Col, Row } from "react-grid-system";
import Panel from "../../../components/panel";
import Search from "../../../components/search";
import Title from "../../../components/ui/title";
import Section from "../../../components/section";
import { KEYS } from "../../../constants/key";
import { URLS } from "../../../constants/url";
import { ContentLoader, OverlayLoader } from "../../../components/loader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomTabs from "../../../components/tabs";
import { useGetOneQuery } from "../../../hooks/api";
import Card from "../../../components/card";

const ProductViewContainer = ({ id, ...rest }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  // let {data, isLoading, isError} = useGetOneQuery({id, key: KEYS.products, url: URLS.products})

  const setBreadcrumbs = useStore((state) =>
    get(state, "setBreadcrumbs", () => {})
  );
  const breadcrumbs = useMemo(
    () => [
      {
        id: 1,
        title: t("Продукты"),
        path: "/products",
      },
      {
        id: 2,
        title: id,
        path: "#",
      },
    ],
    []
  );

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
  }, []);

  // const product = get(data, 'data.data', {})

  // if (isLoading) {
  //     return <OverlayLoader/>
  // }
  return (
    <>
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
            <Title>{t("Agent product")}</Title>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <CustomTabs
              header={["Физические лица", "Юридические лица "]}
              body={[
                <CustomTabs
                  success
                  header={[
                    "Автострахование",
                    "Страхование имущества",
                    "Личное страхование",
                    "Страхование автогражданской ответственности",
                    "Финансовые риски",
                  ]}
                  body={[
                    <Row>
                      <Col xs={4}>
                        <Card />
                      </Col>
                    </Row>,
                  ]}
                />,
              ]}
            />
          </Col>
        </Row>
      </Section>
    </>
  );
};

export default ProductViewContainer;
