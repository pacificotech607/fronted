import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IMotorTransport } from '../../model/motorTransport.model';
import MotorTransportModal from './motorTransport-update';
import MotorTransportDetail from './motorTransport-detail';
import MotorTransportDelete from './motorTransport-delete';
import { IRootState } from '../../model/root-state';
import { getEntities } from './motorTransport.reducer';
import { get } from  'lodash';
import GenericMultiTagSearch from '../../utils/searchInput';

const MotorTransport: React.FC = () => {
  const dispatch = useDispatch();
  const motorTransports = useSelector((state: IRootState) => state.motorTransport.motorTransports);
  const totalPages = useSelector((state: IRootState) => state.motorTransport.totalPages);
  const activePage = useSelector((state: IRootState) => state.motorTransport.page);
  const [motorTransport, setMotorTransport] = useState<IMotorTransport | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(
    JSON.stringify([
      { $lookup: { from: 'operators', localField: 'operator', foreignField: '_id', as: 'operator' } },
      { $unwind: { path: '$operator', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'valuelists', localField: 'configuration', foreignField: '_id', as: 'configuration' } },
      { $unwind: { path: '$configuration', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'valuelists', localField: 'sctPermit', foreignField: '_id', as: 'sctPermit' } },
      { $unwind: { path: '$sctPermit', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'valuelists', localField: 'trailerType', foreignField: '_id', as: 'trailerType' } },
      { $unwind: { path: '$trailerType', preserveNullAndEmptyArrays: true } },
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
      { $lookup: { from: 'operators', localField: 'operator', foreignField: '_id', as: 'operator' } },
      { $unwind: { path: '$operator', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'valuelists', localField: 'configuration', foreignField: '_id', as: 'configuration' } },
      { $unwind: { path: '$configuration', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'valuelists', localField: 'sctPermit', foreignField: '_id', as: 'sctPermit' } },
      { $unwind: { path: '$sctPermit', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'valuelists', localField: 'trailerType', foreignField: '_id', as: 'trailerType' } },
      { $unwind: { path: '$trailerType', preserveNullAndEmptyArrays: true } },
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
    { value: 'number', label: 'Número' },
    { value: 'plate', label: 'Placa' },
    { value: 'sctPermitNumber', label: 'Número de Permiso SCT' },
    { value: 'insurance', label: 'Aseguradora' },
    { value: 'insurancePolicy', label: 'Póliza de Seguro' },
    { value: 'trailerPlate', label: 'Placa del Remolque' },
  ];

  return (
    <div className="app-main">
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Autotransporte</h3>
            </div>
            <div className="col-sm-6 text-end">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#motorTransportUpdateModal"
                onClick={() => setMotorTransport(null)}
              >
                Crear nuevo autotransporte
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
              <th>Número</th>
              <th>Configuración</th>
              <th>Placa</th>
              <th>Año</th>
              <th>Peso</th>
              <th>Permiso SCT</th>
              <th>Número de permiso SCT</th>
              <th>Aseguradora</th>
              <th>Póliza de seguro</th>
              <th>Tipo de remolque</th>
              <th>Placa del remolque</th>
              <th>Operador</th>
            </tr>
          </thead>
          <tbody>
            {motorTransports && motorTransports.map((motorTransport, i) => (
              <tr key={`entity-${i}`} className="align-middle">
                <td style={{ width: '10px' }}>
                  <div className="btn-group mb-2" role="group" aria-label="Basic outlined example">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#motorTransportUpdateModal"
                        onClick={() => setMotorTransport(motorTransport)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#motorTransportDetailModal"
                      onClick={() => setMotorTransport(motorTransport)}
                      title="Ver"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#motorTransportDeleteModal"
                      onClick={() => setMotorTransport(motorTransport)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
                <td>{motorTransport.number}</td>
                <td>{get(motorTransport.configuration, 'name')}</td>
                <td>{motorTransport.plate}</td>
                <td>{motorTransport.year}</td>
                <td>{motorTransport.weight}</td>
                <td>{get(motorTransport.sctPermit,'name')}</td>
                <td>{motorTransport.sctPermitNumber}</td>
                <td>{motorTransport.insurance}</td>
                <td>{motorTransport.insurancePolicy}</td>
                <td>{get(motorTransport.trailerType,'name')}</td>
                <td>{motorTransport.trailerPlate}</td>
                <td>{get(motorTransport.operator, 'name')}</td>
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
      <MotorTransportModal motorTransport={motorTransport} refresh={() => {dispatch(getEntities(0, 20, searchQuery || undefined));} } />
      <MotorTransportDetail motorTransport={motorTransport} />
      <MotorTransportDelete motorTransport={motorTransport} refresh={() => {dispatch(getEntities(0, 20, searchQuery || undefined));} } />
    </div>
  );
};

export default MotorTransport;
