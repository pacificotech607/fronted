import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IMotorTransport } from '../../model/motorTransport.model';
import MotorTransportModal from './motorTransport-update';
import MotorTransportDetail from './motorTransport-detail';
import MotorTransportDelete from './motorTransport-delete';
import { IRootState } from '../../model/root-state';
import { getEntities } from './motorTransport.reducer';

const MotorTransport: React.FC = () => {
  const dispatch = useDispatch();
  const motorTransports = useSelector((state: IRootState) => state.motorTransport.motorTransports);
  const totalPages = useSelector((state: IRootState) => state.motorTransport.totalPages);
  const activePage = useSelector((state: IRootState) => state.motorTransport.page);

  useEffect(() => {
    dispatch(getEntities());
  }, [dispatch]);

  const [motorTransport, setMotorTransport] = useState<IMotorTransport | null>(null);

  const handlePagination = (page: number) => {
    dispatch(getEntities(page));
  };

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
        {<table className="table table-bordered">
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
                <td>{motorTransport.configuration}</td>
                <td>{motorTransport.plate}</td>
                <td>{motorTransport.year}</td>
                <td>{motorTransport.weight}</td>
                <td>{motorTransport.sctPermit}</td>
                <td>{motorTransport.sctPermitNumber}</td>
                <td>{motorTransport.insurance}</td>
                <td>{motorTransport.insurancePolicy}</td>
                <td>{motorTransport.trailerType}</td>
                <td>{motorTransport.trailerPlate}</td>
                <td>{motorTransport.operator}</td>
              </tr>
            ))}
          </tbody>
        </table>}
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
      <MotorTransportModal motorTransport={motorTransport} refresh={() => {dispatch(getEntities());} } />
      <MotorTransportDetail motorTransport={motorTransport} />
      <MotorTransportDelete motorTransport={motorTransport} refresh={() => {dispatch(getEntities());} } />
    </div>
  );
};

export default MotorTransport;
