export  interface IValuelist {
  _id?: string;
  type?: string;
  name?: string;
  enLabel?: string;
  esLabel?: string;
  alive?: boolean;
  parent?: IValuelist | string;
}