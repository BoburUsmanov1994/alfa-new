import React from 'react';
import styled from "styled-components";
import EndorsementsTypeContainer from "../containers/EndorsementsTypeContainer";
import EndorsementsStatusContainer from "../containers/EndorsementsStatusContainer";

const Styled = styled.div`
`;
const EndorsementsFieldPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <EndorsementsStatusContainer/>
        </Styled>
    );
};

export default EndorsementsFieldPage;