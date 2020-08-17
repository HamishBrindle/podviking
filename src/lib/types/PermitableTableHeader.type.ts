import { DataTableHeader } from 'vuetify';

export type PermitableTableHeader<T> = (DataTableHeader<any> & { ability?: T });
