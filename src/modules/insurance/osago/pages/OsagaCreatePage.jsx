import React from 'react';
import styled from "styled-components";
import OsagaCreateContainer from "../containers/OsagaCreateContainer";

const Styled = styled.div`
  .form-group {
    margin-bottom: 0;
  }

`;
const OsagaCreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <OsagaCreateContainer/>
        </Styled>
    );
};

export default OsagaCreatePage;