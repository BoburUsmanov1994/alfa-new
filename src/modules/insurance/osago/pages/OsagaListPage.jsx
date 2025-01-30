import React from 'react';
import styled from "styled-components";
import OsagaListContainer from "../containers/OsagaListContainer";

const Styled = styled.div`
  .rodal-dialog{
    min-height: 60vh !important;
  }
`;
const OsagaListPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <OsagaListContainer/>
        </Styled>
    );
};

export default OsagaListPage;
