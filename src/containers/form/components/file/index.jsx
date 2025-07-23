import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {get} from "lodash";
import {ErrorMessage} from "@hookform/error-message";
import Label from "../../../../components/ui/label";
import classNames from "classnames";
import Dropzone from 'react-dropzone'
import {Paperclip} from "react-feather";

const Styled = styled.div`
  .form-input {
    display: block;
    min-width: 275px;
    width: 100%;
    padding: 12px 18px;
    color: #000;
    font-size: 16px;
    border: 1px solid #BABABA;
    border-radius: 5px;
    outline: none;
    font-family: 'Gilroy-Regular', sans-serif;

    &.error {
      border-color: #ef466f;
    }

    &:focus {
      border-color: #13D6D1;
    }
  }

  button {
    background-color: transparent;
    padding: 10px 15px;
    border: 1px solid #949494;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    color: #000;
    cursor: pointer;
    display: flex;
    align-items: center;
    min-width: 175px;
    width: 100%;
    justify-content: center;
    font-family: 'Gilroy-Medium', sans-serif;
    font-size: 16px;

    span {
      margin-right: 10px;
    }
  }
`;
const File = ({
                            register,
                            disabled = false,
                            name,
                            errors,
                            params,
                            property,
                            defaultValue,
                            getValues,
                            watch,
                            label,
                            setValue,
                            getValueFromField = () => {
                            },
                            ...rest
                        }) => {
    const [file,setFile] = useState(null)

    useEffect(() => {
        setValue(name, defaultValue)
    }, [defaultValue])

    useEffect(() => {
        getValueFromField(getValues(name), name);
    }, [watch(name)]);

    const upload = (files) => {
        setFile(files[0])
        setValue(name, files[0])
    }
    return (
        <Styled {...rest}>
            <div className="form-group">
                {!get(property, 'hideLabel', false) && <Label
                    className={classNames({required: get(property, 'hasRequiredLabel', false)})}>{label ?? name}</Label>}
                <Dropzone onDrop={acceptedFiles => upload(acceptedFiles)}>
                    {({getRootProps, getInputProps}) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <button type={'button'}><span>Прикрепить файл</span> <Paperclip size={18}/></button>
                            </div>
                            {file && <div style={{marginTop:'10px',position:'relative',paddingTop:'5px'}}>
                                <a target={"_self"}  style={{display:'flex',alignItems:'center'}}><span style={{marginLeft:'8px'}}>{get(file,'name')}</span></a>
                            </div>}
                        </section>
                    )}
                </Dropzone>
                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({messages = `${label} is required`}) => {

                        if (errors[name].type == 'required') {
                            messages = `${label} is required`;
                        }
                        if (errors[name].type == 'pattern') {
                            messages = `${label} is not valid`;
                        }
                        if (errors[name].type == 'manual') {
                            messages = `${label} ${errors[name].message}`;
                        }
                        return <small className="form-error-message"> {messages}</small>;
                    }}
                />
            </div>
        </Styled>
    );
};

export default File;
