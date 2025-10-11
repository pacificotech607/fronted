import { IFuel } from '../../model/fuel.model';
import GenericModal from '../../utils/Modal';
import { get } from 'lodash';

type FuelDetailProps = {
    fuel: IFuel | null;
};

const FuelDetail: React.FC<FuelDetailProps> = ({ fuel }) => {
    return (
        <GenericModal
            id="fuelDetailModal"
            title="Detalles del Registro de Combustible"
        >
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        <tr className="align-middle">
                            <td>Transporte</td>
                            <td>{get(fuel?.transport, 'number', '')}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Operador</td>
                            <td>{get(fuel?.operator, 'name', '')}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Tabulador</td>
                            <td>{get(fuel?.tabulator, 'description', '')}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Diesel Inicial</td>
                            <td>{fuel?.dieselInitial}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Diesel Retorno</td>
                            <td>{fuel?.dieselReturn}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Diesel Cargado</td>
                            <td>{fuel?.dieselLoaded}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Litros Cargados</td>
                            <td>{fuel?.litersLoaded}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Precio por Litro</td>
                            <td>${fuel?.pricePerLiter}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Consumo de Combustible</td>
                            <td>{fuel?.fuelConsumption}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Eficiencia</td>
                            <td>{fuel?.efficiency}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Fecha de Combustible</td>
                            <td>{fuel?.fuelDate}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Tipo de Combustible</td>
                            <td>{fuel?.typeFuel}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Observaciones</td>
                            <td>{fuel?.observations}</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div className="row g-3">
                    <div className="col-md-12 text-end">
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-dismiss="modal"
                        >Aceptar</button>
                    </div>
                </div>
            </div>
        </GenericModal>
    );
};

export default FuelDetail;