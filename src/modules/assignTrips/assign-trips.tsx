import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IBLS } from '../../model/bls.model';
import { IRootState } from '../../model/root-state';
import GenericMultiTagSearch from '../../utils/searchInput';
import { blsAggregateAssignTrip, statusBls } from '../../constants/bls.constans';
import { get } from 'lodash';
import { getEntities } from '../../entities/bls/bls.reducer';
import BlsDetailContainer from '../../entities/bls/bls-detail-container';
import AssignTripsUnit  from './assign-trips-unit';

const AssignTrips: React.FC = () => {
    const dispatch = useDispatch();
    const bls = useSelector((state: IRootState) => state.bls.bls);
    const totalPages = useSelector((state: IRootState) => state.bls.totalPages);
    const activePage = useSelector((state: IRootState) => state.bls.page);
    const [blContainer, setBlContainer] = useState<IBLS | null>(null);
    const [bl, setBl] = useState<IBLS | null>(null);
    const [viewHistory, setViewHistory] = useState(false);

    const [searchQuery, setSearchQuery] = useState<string | null>(
        JSON.stringify([
            ...blsAggregateAssignTrip,
            { $match: { alive: true, status: statusBls.inactive.value } },
        ])
    );

    useEffect(() => {
        dispatch(getEntities(0, 20, searchQuery || undefined));
    }, [dispatch, searchQuery]);

    const handlePagination = (page: number) => {
        dispatch(getEntities(page, 20, searchQuery || undefined));
    };

    const handleSearch = (query: string | null) => {
        const baseQuery = blsAggregateAssignTrip;
        const status = viewHistory ? statusBls.assignedPort.value : statusBls.inactive.value;

        let matchStage: any = { $match: { alive: true, status } };

        if (query) {
            try {
                const userQuery = JSON.parse(query);
                matchStage = { $match: { $and: [{ alive: true, status }, userQuery] } };
            } catch (error) {
                console.error('Failed to parse search query:', error);
            }
        }

        const finalQuery = [...baseQuery, matchStage];
        const finalQueryString = JSON.stringify(finalQuery);
        setSearchQuery(finalQueryString);
    };

    const searchOptions = [
        { value: 'motorTransport.number', label: 'Autotransporte' },
        { value: 'operator.name', label: 'Operador' },
        { value: 'dateTimeArrivalPort', label: 'Fecha y hora de llegada' },
        { value: 'bl', label: 'Bl' },
        { value: 'status', label: 'Estatus' },
    ];

    const handleToggleView = () => {
        const newViewHistory = !viewHistory;
        const status = newViewHistory ? statusBls.assignedTrip.value : statusBls.inactive.value;
        const baseQuery = blsAggregateAssignTrip;
        const matchStage = { $match: { alive: true, status } };
        const finalQuery = [...baseQuery, matchStage];
        setSearchQuery(JSON.stringify(finalQuery));
        setViewHistory(newViewHistory);
    };


    return (
        <div className="app-main">
            <div className="app-content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="mb-0">Asignar unidades a viajes</h3>
                        </div>
                        <div className="col-sm-6 text-end">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleToggleView}
                            >
                                {viewHistory ? 'Ver disponibles' : 'Ver Historial'}
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
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Autotransporte</th>
                                <th>Operador</th>
                                <th>Fecha de salida</th>
                                <th>Bl</th>
                                <th>Estatus</th>
                                <th>Contenedores</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bls && bls.map((bl, i) => (
                                <tr key={`entity-${i}`} className="align-middle">
                                    <td className='text-center'>                    
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#blsAssignTripsModal"
                                        onClick={() => setBl(bl)}
                                        title="Asignar unidades"
                                        disabled={Object.values(statusBls).find(s => s.value === bl.status)?.value !== statusBls.inactive.value}
                                    >
                                    <i className="bi bi-node-plus-fill"></i>
                                    </button></td>
                                    <td>{get(bl.origin, 'esLabel')}</td>
                                    <td>{get(bl.destination, 'esLabel')}</td>
                                    <td>{bl.motorTransport?.number}</td>
                                    <td>{bl.operator?.name}</td>
                                    <td>{bl.departureDate}</td>
                                    <td>{bl.bl}</td>
                                    <td className='text-center'>
                                        <span
                                            style={{
                                                backgroundColor: get(Object.values(statusBls).find(s => s.value === bl.status), 'color', 'gray'),
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '10px',
                                            }}
                                        >
                                            {get(Object.values(statusBls).find(s => s.value === bl.status), 'esLabel', '')}
                                        </span>
                                    </td>
                                    <td className='text-center'><button type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#blDetailContainerModal"
                                        onClick={() => setBlContainer(bl)}
                                        title="Ver Contenedores" style={{ background: 'transparent', border: 'none' }}><i className="bi bi-inboxes" style={{ color: '#0dcaf0' }}></i></button></td>
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
            <BlsDetailContainer bl={blContainer} />
            <AssignTripsUnit bls={bl} refresh={() => { dispatch(getEntities(0, 20, searchQuery || undefined)); }} />
        </div>
    );
};

export default AssignTrips;
