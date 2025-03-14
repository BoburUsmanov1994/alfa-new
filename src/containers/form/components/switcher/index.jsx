import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Label from "../../../../components/ui/label";
import Switch from "react-switch";
import Flex from "../../../../components/flex";
import classNames from "classnames";
import {get, head, last, isEmpty, isFunction} from "lodash";

const Styled = styled.div`
  .switch {
    margin: 0 16px;
  }

  span {
    font-family: 'Gilroy-Medium', sans-serif;
    font-size:   ${({sm}) => sm ? '12px': '16px'};
  }
  label {
    margin-bottom:     ${({sm}) => sm ? '5x': '15px'};
  }
`;
const Switcher = ({
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
                      options = [
                          {
                              value: false,
                              label: 'Нет'
                          },
                          {
                              value: true,
                              label: 'Да'
                          },
                      ],
                      sm = false,
                      ...rest
                  }) => {
    const [checked, setChecked] = useState(false)
    options = isEmpty(options) ? [
        {
            value: false,
            label: 'Нет'
        },
        {
            value: true,
            label: 'Да'
        },
    ] : options

    useEffect(() => {
        setChecked(defaultValue)
    }, [defaultValue])

    useEffect(() => {
        if (checked) {
            setValue(name, get(last(options), 'value', true))
        } else {
            setValue(name, get(head(options), 'value', false))
        }

    }, [checked])

    useEffect(() => {
        getValueFromField(getValues(name), name);
        if (isFunction(get(property, 'onChange'))) {
            get(property, 'onChange')(watch(name))
        }
    }, [watch(name)]);

    return (
        <Styled {...rest} sm={sm}>
            <div className="form-group">
                {!get(property, 'hideLabel', false) && <Label sm={sm}
                    className={classNames({required: get(property, 'hasRequiredLabel', get(params, 'required'))})}>{label ?? name}</Label>}
                <Flex>
                    <span>{get(head(options), 'label', '-')}</span>
                    <Switch
                        checked={checked}
                        onChange={(val) => {
                            setChecked(val);
                            if (isFunction(get(property, 'handleChange'))) {
                                property?.handleChange(val)
                            }
                        }}
                        onColor={'#5BBA7C'}
                        offColor={'#C8C8C8'}
                        activeBoxShadow={'0 0 2px 3px #5BBA7C'}
                        className={'switch'}
                        disabled={disabled}
                    />
                    <span>{get(last(options), 'label', '-')}</span>
                </Flex>
            </div>
        </Styled>
    );
};

export default Switcher;
