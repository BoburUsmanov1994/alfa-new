import React from 'react';
import styled from "styled-components";
import ClientCreateContainer from "../containers/ClientCreateContainer";


const Styled = styled.div`
  .box__outlined {
    border: 1px dotted #BABABA;
    padding: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
`;
const ClientCreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ClientCreateContainer/>
        </Styled>
    );
};

export default ClientCreatePage;