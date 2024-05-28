import React from 'react';
import styled from "styled-components";
import UpdateContainer from "../containers/UpdateContainer";
import {useParams} from "react-router-dom";

const Styled = styled.div`
  .w-100 {
    & > div {
      width: 100%;
    }
  }

  .form-group {
    margin-bottom: 0;
  }
`;
const UpdatePage = ({...rest}) => {
    const {contract_id = null} = useParams();
    return (
        <Styled {...rest}>
            <UpdateContainer contract_id={contract_id}/>
        </Styled>
    );
};

export default UpdatePage;