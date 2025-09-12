import { IMotorTransport } from '../../model/motorTransport.model';
import GenericModal from '../../utils/Modal';

type MotorTransportDetailProps = {
    motorTransport: IMotorTransport | null;
};

const MotorTransportDetail: React.FC<MotorTransportDetailProps> = ({ motorTransport }) => {
    return (
        <GenericModal
            id="motorTransportDetailModal"
            title="Detalles del autotransporte"
        >
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        <tr className="align-middle">
                            <td>Número</td>
                            <td>{motorTransport?.number}</td>
                        </tr>
                        <tr>
                            <td>Configuración</td>
                            <td>{motorTransport?.configuration}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Placa</td>
                            <td>{motorTransport?.plate}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Año</td>
                            <td>{motorTransport?.year}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Peso</td>
                            <td>{motorTransport?.weight}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Permiso SCT</td>
                            <td>{motorTransport?.sctPermit}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Número de permiso SCT</td>
                            <td>{motorTransport?.sctPermitNumber}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Aseguradora</td>
                            <td>{motorTransport?.insurance}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Póliza de seguro</td>
                            <td>{motorTransport?.insurancePolicy}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Tipo de remolque</td>
                            <td>{motorTransport?.trailerType}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Placa del remolque</td>
                            <td>{motorTransport?.trailerPlate}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Operador</td>
                            <td>{motorTransport?.operator}</td>
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

export default MotorTransportDetail;
