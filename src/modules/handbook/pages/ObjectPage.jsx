import React from 'react';
import styled from "styled-components";
import ObjectContainer from "../containers/ObjectContainer";


const Styled = styled.div`
`;
const ObjectPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ObjectContainer />
        </Styled>
    );
};

export default ObjectPage;