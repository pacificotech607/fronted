import { IValuelist } from "./valuelist.model";

export  interface ICompany {
    _id?: string;
    name?: string;
    rfc?: string;
    taxRegime?: IValuelist | string;
    taxRegistrationNo?: string;
    taxResidence?: IValuelist | string;
}