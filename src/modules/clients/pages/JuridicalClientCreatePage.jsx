import React from 'react';
import styled from "styled-components";
import JuridicalClientCreateContainer from "../containers/JuridicalClientCreateContainer";


const Styled = styled.div`
  .box__outlined {
    border: 1px dotted #BABABA;
    padding: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
`;
const JuridicalClientCreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <JuridicalClientCreateContainer />
        </Styled>
    );
};

export default JuridicalClientCreatePage;