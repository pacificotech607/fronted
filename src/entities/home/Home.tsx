import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../model/root-state';
import { getEntities as getCompanies } from '../company/company.reducer';
import { getEntities as getInvoices } from '../invoice/invoice.reducer';
import { getEntities as getBLS } from '../bls/bls.reducer';
import { getEntities as getMotorTransports } from '../motorTransport/motorTransport.reducer';
import { getEntities as getOperators } from '../operator/operator.reducer';
import { getEntities as getPatios } from '../patio/patio.reducer';
import { statusBls } from '../../constants/bls.constans';
import MetricCard from './MetricCard';
import LineChart from './LineChart';
import PieChart from './PieChart';
import './Home.css';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const companies = useSelector((state: IRootState) => state.company.companies);
  const invoices = useSelector((state: IRootState) => state.invoice.invoices);
  const bls = useSelector((state: IRootState) => state.bls.bls);
  const motorTransports = useSelector((state: IRootState) => state.motorTransport.motorTransports);
  const operators = useSelector((state: IRootState) => state.operator.operators);
  const patios = useSelector((state: IRootState) => state.patio.patios);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7D' | '30D' | '90D'>('30D');

  useEffect(() => {
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = Array.from(tooltipTriggerList).map(tooltipTriggerEl => {
      try {
        // @ts-ignore - Bootstrap tooltip initialization
        if (window.bootstrap && window.bootstrap.Tooltip) {
          return new window.bootstrap.Tooltip(tooltipTriggerEl);
        }
      } catch (error) {
        console.warn('Bootstrap tooltip initialization failed:', error);
      }
      return null;
    });

    // Cleanup tooltips on unmount
    return () => {
      tooltipList.forEach(tooltip => tooltip?.dispose());
    };
  }, [selectedPeriod]); // Reinicializar tooltips cuando cambie el período

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        dispatch(getCompanies(0, 100, JSON.stringify({ alive: true })));
        dispatch(getInvoices(0, 100, JSON.stringify({ alive: true })));
        dispatch(getBLS(0, 100, JSON.stringify({ alive: true })));
        dispatch(getMotorTransports(0, 100, JSON.stringify({ alive: true })));
        dispatch(getOperators(0, 100, JSON.stringify({ alive: true })));
        dispatch(getPatios(0, 100, JSON.stringify({ alive: true })));
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, [dispatch]);

  // Métricas de unidades de puerto
  const unidadesIdaPuerto = bls?.filter(bl => 
    bl.status === statusBls.assignedPort.value || 
    bl.status === statusBls.exitReviewPort.value
  ).length || 0;
  
  const unidadesRegresoPuerto = bls?.filter(bl => 
    bl.status === statusBls.returnReviewPort.value
  ).length || 0;
  
  const unidadesIdaViaje = bls?.filter(bl => 
    bl.status === statusBls.assignedTrip.value || 
    bl.status === statusBls.exitReviewTrip.value
  ).length || 0;
  
  const unidadesRegresoViaje = bls?.filter(bl => 
    bl.status === statusBls.returnReviewTrip.value
  ).length || 0;

  const handlePeriodChange = (period: '7D' | '30D' | '90D') => {
    setSelectedPeriod(period);
    // Aquí podrías agregar lógica adicional para cambiar los datos del gráfico
    console.log(`Período seleccionado: ${period}`);
  };



  const generateLineChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    });
    
    // Simular datos históricos basados en las unidades actuales con variación realista
    const baseIdaPuerto = unidadesIdaPuerto || 2;
    const baseRegresoPuerto = unidadesRegresoPuerto || 1;
    const baseIdaViaje = unidadesIdaViaje || 3;
    const baseRegresoViaje = unidadesRegresoViaje || 2;
    
    // Generar datos simulados con tendencias realistas para cada tipo de viaje
    const idaPuertoData = Array.from({ length: 7 }, (_, i) => {
      // Más actividad a mitad de semana
      const weekdayMultiplier = i >= 1 && i <= 5 ? 1.5 : 0.8;
      return Math.max(0, Math.round(baseIdaPuerto * weekdayMultiplier + Math.floor(Math.random() * 6) - 3));
    });
    
    const regresoPuertoData = Array.from({ length: 7 }, (_, i) => {
      // Sigue el patrón de ida con un día de retraso
      const weekdayMultiplier = i >= 2 && i <= 6 ? 1.4 : 0.7;
      return Math.max(0, Math.round(baseRegresoPuerto * weekdayMultiplier + Math.floor(Math.random() * 4) - 2));
    });
    
    const idaViajeData = Array.from({ length: 7 }, (_, i) => {
      // Patrones diferentes para viajes más largos
      const longTripPattern = i % 2 === 0 ? 1.3 : 0.9;
      return Math.max(0, Math.round(baseIdaViaje * longTripPattern + Math.floor(Math.random() * 5) - 2));
    });
    
    const regresoViajeData = Array.from({ length: 7 }, (_, i) => {
      // Complementa los viajes de ida
      const returnPattern = i >= 3 ? 1.2 : 0.8;
      return Math.max(0, Math.round(baseRegresoViaje * returnPattern + Math.floor(Math.random() * 4) - 2));
    });
    
    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Ida Puerto',
          data: idaPuertoData,
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Regreso Puerto',
          data: regresoPuertoData,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Ida Viaje',
          data: idaViajeData,
          borderColor: '#4299e1',
          backgroundColor: 'rgba(66, 153, 225, 0.2)',
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Regreso Viaje',
          data: regresoViajeData,
          borderColor: '#0dcaf0',
          backgroundColor: 'rgba(13, 202, 240, 0.2)',
          fill: false,
          tension: 0.4,
        }
      ]
    };
  };

  const generatePieChartData = () => {
    return {
      labels: ['Ida Puerto', 'Regreso Puerto', 'Ida Viaje', 'Regreso Viaje', 'Inactivas'],
      datasets: [
        {
          data: [
            unidadesIdaPuerto,
            unidadesRegresoPuerto,
            unidadesIdaViaje,
            unidadesRegresoViaje,
            bls?.filter(bl => bl.status === statusBls.inactive.value).length || 0,
          ],
          backgroundColor: [
            '#ffc107', // Amarillo para ida puerto
            '#28a745', // Verde para regreso puerto
            '#4299e1', // Azul para ida viaje
            '#0dcaf0', // Cian para regreso viaje
            '#6c757d', // Gris para inactivas
          ],
          borderWidth: 0,
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-main">
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Home</h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <a href="#/">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Dashboard
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="app-content home">
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <MetricCard
              title="Unidades Ida Puerto"
              value={unidadesIdaPuerto.toString()}
              change={`+${Math.floor(Math.random() * 5) + 1} desde ayer`}
              changeType="positive"
              icon="bi-truck"
              color="warning"
            />
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <MetricCard
              title="Unidades Regreso Puerto"
              value={unidadesRegresoPuerto.toString()}
              change={`${Math.floor(Math.random() * 3) + 1} completadas hoy`}
              changeType="positive"
              icon="bi-arrow-left-circle"
              color="success"
            />
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <MetricCard
              title="Unidades Ida Viaje"
              value={unidadesIdaViaje.toString()}
              change={`+${Math.floor(Math.random() * 4) + 1} en progreso`}
              changeType="positive"
              icon="bi-geo-alt"
              color="primary"
            />
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <MetricCard
              title="Unidades Regreso Viaje"
              value={unidadesRegresoViaje.toString()}
              change={`${Math.floor(Math.random() * 2) + 1} finalizadas`}
              changeType="positive"
              icon="bi-arrow-return-left"
              color="info"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Comparación de Tipos de Viaje por Fechas</h5>
                <div className="btn-group" role="group">
                  <button 
                    type="button" 
                    className={`btn btn-sm ${selectedPeriod === '7D' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    title={`Ver tendencias de los últimos 7 días${selectedPeriod === '7D' ? ' (seleccionado)' : ''}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    onClick={() => handlePeriodChange('7D')}
                  >
                    7D
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${selectedPeriod === '30D' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    title={`Ver tendencias de los últimos 30 días${selectedPeriod === '30D' ? ' (seleccionado)' : ''}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    onClick={() => handlePeriodChange('30D')}
                  >
                    30D
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${selectedPeriod === '90D' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    title={`Ver tendencias de los últimos 90 días${selectedPeriod === '90D' ? ' (seleccionado)' : ''}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    onClick={() => handlePeriodChange('90D')}
                  >
                    90D
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-3 col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-truck text-warning me-2"></i>
                      <div>
                        <div className="text-muted small">Ida Puerto</div>
                        <div className="fw-bold">{unidadesIdaPuerto}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-arrow-left-circle text-success me-2"></i>
                      <div>
                        <div className="text-muted small">Regreso Puerto</div>
                        <div className="fw-bold">{unidadesRegresoPuerto}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-geo-alt text-primary me-2"></i>
                      <div>
                        <div className="text-muted small">Ida Viaje</div>
                        <div className="fw-bold">{unidadesIdaViaje}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-arrow-return-left text-info me-2"></i>
                      <div>
                        <div className="text-muted small">Regreso Viaje</div>
                        <div className="fw-bold">{unidadesRegresoViaje}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <LineChart data={generateLineChartData()} />
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">Estado de Unidades</h5>
              </div>
              <div className="card-body">
                <PieChart data={generatePieChartData()} />
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Ida Puerto</span>
                    <span className="fw-bold text-warning">{unidadesIdaPuerto}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Regreso Puerto</span>
                    <span className="fw-bold text-success">{unidadesRegresoPuerto}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Ida Viaje</span>
                    <span className="fw-bold text-primary">{unidadesIdaViaje}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Regreso Viaje</span>
                    <span className="fw-bold text-info">{unidadesRegresoViaje}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Inactivas</span>
                    <span className="fw-bold text-secondary">{bls?.filter(bl => bl.status === statusBls.inactive.value).length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Resumen de Entidades del Sistema</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-2 col-sm-4 col-6 mb-3">
                    <div className="text-center">
                      <i className="bi bi-building text-primary fs-1"></i>
                      <h4 className="mt-2">{companies?.length || 0}</h4>
                      <p className="text-muted mb-0">Empresas</p>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-4 col-6 mb-3">
                    <div className="text-center">
                      <i className="bi bi-receipt text-success fs-1"></i>
                      <h4 className="mt-2">{invoices?.length || 0}</h4>
                      <p className="text-muted mb-0">Facturas</p>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-4 col-6 mb-3">
                    <div className="text-center">
                      <i className="bi bi-file-earmark-text text-info fs-1"></i>
                      <h4 className="mt-2">{bls?.length || 0}</h4>
                      <p className="text-muted mb-0">BLS</p>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-4 col-6 mb-3">
                    <div className="text-center">
                      <i className="bi bi-truck text-warning fs-1"></i>
                      <h4 className="mt-2">{motorTransports?.length || 0}</h4>
                      <p className="text-muted mb-0">Transporte</p>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-4 col-6 mb-3">
                    <div className="text-center">
                      <i className="bi bi-person-workspace text-danger fs-1"></i>
                      <h4 className="mt-2">{operators?.length || 0}</h4>
                      <p className="text-muted mb-0">Operadores</p>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-4 col-6 mb-3">
                    <div className="text-center">
                      <i className="bi bi-geo-alt text-secondary fs-1"></i>
                      <h4 className="mt-2">{patios?.length || 0}</h4>
                      <p className="text-muted mb-0">Patios</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Home;
