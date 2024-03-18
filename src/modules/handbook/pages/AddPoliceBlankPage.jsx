import React from 'react';
import styled from "styled-components";
import AddPoliceBlankContainer from "../containers/AddPoliceBlankContainer";


const Styled = styled.div`
`;
const AddPoliceBlankPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AddPoliceBlankContainer/>
        </Styled>
    );
};

export default AddPoliceBlankPage;