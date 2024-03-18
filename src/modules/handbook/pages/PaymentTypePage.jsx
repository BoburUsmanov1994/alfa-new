import React from 'react';
import styled from "styled-components";
import PaymentTypeContainer from "../containers/PaymentTypeContainer";


const Styled = styled.div`
`;
const PaymentTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <PaymentTypeContainer/>
        </Styled>
    );
};

export default PaymentTypePage;