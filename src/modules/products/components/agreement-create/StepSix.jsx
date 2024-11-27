import React from "react";
import { Col, Row } from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import styled from "styled-components";
import checkImg from "../../../../assets/images/check.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Styled = styled.div`
  .result {
    padding: 30px 50px;
    border: 1px solid #adadad;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    p {
      font-size: 32px;
    }
  }
  a {
    margin-top: 25px;
    display: inline-block;
    color: #1d283a;
    transition: 0.3s ease;
    &:hover {
      color: #13d6d1;
    }
  }
`;

const StepSix = ({ ...rest }) => {
  const { t } = useTranslation();
  return (
    <Styled {...rest}>
      <Row justify={"center"}>
        <Col xs={12}>
          <StepNav step={6} />
        </Col>
        <Col xs={6}>
          <div className="result">
            <img className={"img-fluid"} src={checkImg} alt="check" />
            <p>{t("Продукт успешно добавлен!")}</p>
          </div>
          <div className="text-center">
            <Link to={"/dashboard"}>{t("Перейти на главную страницу")}</Link>
          </div>
        </Col>
      </Row>
    </Styled>
  );
};

export default StepSix;
