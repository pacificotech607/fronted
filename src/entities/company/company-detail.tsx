import { ICompany } from '../../model/company.model';
import GenericModal from '../../utils/Modal';

type CompanyDetailProps = {
    company: ICompany | null;
};

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company }) => {
    return (
        <GenericModal
            id="CompanyDetailModal"
            title="Detalles del usuario"
        >
        </GenericModal>
    );
};

export default CompanyDetail;
