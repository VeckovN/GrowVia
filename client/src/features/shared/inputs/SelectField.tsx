import { FC } from "react";
import { SelectFieldPropsInterface } from "../interfaces";

const SelectField:FC<SelectFieldPropsInterface> = ({
    id,
    name,
    value = '',
    onChange,
    options,
    className = '',
    placeholder = 'Select an option',
    disabled = false
}) => {
    return(
        <select
            disabled={disabled}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-4 ${className}`}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

export default SelectField;