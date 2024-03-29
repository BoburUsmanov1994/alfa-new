import React from 'react';
import styled from "styled-components";
import BcoStatusContainer from "../containers/BcoStatusContainer";


const Styled = styled.div`
`;
const BcoStatusPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BcoStatusContainer/>
        </Styled>
    );
};

export default BcoStatusPage;