import React, {useEffect} from 'react';
import styled from "styled-components";
import {get, isFunction} from "lodash";
import {ErrorMessage} from "@hookform/error-message";
import Label from "../../../../components/ui/label";
import NumberFormat from 'react-number-format';
import classNames from "classnames";

const Styled = styled.div`
  .masked-input {
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
    max-width: 400px;

    &.error {
      border-color: #ef466f;
    }

    &:focus {
      border-color: #13D6D1;
    }
  }
`;
const NumberFormatInputFilter = ({
                               Controller,
                               control,
                               register,
                               disabled = false,
                               name,
                               errors,
                               params,
                               property,
                               defaultValue = undefined,
                               getValues,
                               watch,
                               label,
                               setValue,
                               getValueFromField = () => {
                               },
                               resetField,
                               isNumericString = false,
                               reset,
                               ...rest
                           }) => {


    useEffect(() => {
        if (get(property, 'onChange') && isFunction(get(property, 'onChange'))) {
            get(property, 'onChange')(getValues(name))
        }
    }, [watch(name)])

    useEffect(() => {
        getValueFromField(getValues(name), name);
    }, [watch(name)]);

    useEffect(()=>{
        if(defaultValue) {
            setValue(name, defaultValue)
        }
    },[defaultValue])
    return (
        <Styled {...rest}>
            <div className="form-group">
                {!get(property, 'hideLabel', false) && <Label
                    className={classNames({required: get(property, 'hasRequiredLabel', get(params, 'required'))})}>{label ?? name}</Label>}
                <Controller
                    control={control}
                    name={name}
                    rules={params}
                    render={({field: {onChange, name, value, ref}}) => (
                        <NumberFormat
                            value={value}
                            defaultValue={defaultValue}
                            className={`masked-input ${get(errors, `${name}`) ? "error" : ''}`}
                            placeholder={get(property, "placeholder")}
                            suffix={get(property, "suffix", '')}
                            thousandSeparator={get(property, "thousandSeparator", " ")}
                            onValueChange={(values) => onChange(values.floatValue)}
                            isNumericString={isNumericString}
                            allowNegative={get(property, "allowNegative", false)}
                            disabled={get(property, 'disabled', false)}
                            ref={ref}
                            name={name}
                        />
                    )}
                />
                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={() => {
                        let messages = '';
                        if (get(errors, `${name}.type`) === 'required') {
                            messages = `${label ?? name} is required`;
                        } else if (get(errors, `${name}.type`) === 'pattern') {
                            messages = `${label ?? name} is not valid`;
                        } else {
                            messages = `${label ?? name} ${errors[name]?.message}`;
                        }

                        return <small className="form-error-message"> {messages}</small>;
                    }}
                />
            </div>
        </Styled>
    );
};

export default NumberFormatInputFilter;