import React, {useState, useEffect} from 'react';
import {components} from 'react-select';
import RAsyncSelect from 'react-select/async';
import clsx from "clsx";
import arrowIcon from "../../../../assets/images/caret-down.png";
import {Controller} from "react-hook-form";
import {get, hasIn, debounce} from "lodash";
import {useTranslation} from "react-i18next";
import {useGetAllQuery} from "../../../../hooks/api";
import Label from "../../../../components/ui/label";
import classNames from "classnames";

const DropdownIndicator = props => {
    return (
        components.DropdownIndicator && (
            <components.DropdownIndicator {...props}>
                <img src={arrowIcon} alt={'arrow'}/>
            </components.DropdownIndicator>
        )
    );
};
const customStyles = (hasError = false) => ({
    control: (base, state, error) => ({
        ...base,
        background: "#fff",
        borderColor: error ? "#ef466f" : "#BABABA",
        borderRadius: '5px',
        outline: "none",
        boxShadow: "none",
        color: "#7E7E7E",
        display: "flex",
        overflow: 'hidden',
        padding: '4px 12px',
        width: '100%',
        minHeight: '40px',
        maxWidth: '400px',
        fontSize: '16px',
        fontWeight: '300',
        "&:hover": {
            borderColor: '#13D6D1',
            outline: "none",
        },
        "&:focus": {
            borderColor: '#13D6D1',
            outline: "none",
        }
    }),
    indicatorSeparator: (base, state) => ({
        ...base,
        display: 'none'
    })
});
const AsyncSelect = ({
                         control,
                         property,
                         isMulti = false,
                         name,
                         errors,
                         placeholder = 'Не выбран',
                         params,
                         label = '',
                         classNames = '',
                         defaultValue = null,
                         getValues = () => {
                         },
                         watch = () => {
                         },
                         url = '',
                         limit = 100,
                         keyId = 'list',
                         isDisabledSearch = false
                     }) => {
    const [options, setOptions] = useState([])
    const [search, setSearch] = useState('')
    const {data, isLoading: loading} = useGetAllQuery({
        key: [keyId, search, url], url: url, params: {
            params: {
                limit,
                // name: isDisabledSearch ? null : search
            }
        }
    })
    const {t} = useTranslation()

    useEffect(() => {
        if (data) {
            setOptions(get(data, 'data.data', get(data, 'data', [])))
        }
    }, [data, search, name]);

    const changeHandler = (val) => {
        setSearch(val)
    }

    const debouncedChangeHandler = debounce(changeHandler, 500)

    const loadOptions = async (inputValue) => {
        await debouncedChangeHandler(inputValue)
        return options;
    }
    return (
        <div className={clsx(`form-group ${classNames}`)}>
            {!get(property, 'hideLabel', false) && <Label
                className={clsx({required: get(property, 'hasRequiredLabel', get(params, 'required'))})}>{label ?? name}</Label>}
            <Controller
                as={RAsyncSelect}
                control={control}
                name={name}
                rules={params}
                defaultValue={defaultValue}
                render={({field}) => <RAsyncSelect
                    {...field}
                    name={name}
                    isClearable
                    getOptionLabel={(option) => get(option, get(property, 'optionLabel', 'name'))}
                    getOptionValue={(option) => get(option, get(property, 'optionValue', '_id'))}
                    clearIndicator={true}
                    styles={customStyles(hasIn(errors, name))}
                    components={{DropdownIndicator}}
                    placeholder={placeholder}
                    isMulti={isMulti}
                    defaultOptions={options}
                    options={options}
                    loadOptions={loadOptions}
                    isLoading={loading}
                    cacheOptions
                />}
            />
            {errors[name]?.type == 'required' &&
                <span className={'form-error'}>{t('Заполните обязательное поле')}</span>}
            {errors[name]?.type == 'validation' &&
                <span className={'form-error'}>{get(errors, `${name}.message`)}</span>}
        </div>
    );
};

export default AsyncSelect;