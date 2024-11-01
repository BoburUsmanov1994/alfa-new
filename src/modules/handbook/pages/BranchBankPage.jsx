import React from 'react';
import styled from "styled-components";
import BranchBankContainer from "../containers/BranchBankContainer";



const Styled = styled.div`
`;
const BranchBankPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BranchBankContainer />
        </Styled>
    );
};

export default BranchBankPage;