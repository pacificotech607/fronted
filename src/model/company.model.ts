import { IValuelist } from "./valuelist.model";

export  interface ICompany {
    _id?: string;
    name?: string;
    rfc?: string;
    taxRegime?: IValuelist;
    taxRegistrationNo?: string;
    taxResidence?: IValuelist;
}