import React from 'react';
import styled from "styled-components";
import EndorsementsTypeContainer from "../containers/EndorsementsTypeContainer";

const Styled = styled.div`
`;
const EndorsementsTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <EndorsementsTypeContainer/>
        </Styled>
    );
};

export default EndorsementsTypePage;