import React from 'react';
import styled from "styled-components";
import AgreementUpdateContainer from "../containers/AgreementUpdateContainer";
import {useParams} from "react-router-dom";

const Styled = styled.div`
 .rodal-dialog{
   height: 150px !important;
 }
`;
const AgreementUpdatePage = ({...rest}) => {
    const {id = null} = useParams();
    return (
        <Styled {...rest}>
            <AgreementUpdateContainer id={id} />
        </Styled>
    );
};

export default AgreementUpdatePage;