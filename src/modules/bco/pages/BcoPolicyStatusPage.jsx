import React from 'react';
import styled from "styled-components";
import BcoPolicyStatusContainer from "../containers/BcoPolicyStatusContainer";


const Styled = styled.div`
`;
const BcoPolicyStatusPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BcoPolicyStatusContainer/>
        </Styled>
    );
};

export default BcoPolicyStatusPage;