import React from 'react';
import styled from "styled-components";
import RiskContainer from "../containers/RiskContainer";

const Styled = styled.div`
`;
const RiskPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <RiskContainer />
        </Styled>
    );
};

export default RiskPage;