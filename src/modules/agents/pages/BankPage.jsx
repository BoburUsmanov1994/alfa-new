import React from 'react';
import styled from "styled-components";
import BankContainer from "../containers/BankContainer";

const Styled = styled.div`
`;
const BankPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BankContainer/>
        </Styled>
    );
};

export default BankPage;