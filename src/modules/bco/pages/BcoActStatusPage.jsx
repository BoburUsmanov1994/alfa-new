import React from 'react';
import styled from "styled-components";
import BcoActStatusContainer from "../containers/BcoActStatusContainer";


const Styled = styled.div`
`;
const BcoActStatusPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BcoActStatusContainer/>
        </Styled>
    );
};

export default BcoActStatusPage;