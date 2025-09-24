import { IBLS } from '../../model/bls.model';
import GenericModal from '../../utils/Modal';

type BlsDetailCommodityProps = {
    bl: IBLS | null;
};

const BlsDetailCommodity: React.FC<BlsDetailCommodityProps> = ({ bl }) => {
    return (
        <GenericModal
            id="blDetailCommodityModal"
            title="Lista de mercancia"
            size='lg'
        >
            <div className="card-body p-0">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Contenedor</th>
                            <th>Cantidad</th>
                            <th>Clave de unidad</th>
                            <th>Producto</th>
                            <th>Descripción</th>
                            <th>Peso en kg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bl?.commodity && bl?.commodity.map((bl, i) => (
                            <tr key={`entity-${i}`} className="align-middle">
                                <td>{bl.Container}</td>
                                <td>{bl.quantity}</td>
                                <td>{bl.unitKey}</td>
                                <td>{bl.commodity}</td>
                                <td>{bl.description}</td>
                                <td>{bl.weightKg}</td>
                            </tr>
                        ))}
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

export default BlsDetailCommodity;
