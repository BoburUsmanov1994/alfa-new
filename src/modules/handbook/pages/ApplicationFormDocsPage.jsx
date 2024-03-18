import React from 'react';
import styled from "styled-components";
import ApplicationFormDocsContainer from "../containers/ApplicationFormDocsContainer";

const Styled = styled.div`
`;
const ApplicationFormDocsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ApplicationFormDocsContainer />
        </Styled>
    );
};

export default ApplicationFormDocsPage;