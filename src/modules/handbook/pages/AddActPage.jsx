import React from 'react';
import styled from "styled-components";
import AddActContainer from "../containers/AddActContainer";


const Styled = styled.div`
   
`;
const AddActPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AddActContainer/>
        </Styled>
    );
};

export default AddActPage;