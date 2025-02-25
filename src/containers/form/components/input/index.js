import React, {useEffect} from 'react';
import styled from "styled-components";
import {get, includes, isEmpty, isEqual} from "lodash";
import {ErrorMessage} from "@hookform/error-message";
import Label from "../../../../components/ui/label";
import classNames from "classnames";

const Styled = styled.div`
  .form-input {
    display: block;
    min-width:  ${({sm}) => sm ? 'unset': '275px'};
    width: 100%;
    padding:  ${({sm}) => sm ? '6px': '12px 18px'};
    color: #000;
    font-size: ${({sm}) => sm ? '14px': '16px'};
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
`;
const Input = ({
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
                   sm = false,
                   ...rest
               }) => {

    useEffect(() => {
        setValue(name, defaultValue)
    }, [defaultValue])

    useEffect(() => {
        getValueFromField(getValues(name), name);
    }, [watch(name)]);

    return (
        <Styled {...rest} sm={sm}>
            <div className="form-group">
                {!get(property, 'hideLabel', false) && <Label sm={sm}
                    className={classNames({required: get(property, 'hasRequiredLabel', get(params, 'required'))})}>{label ?? name}</Label>}
                {isEqual(get(property, 'type'), 'number') ? <input
                    className={classNames('form-input', {error: get(errors, `${name}`, false)})}
                    name={name}
                    {...register(name, params)}
                    placeholder={get(property, "placeholder")}
                    type={'number'}
                    disabled={get(property, "disabled")}
                    defaultValue={defaultValue}
                    min={get(property, 'min', 0)}
                    max={get(property, 'max', 100)}
                    step={get(property, 'step',0.01)}
                /> : <input
                    className={classNames('form-input', {error: get(errors, `${name}`, false)})}
                    name={name}
                    {...register(name, params)}
                    placeholder={get(property, "placeholder")}
                    type={get(property, "type", "text")}
                    disabled={get(property, "disabled")}
                    defaultValue={defaultValue}
                />}
                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({messages = 'Field is required'}) => {
                        if (get(get(errors, name), 'type') == 'required') {
                            messages = `${label ?? name} is required`;
                        }
                        if (get(get(errors, name), 'type') == "pattern") {
                            messages = `${label ?? name}  ${get(get(errors, name), 'message')}`;
                        }
                        if (get(get(errors, name), 'type') == 'manual') {
                            messages = `${label ?? name} ${errors[name].message}`;
                        }
                        return <small className="form-error-message"> {messages}</small>;
                    }}
                />
            </div>
        </Styled>
    );
};

export default Input;
