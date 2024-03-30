import React from 'react';
import styled from "styled-components";
import UsersContainer from "../containers/UsersContainer";

const Styled = styled.div`
  .rodal-dialog {
    width: 800px !important;
  }
`;
const UsersPage = () => {
    return (
        <Styled>
            <UsersContainer/>
        </Styled>
    );
};

export default UsersPage;