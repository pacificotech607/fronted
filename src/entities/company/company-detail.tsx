import { ICompany } from '../../model/company.model';
import GenericModal from '../../utils/Modal';
import { get } from 'lodash';
type CompanyDetailProps = {
    company: ICompany | null;
};

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company }) => {
    return (
        <GenericModal
            id="companyDetailModal"
            title="Detalles de la Compañia"
        >
            <div className="card-body p-0">
                <table className="table table-striped">
                    <tbody>
                        <tr className="align-middle">
                            <td>Nombre</td>
                            <td>{company?.name}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>RFC</td>
                            <td>{company?.rfc}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Regimen fiscal</td>
                            <td>{get(company?.taxRegime, 'esLabel')}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Registro de identificación fiscal</td>
                            <td>{company?.taxRegistrationNo}</td>
                        </tr>
                        <tr className="align-middle">
                            <td>Residencia fiscal</td>
                            <td>{get(company?.taxResidence, 'esLabel')}</td>
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

export default CompanyDetail;
