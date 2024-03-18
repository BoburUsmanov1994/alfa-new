import React from 'react';
import styled from "styled-components";
import RefundTypeContainer from "../containers/RefundTypeContainer";

const Styled = styled.div`
`;
const RefundTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <RefundTypeContainer />
        </Styled>
    );
};

export default RefundTypePage;