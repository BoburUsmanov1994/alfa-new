import React from 'react';
import styled from "styled-components";
import EmployeesContainer from "../containers/EmployeesContainer";

const Styled = styled.div`
`;
const EmployeesPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <EmployeesContainer/>
        </Styled>
    );
};

export default EmployeesPage;