import React, { useState } from 'react';

interface GenericMultiTagSearchProps {
  searchOptions: { value: string; label: string }[];
  onSearchButtonClick: (query: string | null) => void;
}

interface Filter {
  field: string;
  value: string;
  label: string;
}

const GenericMultiTagSearch = ({ searchOptions, onSearchButtonClick }: GenericMultiTagSearchProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedField, setSelectedField] = useState(searchOptions[0].value);
    const [activeFilters, setActiveFilters] = useState<Filter[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleAddFilter = () => {
        if (searchTerm.trim() !== '') {
            const newFilter: Filter = {
                field: selectedField,
                value: searchTerm.trim(),
                label: `${searchOptions.find(opt => opt.value === selectedField)?.label}: ${searchTerm.trim()}`
            };
            const updatedFilters = [...activeFilters, newFilter];
            setActiveFilters(updatedFilters);
            setSearchTerm('');

            const queryConditions = updatedFilters.map(filter => ({
                [`${filter.field}`]: { $regex: filter.value, $options: 'i' }
            }));

            const query = JSON.stringify({
                $or: queryConditions
            });
            onSearchButtonClick(query);
        }
    };

    const handleRemoveFilter = (filterToRemove: Filter) => {
        const newFilters = activeFilters.filter(filter => filter.label !== filterToRemove.label);
        setActiveFilters(newFilters);

        if (newFilters.length > 0) {
            const queryConditions = newFilters.map(filter => ({
                [`${filter.field}`]: { $regex: filter.value, $options: 'i' }
            }));
            const query = JSON.stringify({
                $or: queryConditions
            });
            onSearchButtonClick(query);
        } else {
            onSearchButtonClick(null);
        }
    };

    return (
<div>
            <div className="row g-3">
                <div className="col-md-4">
                                    <select 
                    onChange={e => setSelectedField(e.target.value)} 
                    value={selectedField}
                    style={{
                        backgroundColor: '#0d6efd',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center'
                    }}
                >
                    {searchOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                    </select>
                </div>
                <div className="col-md-5">
                        <input
                        type="text"
                        placeholder="Agregar filtro"
                        value={searchTerm}
                        onChange={handleInputChange}
                        style={{ height: '50px' }}
                    />
                </div>
                <div className="col-md-2">
                    <button style={{ background: '#0d6efd', borderRadius: '10px' }} onClick={handleAddFilter}><i style={{ color: "#fff" }} className="bi bi-search"></i></button>
                </div>
            </div>


            {/* Lista de tags de filtros activos */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {activeFilters.map((filter, index) => (
                    <div 
                        key={index} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#0d6efd',
                            padding: '5px 5px',
                            borderRadius: '20px',
                            border: '1px solid #ccc',
                            color: "#fff",
                            height: '40px',
                            width: '200px'
                        }}
                    >
                        <span>{filter.label}</span>
                        <button 
                            onClick={() => handleRemoveFilter(filter)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                fontSize: '16px',
                                color: "#fff"
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenericMultiTagSearch;
