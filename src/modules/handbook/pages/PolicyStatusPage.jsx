import React from 'react';
import styled from "styled-components";
import PolicyStatusContainer from "../containers/PolicyStatusContainer";

const Styled = styled.div`
    
`;
const PolicyStatusPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <PolicyStatusContainer />
        </Styled>
    );
};

export default PolicyStatusPage;