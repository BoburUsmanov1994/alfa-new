import React from 'react';
import styled from "styled-components";
import AgentProductContainer from "../containers/AgentProductContainer";

const Styled = styled.div`
`;
const AgentProductPage = ({
                              ...rest
                          }) => {
    return (
        <Styled {...rest}>
            <AgentProductContainer/>
        </Styled>
    );
};

export default AgentProductPage;