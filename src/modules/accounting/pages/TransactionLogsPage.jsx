import React from 'react';
import TransactionLogsContainer from "../containers/TransactionLogsContainer";
import styled from "styled-components";

const Styled = styled.div`
`;
const TransactionLogsPage = ({
                                 ...rest
                             }) => {
    return (
        <Styled {...rest}>
            <TransactionLogsContainer/>
        </Styled>
    );
};

export default TransactionLogsPage;