import React from 'react';
import styled from "styled-components";
import PaymentStatusContainer from "../containers/PaymentStatusContainer";

const Styled = styled.div`

`;
const PaymentStatusPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <PaymentStatusContainer />
        </Styled>
    );
};

export default PaymentStatusPage;