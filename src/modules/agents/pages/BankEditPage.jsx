import React from 'react';
import styled from "styled-components";
import BankEditContainer from "../containers/BankEditContainer";

const Styled = styled.div`
`;
const BankEditPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BankEditContainer/>
        </Styled>
    );
};

export default BankEditPage;
