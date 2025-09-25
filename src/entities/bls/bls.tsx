import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IBLS } from '../../model/bls.model';
import BlsUpdate from './bls-update';
import BlsDetail from './bls-detail';
import BlsDelete from './bls-delete';
import BlsDetailContainer from './bls-detail-container';
import BlsDetailCommodity from './bls-detail-commodity';
import { IRootState } from '../../model/root-state';
import { getEntities } from './bls.reducer';
import GenericMultiTagSearch from '../../utils/searchInput';
import { blsAggregate,statusBls } from '../../constants/bls.constans';
import { get } from 'lodash';

const BLS: React.FC = () => {
  const dispatch = useDispatch();
  const bls = useSelector((state: IRootState) => state.bls.bls);
  const totalPages = useSelector((state: IRootState) => state.bls.totalPages);
  const activePage = useSelector((state: IRootState) => state.bls.page);

  const [bl, setBl] = useState<IBLS | null>(null);
  const [blContainer, setBlContainer] = useState<IBLS | null>(null);
  const [blsCommodity, setBlsCommodity] = useState<IBLS | null>(null);

  const [searchQuery, setSearchQuery] = useState<string | null>(
    JSON.stringify([
      ...blsAggregate,
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
    const baseQuery = blsAggregate;

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
    { value: 'customer', label: 'Cliente' },
    { value: 'bl', label: 'BL' },
    { value: 'vessel', label: 'Buque' },
    { value: 'destination', label: 'Destino' },
    { value: 'petition', label: 'Petición' },
    { value: 'eta', label: 'ETA' },
    { value: 'invoice', label: 'Factura' },
    { value: 'status', label: 'Estatus' },
    { value: 'typeLoad', label: 'Tipo de Carga' },
  ];


  return (
    <div className="app-main">
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">BLS</h3>
            </div>
            <div className="col-sm-6 text-end">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#blUpdateModal"
                onClick={() => setBl(null)}
              >
                Crear nuevo BL
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
              <th style={{ minWidth: '150px' }}>Acciones</th>
              <th style={{ minWidth: '200px' }}>Cliente</th>
              <th style={{ minWidth: '150px' }}>BL</th>
              <th style={{ minWidth: '150px' }}>Buque</th>
              <th style={{ minWidth: '150px' }}>Destino</th>
              <th style={{ minWidth: '150px' }}>Petición</th>
              <th style={{ minWidth: '120px' }}>ETA</th>
              <th style={{ minWidth: '150px' }}>Factura</th>
              <th style={{ minWidth: '150px' }}>Onzas de Material</th>
              <th style={{ minWidth: '150px' }}>Entrega Vacío</th>
              <th style={{ minWidth: '250px' }}>Estatus</th>
              <th style={{ minWidth: '150px' }}>Tipo de Carga</th>
              <th style={{ minWidth: '100px' }}>Container</th>
              <th style={{ minWidth: '100px' }}>Mercancia</th>
            </tr>
          </thead>
          <tbody>
            {bls && bls.map((bl, i) => (
              <tr key={`entity-${i}`} className="align-middle">
                <td style={{ width: '10px' }}>
                  <div className="btn-group mb-2" role="group" aria-label="Basic outlined example">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#blUpdateModal"
                      onClick={() => setBl(bl)}
                      title="Editar"
                      disabled={Object.values(statusBls).find(s => s.value === bl.status)?.value !== statusBls.inactive.value}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#blDetailModal"
                      onClick={() => setBl(bl)}
                      title="Ver"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#blDeleteModal"
                      onClick={() => setBl(bl)}
                      title="Eliminar"
                      disabled={Object.values(statusBls).find(s => s.value === bl.status)?.value !== statusBls.inactive.value}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </td>
                <td>{bl.customer}</td>
                <td>{bl.bl}</td>
                <td>{bl.vessel}</td>
                <td>{get(bl.destination, 'esLabel', '')}</td>
                <td>{bl.petition}</td>
                <td>{bl.eta}</td>
                <td>{bl.invoice}</td>
                <td>{bl.materialOz}</td>
                <td>{bl.emptyDelivery}</td>
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
                <td>{get(bl.typeLoad, 'esLabel', '')}</td>
                <td className='text-center'><button type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#blDetailContainerModal"
                  onClick={() => setBlContainer(bl)}
                  title="Ver Contenedores" style={{ background: 'transparent', border: 'none' }}><i className="bi bi-inboxes" style={{ color: '#0dcaf0' }}></i></button></td>
                <td className='text-center'><button type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#blDetailCommodityModal"
                  onClick={() => setBlsCommodity(bl)}
                  title="Ver lista de mercancia" style={{ background: 'transparent', border: 'none' }}><i className="bi bi-inboxes-fill" style={{ color: '#0dcaf0' }}></i></button></td>
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
      <BlsUpdate bls={bl} refresh={() => { dispatch(getEntities(0, 20, searchQuery || undefined)); }} />
      <BlsDetail bl={bl} />
      <BlsDelete bl={bl} refresh={() => { dispatch(getEntities(0, 20, searchQuery || undefined)); }} />
      <BlsDetailContainer bl={blContainer} />
      <BlsDetailCommodity bl={blsCommodity} />
    </div>
  );
};

export default BLS;
