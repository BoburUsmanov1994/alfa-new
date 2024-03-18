import React from 'react';
import styled from "styled-components";
import InsuranceFormContainer from "../containers/InsuranceFormContainer";



const Styled = styled.div`
`;
const InsuranceFormPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <InsuranceFormContainer />
        </Styled>
    );
};

export default InsuranceFormPage;