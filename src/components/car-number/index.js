import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import uzImg from "../../assets/images/uz.png"
import {useForm, Controller} from "react-hook-form";
import InputMask from "react-input-mask";
import {get, isEmpty, includes, toUpper, slice} from "lodash";

const Styled = styled.div`
  display: flex;
  border: 2px solid #B7B7B7;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  align-items: center;


  .uz {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    justify-content: center;
    align-items: center;

    img {
      margin-bottom: 3px;
    }

    span {
      color: #2F8BB2;
      font-size: 18px;
      font-weight: 600;
    }
  }

  &:before {
    position: absolute;
    content: "";
    top: 50%;
    left: -4px;
    width: 8px;
    height: 8px;
    background: #636363;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    transform: translateY(-50%);
  }

  &:after {
    position: absolute;
    content: "";
    top: 50%;
    right: -4px;
    width: 8px;
    height: 8px;
    background: #636363;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    transform: translateY(-50%);
  }

  .input {
    text-transform: uppercase;
    padding: 18px 18px;
    color: #000;
    font-size: 48px;
    outline: none;
    display: inline !important;
    border: none;
    outline: none;
    background: transparent;
    font-weight: 400;
    text-align: center;

    &.first {
      width: 90px;
      border-right: 2px solid #B7B7B7;
    }

    &.second {
      width: 90px;
    }

    &.third {
      width: 130px;
    }

    &.fourth {
      width: 110px;
    }

    &::placeholder {
      color: #B0B0B0;
    }

    &.error {
      border-color: #ef466f;
    }

    &:focus {
      border-color: transparent;
    }
  }
`;
const Index = ({
                   getGovNumber = () => {
                   },
                   defaultValue = null,
                   disabled = false,
                   ...rest
               }) => {
    const {register, handleSubmit, watch, control, formState: {errors}} = useForm();
    const [value, setValue] = useState('')
    useEffect(() => {
        setValue(`${watch("govNumber[0]")}${toUpper(watch("govNumber[1]"))}${watch("govNumber[2]")}${toUpper(watch("govNumber[3]"))}`)
    }, [watch("govNumber[0]"), watch("govNumber[1]"), watch("govNumber[2]"), watch("govNumber[3]")])

    useEffect(() => {
        if (!includes(value, 'undefined')) {
            getGovNumber(value)
        }
    }, [value])
    return (
        <Styled {...rest}>
            <Controller
                as={InputMask}
                control={control}
                name={'govNumber[0]'}
                render={({field}) => (
                    <InputMask
                        disabled={disabled}
                        defaultValue={slice(defaultValue,0, 2)}
                        {...field}
                        className={`input first`}
                        placeholder={'01'}
                        mask={'99'}
                        maskChar={'_'}
                    />
                )}
            />
            <Controller
                as={InputMask}
                control={control}
                name={'govNumber[1]'}
                render={({field}) => (
                    <InputMask
                        disabled={disabled}
                        defaultValue={slice(defaultValue,2, 3)}
                        {...field}
                        className={`input second`}
                        placeholder={'A'}
                        mask={'a'}
                        maskChar={'_'}
                    />
                )}
            />
            <Controller
                as={InputMask}
                control={control}
                name={'govNumber[2]'}
                render={({field}) => (
                    <InputMask
                        disabled={disabled}
                        defaultValue={slice(defaultValue,3, 6)}
                        {...field}
                        className={`input third`}
                        placeholder={'777'}
                        mask={'999'}
                        maskChar={'_'}
                    />
                )}
            />
            <Controller
                as={InputMask}
                control={control}
                name={'govNumber[3]'}
                render={({field}) => (
                    <InputMask
                        disabled={disabled}
                        defaultValue={slice(defaultValue,6, 8)}
                        {...field}
                        className={`input fourth`}
                        placeholder={'AA'}
                        mask={'aa'}
                        maskChar={'_'}
                    />
                )}
            />

            <div className=" uz">
                <img src={uzImg} alt="uz"/>
                <span>UZ</span>
            </div>
        </Styled>
    );
};

export default Index;