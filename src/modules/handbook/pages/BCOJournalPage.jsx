import React from 'react';
import styled from "styled-components";
import BCOContainer from "../containers/BCOContainer";
import BCOJournalContainer from "../containers/BCOJournalContainer";


const Styled = styled.div`
`;
const BCOJournalPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BCOJournalContainer/>
        </Styled>
    );
};

export default BCOJournalPage;