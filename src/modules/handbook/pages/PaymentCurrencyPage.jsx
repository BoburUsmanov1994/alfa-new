import React from 'react';
import styled from "styled-components";
import PaymentCurrencyContainer from "../containers/PaymentCurrencyContainer";

const Styled = styled.div`
`;
const PaymentCurrencyPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <PaymentCurrencyContainer />
        </Styled>
    );
};

export default PaymentCurrencyPage;