import React from 'react';
import styled, {css} from "styled-components";
import {useTranslation} from "react-i18next";

const Styled = styled.label`
  font-size:  ${({sm}) => sm ? '12px': '16px'};
  font-family: 'Gilroy-Bold', sans-serif;
  color: #000;
  margin-bottom: ${({sm}) => sm ? '4px': '8px'};
  display: block;
 
  &.required{
    &:after{
      content:"*";
      color: #ef466f;
    }
  }

`;
const Label = ({children,sm,...rest}) => {
    const {t} = useTranslation()
    return (
        <Styled {...rest} sm={sm}>
            {
                t(children)
            }
        </Styled>
    );
};

export default Label;
