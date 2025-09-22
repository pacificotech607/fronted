import AsyncSelect from 'react-select/async';
import { StylesConfig } from 'react-select';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { get } from 'lodash';

interface OptionType {
    label: string;
    value: string;
}

interface AsyncSelectInputProps {
    entityName: string;
    labelField: string;
    isRequired?: boolean;
    defaultValue?: any;
    onChange: (value: any) => void;
    searchField: string;
    initialConditions?: string;
}

const AsyncSelectInput = ({ entityName, labelField, isRequired = false, defaultValue = null, onChange, searchField, initialConditions }: AsyncSelectInputProps) => {

    const [listOption, setListOption] = useState<OptionType[]>([]);
    const [defaultOption, setDefaultOption] = useState(null);


    useEffect(() => {
        if (defaultValue) {
            const option = {
                label: get(defaultValue, labelField),
                value: get(defaultValue, '_id'),
                ...defaultValue,
            };
            if (option.value && option.label) {
                setDefaultOption(option);
            }
        } else {
            setDefaultOption(null);
        }
        // Ensure the parent form is updated without causing crashes.
        onChange(defaultValue || {});
    }, [defaultValue, labelField]);

      const customStyles: StylesConfig = {
        control: (provided, state) => ({
            ...provided,
            // Aumenta el padding vertical para hacer el input más alto
            paddingTop: '6px', 
            paddingBottom: '6px',
            boxShadow: 'none',
            border: '1px solid #ced4da',
            '&:hover': {
                borderColor: '#ced4da',
            },
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#495057',
        }),
        input: (provided) => ({
            ...provided,
            caretColor: 'transparent',
        }),
    };

    const loadData = async () => {
        const query = initialConditions ? initialConditions : encodeURIComponent(JSON.stringify({}));
        const response = await axios.get(`api/${entityName}?page=0&size=20&query=${query}`);
        const data: any[] = get(response, 'data.data.docs', []);
        const options: any[] = data.map((d: any) => {
            return {
                label: get(d, labelField),
                value: get(d, '_id'),
                ...d
            }
        });
        setListOption(options);
    }

    useEffect(() => {
        loadData();
    }, []);

    const promiseOptions = async (inputValue: string) => {
        // Parse the initial conditions from the string, handling a potential empty string
        let baseConditions = {};
        if (initialConditions) {
            try {
                baseConditions = JSON.parse(decodeURIComponent(initialConditions));
            } catch (error) {
                console.error("Error parsing initialConditions:", error);
            }
        }

        // Create the search condition using searchField and inputValue
        const searchCondition = {
            [searchField]: { "$regex": `.*${inputValue}.*`, "$options": "i" }
        };

        // Combine both conditions into a single query object using $and
        const combinedQuery = {
            "$and": [
                baseConditions,
                searchCondition
            ]
        };

        // Stringify and encode the new combined query for the URL
        const encodedQuery = encodeURIComponent(JSON.stringify(combinedQuery));

        const response = await axios.get(`api/${entityName}?page=0&size=20&query=${encodedQuery}`);
        const data: any[] = get(response, 'data.data.docs', []);
        const options: any[] = data.map((d: any) => {
            return {
                label: get(d, labelField),
                value: get(d, '_id'),
                ...d
            }
        });

        return options;
    };

    const setOnChange = (selectedOption: any) => {
        setDefaultOption(selectedOption);
        // Pass the full object, or an empty object to avoid crashes on null.
        onChange(selectedOption || {});
    };

    return (
        <AsyncSelect
           styles={customStyles} // Asegúrate de pasar los estilos personalizados aquí
            cacheOptions
            defaultOptions={listOption}
            loadOptions={promiseOptions}
            onChange={setOnChange}
            value={defaultOption}
            required={isRequired}
        />
    );
};

export default AsyncSelectInput;
