import AsyncSelect from 'react-select/async';
import axios from 'axios';

interface AsyncSelectInputProps {
    entityName: string;
    labelField: string;
    isRequired?: boolean;
    defaultValue?: any;
    onChange: (value: any) => void;
    filter?: string;
}

const AsyncSelectInput = ({ entityName, labelField, isRequired = false, defaultValue = null, onChange, filter }: AsyncSelectInputProps) => {
    const fetchOptions = async (inputValue: string) => {
        try {
            const response = await axios.get(`api/${entityName}?search=${inputValue}&page=0&size=20${filter || ''}`);
            const data = response.data.data.docs;
            
            return data.map((item: any) => ({
                label: item[labelField],
                value: item._id, 
                ...item
            }));
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    };

    const handleChange = (selectedOption: any) => {
        if (onChange) {
            onChange(selectedOption);
        }
    };

    return (
        <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={fetchOptions}
            onChange={handleChange}
            placeholder={`Selecciona un/a ${entityName}...`}
            noOptionsMessage={() => "No se encontraron resultados"}
            isClearable
            defaultValue={defaultValue && typeof defaultValue === 'object' ? {
                label: defaultValue[labelField],
                value: defaultValue._id,
                ...defaultValue
            } : null}
            // Prop para marcar como requerido en formularios
            required={isRequired}
        />
    );
};

export default AsyncSelectInput;
