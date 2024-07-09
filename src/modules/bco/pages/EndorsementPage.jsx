import React from 'react';
import styled from "styled-components";
import EndorsementContainer from "../containers/EndorsementContainer";


const Styled = styled.div`
`;
const EndorsementPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <EndorsementContainer/>
        </Styled>
    );
};

export default EndorsementPage;