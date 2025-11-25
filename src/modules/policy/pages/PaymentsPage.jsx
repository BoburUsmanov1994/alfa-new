import React from 'react';
import PaymentsContainer from "../containers/PaymentsContainer";

const PaymentsPage = ({...rest}) => {
    return (
        <div {...rest}>
            <PaymentsContainer/>
        </div>
    );
};

export default PaymentsPage;