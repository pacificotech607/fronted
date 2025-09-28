import React, { useState } from 'react';

interface GenericMultiTagSearchProps {
    searchOptions: { value: string; label: string }[];
    onSearchButtonClick: (query: string | null) => void;
    permanentFilters?: { label: string }[];
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
        <div className="search-container" style={{ maxWidth: '600px' }}>
            <div className="row g-0 mb-3">
                <div className="col-4">
                    <select
                        className="form-select h-100 text-white border-0 rounded-start"
                        onChange={e => setSelectedField(e.target.value)}
                        value={selectedField}
                        style={{
                            backgroundColor: '#0d6efd',
                            minHeight: '50px',
                            borderTopRightRadius: '0',
                            borderBottomRightRadius: '0'
                        }}
                    >
                        {searchOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-6">
                    <input
                        type="text"
                        className="form-control h-100 border-0"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        style={{ 
                            minHeight: '48px',
                            borderRadius: '0',
                            fontSize: '16px' // Prevent zoom on iOS
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAddFilter();
                            }
                        }}
                    />
                </div>
                <div className="col-2">
                    <button 
                        className="btn btn-primary w-100 h-100 border-0 rounded-end d-flex align-items-center justify-content-center"
                        onClick={handleAddFilter}
                        type="button"
                        style={{ 
                            minHeight: '48px',
                            borderTopLeftRadius: '0',
                            borderBottomLeftRadius: '0'
                        }}
                    >
                        <i className="bi bi-search fs-6"></i>
                    </button>
                </div>
            </div>

            {/* Lista de filtros activos - Compacta */}
            <div className="d-flex flex-wrap gap-1 mt-2">
                {activeFilters.map((filter, index) => (
                    <div
                        key={index}
                        className="badge bg-primary d-flex align-items-center gap-1 px-2 py-1 small"
                        style={{
                            borderRadius: '15px',
                            minHeight: '32px',
                            maxWidth: '120px',
                            wordWrap: 'break-word',
                            fontSize: '0.8rem'
                        }}
                    >
                        <span className="flex-grow-1 text-truncate">{filter.label}</span>
                        <button
                            onClick={() => handleRemoveFilter(filter)}
                            className="btn-close btn-close-white btn-sm ms-1"
                            type="button"
                            aria-label="Eliminar filtro"
                            style={{
                                fontSize: '0.8rem',
                                opacity: 0.8
                            }}
                        >
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenericMultiTagSearch;
