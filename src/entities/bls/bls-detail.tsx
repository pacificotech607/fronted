import { IBLS } from '../../model/bls.model';
import GenericModal from '../../utils/Modal';
import { get } from  'lodash';
type BlsDetailProps = {
    bl: IBLS | null;
};

const BlsDetail: React.FC<BlsDetailProps> = ({ bl }) => {
    return (
        <GenericModal
            id="blDetailModal"
            title="Detalles del BL"
        >
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        <tr className="align-middle">
                            <td>Cliente</td>
                            <td>{bl?.customer}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>BL</td>
                            <td>{bl?.bl}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Buque</td>
                            <td>{bl?.vessel}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Destino</td>
                            <td>{get(bl?.destination, 'esLabel', '')}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Petición</td>
                            <td>{bl?.petition}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>ETA</td>
                            <td>{bl?.eta}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Factura</td>
                            <td>{bl?.invoice}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Onzas de Material</td>
                            <td>{bl?.materialOz}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Entrega Vacío</td>
                            <td>{bl?.emptyDelivery}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Estatus</td>
                            <td>{bl?.status}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Tipo de Carga</td>
                            <td>{get(bl?.typeLoad, 'esLabel', '')}</td>
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

export default BlsDetail;
