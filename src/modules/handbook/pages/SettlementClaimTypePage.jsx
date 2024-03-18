import React from 'react';
import styled from "styled-components";
import SettlementClaimTypeContainer from "../containers/SettlementClaimTypeContainer";

const Styled = styled.div`
`;
const SettlementClaimTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <SettlementClaimTypeContainer />
        </Styled>
    );
};

export default SettlementClaimTypePage;