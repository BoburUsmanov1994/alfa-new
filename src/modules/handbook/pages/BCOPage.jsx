import React from 'react';
import styled from "styled-components";
import BCOContainer from "../containers/BCOContainer";


const Styled = styled.div`
  .rodal-dialog {
    //height: 150px !important;
    width: 200px !important;
  }
`;
const BCOPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BCOContainer/>
        </Styled>
    );
};

export default BCOPage;