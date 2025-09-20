import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ITab } from '../../model/tab.model';
import TabUpdate from './tab-update';
import TabDetail from './tab-detail';
import TabDelete from './tab-delete';
import { IRootState } from '../../model/root-state';
import { getEntities } from './tab.reducer';
import GenericMultiTagSearch from '../../utils/searchInput';

const Tab: React.FC = () => {
  const dispatch = useDispatch();
  const tabs = useSelector((state: IRootState) => state.tab.tabs);
  const totalPages = useSelector((state: IRootState) => state.tab.totalPages);
  const activePage = useSelector((state: IRootState) => state.tab.page);
  const [tab, setTab] = useState<ITab | null>(null);
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
    { value: 'description', label: 'Descripción' },
  ];

  return (
    <div className="app-main">
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Pestaña</h3>
            </div>
            <div className="col-sm-6 text-end">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#tabUpdateModal"
                onClick={() => setTab(null)}
              >
                Crear nueva pestaña
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
              <th>Descripción</th>
              <th>Distancia (Km)</th>
              <th>Diesel consumido</th>
            </tr>
          </thead>
          <tbody>
            {tabs && tabs.map((tab, i) => (
              <tr key={`entity-${i}`} className="align-middle">
                <td style={{ width: '10px' }}>
                  <div className="btn-group mb-2" role="group" aria-label="Basic outlined example">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#tabUpdateModal"
                        onClick={() => setTab(tab)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#tabDetailModal"
                      onClick={() => setTab(tab)}
                      title="Ver"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#tabDeleteModal"
                      onClick={() => setTab(tab)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
                <td>{tab.description}</td>
                <td>{tab.distanceKm}</td>
                <td>{tab.dieselConsumed}</td>
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
      <TabUpdate tab={tab} refresh={() => {dispatch(getEntities(0, 20, searchQuery || undefined));} } />
      <TabDetail tab={tab} />
      <TabDelete tab={tab} refresh={() => {dispatch(getEntities(0, 20, searchQuery || undefined));} } />
    </div>
  );
};

export default Tab;
