import React from 'react';
import styled from "styled-components";
import EmployeeAddContainer from "../containers/EmployeeAddContainer";



const Styled = styled.div`
`;
const EmployeeAddPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <EmployeeAddContainer/>
        </Styled>
    );
};

export default EmployeeAddPage;