import React from 'react';
import styled from "styled-components";
import BankCreateContainer from "../containers/BankCreateContainer";

const Styled = styled.div`
`;
const BankCreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BankCreateContainer/>
        </Styled>
    );
};

export default BankCreatePage;