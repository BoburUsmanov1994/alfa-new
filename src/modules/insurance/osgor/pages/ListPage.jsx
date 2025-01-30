import React from 'react';
import styled from "styled-components";
import ListContainer from "../containers/ListContainer";

const Styled = styled.div`
  .rodal-dialog{
    min-height: 60vh !important;
  }
`;
const ListPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ListContainer/>
        </Styled>
    );
};

export default ListPage;
