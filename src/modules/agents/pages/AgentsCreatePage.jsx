import React from 'react';
import styled from "styled-components";
import AgentsCreateContainer from "../containers/AgentsCreateContainer";


const Styled = styled.div`
.box__outlined{
  border:1px dotted #BABABA;
  padding: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
}
`;
const AgentsCreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgentsCreateContainer/>
        </Styled>
    );
};

export default AgentsCreatePage;