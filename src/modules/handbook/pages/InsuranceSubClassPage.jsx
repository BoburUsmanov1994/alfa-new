import React from 'react';
import styled from "styled-components";
import InsuranceSubClassContainer from "../containers/InsuranceSubClassContainer";

const Styled = styled.div`
`;
const InsuranceSubClassPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <InsuranceSubClassContainer />
        </Styled>
    );
};

export default InsuranceSubClassPage;