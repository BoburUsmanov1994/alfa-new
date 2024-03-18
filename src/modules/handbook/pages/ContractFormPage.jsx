import React from 'react';
import styled from "styled-components";
import ContractFormContainer from "../containers/ContractFormContainer";

const Styled = styled.div`
`;
const ContractFormPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ContractFormContainer />
        </Styled>
    );
};

export default ContractFormPage;