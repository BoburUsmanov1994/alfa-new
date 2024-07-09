import React from 'react';
import styled from "styled-components";
import EdorsementViewContainer from "../containers/EdorsementViewContainer";


const Styled = styled.div`

`;
const EndorsementViewPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <EdorsementViewContainer />
        </Styled>
    );
};

export default EndorsementViewPage;