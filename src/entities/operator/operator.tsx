import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IOperator } from '../../model/operator.model';
import OperatorUpdate from './operator-update';
import OperatorDetail from './operator-detail';
import OperatorDelete from './operator-delete';
import { IRootState } from '../../model/root-state';
import { getEntities } from './operator.reducer';
import GenericMultiTagSearch from '../../utils/searchInput';

const Operator: React.FC = () => {
  const dispatch = useDispatch();
  const operators = useSelector((state: IRootState) => state.operator.operators);
  const totalPages = useSelector((state: IRootState) => state.operator.totalPages);
  const activePage = useSelector((state: IRootState) => state.operator.page);
  const [operator, setOperator] = useState<IOperator | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(JSON.stringify({ alive: true }));

  useEffect(() => {
    dispatch(getEntities(0, 20, searchQuery || undefined));
  }, [dispatch, searchQuery]);

  const handlePagination = (page: number) => {
    dispatch(getEntities(page, 20, searchQuery || undefined));
  };

  const handleSearch = (query: string | null) => {
    const aliveFilter = { alive: true };
    let finalQueryObject: any = aliveFilter;

    if (query) {
      try {
        const userQuery = JSON.parse(query);
        finalQueryObject = {
          $and: [aliveFilter, userQuery],
        };
      } catch (error) {
        console.error("Failed to parse search query:", error);
      }
    }

    const finalQueryString = JSON.stringify(finalQueryObject);
    setSearchQuery(finalQueryString);
    dispatch(getEntities(0, 20, finalQueryString));
  };

  const searchOptions = [
    { value: 'name', label: 'Nombre' },
    { value: 'license', label: 'Licencia' },
    { value: 'rfc', label: 'RFC' },
  ];

  return (
    <div className="app-main">
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Operadores</h3>
            </div>
            <div className="col-sm-6 text-end">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#operatorUpdateModal"
                onClick={() => setOperator(null)}
              >
                Crear nuevo operador
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
        {<table className="table table-bordered">
          <thead>
            <tr>
              <th>Acciones</th>
              <th>Nombre</th>
              <th>Licencia</th>
              <th>Vigencia</th>
              <th>RFC</th>
            </tr>
          </thead>
          <tbody>
            {operators && operators.map((operator, i) => (
              <tr key={`entity-${i}`} className="align-middle">
                <td style={{ width: '10px' }}>
                  <div className="btn-group mb-2" role="group" aria-label="Basic outlined example">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#operatorUpdateModal"
                        onClick={() => setOperator(operator)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#operatorDetailModal"
                      onClick={() => setOperator(operator)}
                      title="Ver"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#operatorDeleteModal"
                      onClick={() => setOperator(operator)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
                <td>{operator.name}</td>
                <td>{operator.license}</td>
                <td>{operator.vigencia}</td>
                <td>{operator.rfc}</td>
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
      <OperatorUpdate operator={operator} refresh={() => {dispatch(getEntities(0, 20, searchQuery || undefined));} } />
      <OperatorDetail operator={operator} />
      <OperatorDelete operator={operator} refresh={() => {dispatch(getEntities(0, 20, searchQuery || undefined));} } />
    </div>
  );
};

export default Operator;
