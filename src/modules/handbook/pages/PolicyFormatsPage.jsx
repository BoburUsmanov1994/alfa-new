import React from 'react';
import styled from "styled-components";
import PolicyFormatsContainer from "../containers/PolicyFormatsContainer";

const Styled = styled.div`
`;
const PolicyFormatsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <PolicyFormatsContainer />
        </Styled>
    );
};

export default PolicyFormatsPage;