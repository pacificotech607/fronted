import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuelModal from './fuel-update';
import { IFuel } from '../../model/fuel.model';
import FuelDetail from './fuel-detail';
import FuelDelete from './fuel-delete';
import { IRootState } from '../../model/root-state';
import { getEntities } from './fuel.reducer';
import { get } from 'lodash';
import GenericMultiTagSearch from '../../utils/searchInput';

const Fuel: React.FC = () => {
    const dispatch = useDispatch();
    const fuels = useSelector((state: IRootState) => state.fuel.fuels);
    const totalPages = useSelector((state: IRootState) => state.fuel.totalPages);
    const activePage = useSelector((state: IRootState) => state.fuel.page);
    const [fuel, setFuel] = useState<IFuel | null>(null);
    const [searchQuery, setSearchQuery] = useState<string | null>(
        JSON.stringify([
            { $lookup: { from: 'motortransports', localField: 'transport', foreignField: '_id', as: 'transport' } },
            { $unwind: { path: '$transport', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'operators', localField: 'operator', foreignField: '_id', as: 'operator' } },
            { $unwind: { path: '$operator', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'tabs', localField: 'tabulator', foreignField: '_id', as: 'tabulator' } },
            { $unwind: { path: '$tabulator', preserveNullAndEmptyArrays: true } },
            { $match: { alive: true } },
        ])
    );
    useEffect(() => {
        dispatch(getEntities(0, 20, searchQuery || undefined));
    }, [dispatch, searchQuery]);

    const handlePagination = (page: number) => {
        dispatch(getEntities(page, 20, searchQuery || undefined));
    };

    const handleSearch = (query: string | null) => {
        const baseQuery = [
            { $lookup: { from: 'motortransports', localField: 'transport', foreignField: '_id', as: 'transport' } },
            { $unwind: { path: '$transport', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'operators', localField: 'operator', foreignField: '_id', as: 'operator' } },
            { $unwind: { path: '$operator', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'tabs', localField: 'tabulator', foreignField: '_id', as: 'tabulator' } },
            { $unwind: { path: '$tabulator', preserveNullAndEmptyArrays: true } },
        ];

        let matchStage: any = { $match: { alive: true } };

        if (query) {
            try {
                const userQuery = JSON.parse(query);
                matchStage = { $match: { $and: [{ alive: true }, userQuery] } };
            } catch (error) {
                console.error('Failed to parse search query:', error);
            }
        }

        const finalQuery = [...baseQuery, matchStage];
        const finalQueryString = JSON.stringify(finalQuery);
        setSearchQuery(finalQueryString);
        dispatch(getEntities(0, 20, finalQueryString));
    };

    const searchOptions = [
        // Relaciones
        { value: 'transport.number', label: 'Número de Transporte' },
        { value: 'operator.name', label: 'Nombre del Operador' },
        { value: 'tabulator.description', label: 'Descripción del Tabulador' },
        
        // Campos de combustible
        { value: 'dieselInitial', label: 'Diesel Inicial' },
        { value: 'dieselLoaded', label: 'Diesel Cargado' },
        { value: 'dieselReturn', label: 'Diesel Retorno' },
        { value: 'litersLoaded', label: 'Litros Cargados' },
        { value: 'pricePerLiter', label: 'Precio por Litro' },
        { value: 'fuelDate', label: 'Fecha de Combustible' },
        { value: 'typeFuel', label: 'Tipo de Combustible' },
        { value: 'fuelConsumption', label: 'Consumo de Combustible' },
        { value: 'efficiency', label: 'Eficiencia' },
        { value: 'observations', label: 'Observaciones' },
        
        // Campos de sistema
        { value: 'createdAt', label: 'Fecha de Creación' },
        { value: 'updatedAt', label: 'Fecha de Actualización' },
    ];

    return (
        <div className="app-main">
            <div className="app-content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="mb-0">Cargar combustible</h3>
                        </div>
                        <div className="col-sm-6 text-end">
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#fuelUpdateModal"
                                onClick={() => setFuel(null)}
                            >
                                Cargar combustible
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="app-content" style={{ margin: '10px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <GenericMultiTagSearch
                        searchOptions={searchOptions}
                        onSearchButtonClick={handleSearch}
                    />
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Acciones</th>
                                <th>Transporte</th>
                                <th>Operador</th>
                                <th>Diesel Inicial</th>
                                <th>Diesel Retorno</th>
                                <th>Litros Cargados</th>
                                <th>Precio por Litro</th>
                                <th>Fecha Combustible</th>
                                <th>Tipo Combustible</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fuels && fuels.map((fuel, i) => (
                                <tr key={`entity-${i}`} className="align-middle">
                                    <td style={{ width: '10px' }}>
                                        <div className="btn-group mb-2" role="group" aria-label="Basic outlined example">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                data-bs-toggle="modal"
                                                data-bs-target="#fuelUpdateModal"
                                                onClick={() => setFuel(fuel)}
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                data-bs-toggle="modal"
                                                data-bs-target="#fuelDetailModal"
                                                onClick={() => setFuel(fuel)}
                                                title="Ver"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td>{get(fuel.transport, 'number', '')}</td>
                                    <td>{get(fuel.operator, 'name', '')}</td>
                                    <td>{fuel.dieselInitial}</td>
                                    <td>{fuel.dieselReturn}</td>
                                    <td>{fuel.litersLoaded}</td>
                                    <td>${fuel.pricePerLiter}</td>
                                    <td>{fuel.fuelDate}</td>
                                    <td>{fuel.typeFuel}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card-footer d-flex justify-content-center">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className={`page-item ${activePage === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePagination(activePage - 1)} disabled={activePage === 0}>Previous</button>
                        </li>
                        {Array.from(Array(totalPages).keys()).map(i => (
                            <li key={i} className={`page-item ${activePage === i ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePagination(i)}>{i + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${activePage === totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePagination(activePage + 1)} disabled={activePage === totalPages - 1}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
            <FuelModal fuel={fuel} refresh={() => { dispatch(getEntities(0, 20, searchQuery || undefined)); }} />
            <FuelDetail fuel={fuel} />
            <FuelDelete fuel={fuel} refresh={() => { dispatch(getEntities(0, 20, searchQuery || undefined)); }} />
        </div>
    );
};

export default Fuel;