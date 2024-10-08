import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Label from "../../../../components/ui/label";
import {get, isEmpty, isFunction, isEqual} from "lodash";
import {ErrorMessage} from "@hookform/error-message";
import {Calendar} from "react-feather";
import dayjs from "dayjs";
import ru from "date-fns/locale/ru"
import MaskedInput from "react-input-mask";
import classNames from "classnames";

const Styled = styled.div`
  .react-datepicker-wrapper {
    display: block;
  }

  .custom-datepicker {
    display: block;
    min-width: ${({sm}) => sm ? 'unset': '275px'};
    width: 100%;
    padding: ${({sm}) => sm ? '6px 16px 7px 9px': ' 12px 32px 12px 18px'};
    color: #000;
    font-size: ${({sm}) => sm ? '14px': '16px'};
    border: 1px solid #BABABA;
    border-radius: 5px;
    outline: none;
    font-family: 'Gilroy-Regular', sans-serif;
  }

  .custom__box {
    position: relative;

    .custom__icon {
      position: absolute;
      right: 8px;
      top: ${({sm}) => sm ? '3px': '10px'};
      width:  ${({sm}) => sm ? '16px': 'unset'};
    }

  }
`;

const CustomDatepicker = ({
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
                              dateFormat = "YYYY-MM-DD",
                              sm = false,
                              ...rest
                          }) => {
    const [startDate, setStartDate] = useState(null);

    useEffect(() => {
        setValue(name, startDate ? dayjs(startDate).format(dateFormat) : null)
        if (get(property, 'onChange') && isFunction(get(property, 'onChange')) && !isEqual(defaultValue, startDate)) {
            get(property, 'onChange')(startDate)
        }
    }, [startDate])

    useEffect(() => {
        if (defaultValue && !isEqual(defaultValue, startDate)) {
            if (dayjs(defaultValue).isValid()) {
                setStartDate(dayjs(defaultValue).toDate())
            }
        }
    }, [defaultValue])
    useEffect(() => {
        if (startDate) {
            getValueFromField(getValues(name), name);
        }
    }, [watch(name)]);
    return (
        <Styled {...rest} sm={sm}>
            <div className="form-group">
                {!get(property, 'hideLabel', false) && <Label sm={sm}
                    className={classNames({required: get(property, 'hasRequiredLabel', get(params, 'required'))})}>{label ?? name}</Label>}
                <div className={"custom__box"}>
                    <DatePicker
                        minDate={get(property, 'minDate')}
                        locale={ru}
                        calendarStartDay={1}
                        dateFormat={get(property, 'dateFormat', 'dd.MM.yyyy')}
                        className={`custom-datepicker ${!isEmpty(errors) ? "error" : ''}`}
                        selected={startDate ? dayjs(startDate).toDate() : null}
                        onChange={(date) => {
                            if (dayjs(date).isValid()) {
                                setStartDate(date)
                            }
                        }}
                        customInput={
                            <MaskedInput mask={'99.99.9999'}/>
                        }
                        allowClear
                        readOnly={disabled}
                    />
                    <Calendar className={'custom__icon'}/>
                </div>
                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({messages = `${label} is required`}) => {

                        if (errors[name]?.type == 'required') {
                            messages = `${label} is required`;
                        }
                        if (errors[name]?.type == 'pattern') {
                            messages = `${label} is not valid`;
                        }
                        if (errors[name]?.type == 'manual') {
                            messages = `${label} ${errors[name].message}`;
                        }
                        return <small className="form-error-message"> {messages}</small>;
                    }}
                />
            </div>
        </Styled>
    );
};

export default CustomDatepicker;
