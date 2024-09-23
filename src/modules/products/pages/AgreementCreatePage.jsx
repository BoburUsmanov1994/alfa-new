import React from 'react';
import styled from "styled-components";
import AgreementCreateContainer from "../containers/AgreementCreateContainer";

const Styled = styled.div`
 .rodal-dialog{
   height: 150px !important;
 }
`;
const AgreementCreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgreementCreateContainer />
        </Styled>
    );
};

export default AgreementCreatePage;