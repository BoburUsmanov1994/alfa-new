import React from 'react';
import styled from "styled-components";
import InsuranceClassContainer from "../containers/InsuranceClassContainer";


const Styled = styled.div`
`;
const InsuranceClassPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <InsuranceClassContainer />
        </Styled>
    );
};

export default InsuranceClassPage;