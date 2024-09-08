import React from 'react';
import styled from "styled-components";
import ClientUpdateContainer from "../containers/ClientUpdateContainer";
import {useParams} from "react-router-dom";


const Styled = styled.div`
  .box__outlined {
    border: 1px dotted #BABABA;
    padding: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
`;
const ClientUpdatePage = ({...rest}) => {
    const {id} = useParams()
    return (
        <Styled {...rest}>
            <ClientUpdateContainer id={id} />
        </Styled>
    );
};

export default ClientUpdatePage;