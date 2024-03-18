import React from 'react';
import styled from "styled-components";
import EmployeeViewContainer from "../containers/EmployeeViewContainer";



const Styled = styled.div`
  .rodal-dialog {
    width: unset !important;
    max-width: 50%;
    min-width: 750px;
    min-height: 350px !important;
    max-height: 50vh !important;
    overflow-y: auto;
  }
`;
const BranchViewPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <EmployeeViewContainer/>
        </Styled>
    );
};

export default BranchViewPage;