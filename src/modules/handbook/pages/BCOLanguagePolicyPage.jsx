import React from 'react';
import styled from "styled-components";
import BCOLanguagePolicyContainer from "../containers/BCOLanguagePolicyContainer";


const Styled = styled.div`
`;
const BCOLanguagePolicyPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BCOLanguagePolicyContainer/>
        </Styled>
    );
};

export default BCOLanguagePolicyPage;