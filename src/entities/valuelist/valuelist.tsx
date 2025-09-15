import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IValuelist } from '../../model/valuelist.model';
import ValuelistModal from './valuelist-update';
import ValuelistDetail from './valuelist-detail';
import ValuelistDelete from './valuelist-delete';
import { IRootState } from '../../model/root-state';
import { getEntities } from './valuelist.reducer';

const Valuelist: React.FC = () => {
  const dispatch = useDispatch();
  const valuelists = useSelector((state: IRootState) => state.valuelist.valuelists);
  const totalPages = useSelector((state: IRootState) => state.valuelist.totalPages);
  const activePage = useSelector((state: IRootState) => state.valuelist.page);

  useEffect(() => {
    dispatch(getEntities());
  }, [dispatch]);

  const [valuelist, setValuelist] = useState<IValuelist | null>(null);

  const handlePagination = (page: number) => {
    dispatch(getEntities(page));
  };

  return (
    <div className="app-main">
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Valuelists</h3>
            </div>
            <div className="col-sm-6 text-end">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#valuelistUpdateModal"
                onClick={() => setValuelist(null)}
              >
                Crear nuevo valuelist
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
              <th>Type</th>
              <th>Name</th>
              <th>English Label</th>
              <th>Spanish Label</th>
            </tr>
          </thead>
          <tbody>
            {valuelists && valuelists.map((valuelist, i) => (
              <tr key={`entity-${i}`} className="align-middle">
                <td style={{ width: '10px' }}>
                  <div className="btn-group mb-2" role="group" aria-label="Basic outlined example">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#valuelistUpdateModal"
                        onClick={() => setValuelist(valuelist)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#valuelistDetailModal"
                      onClick={() => setValuelist(valuelist)}
                      title="Ver"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#valuelistDeleteModal"
                      onClick={() => setValuelist(valuelist)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
                <td>{valuelist.type}</td>
                <td>{valuelist.name}</td>
                <td>{valuelist.enLabel}</td>
                <td>{valuelist.esLabel}</td>
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
      <ValuelistModal valuelist={valuelist} refresh={() => {dispatch(getEntities());} } />
      <ValuelistDetail valuelist={valuelist} />
      <ValuelistDelete valuelist={valuelist} refresh={() => {dispatch(getEntities());} } />
    </div>
  );
};

export default Valuelist;
