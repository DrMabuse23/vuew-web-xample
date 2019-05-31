export interface Users {
  first_name: string;
  last_name: string;
  phone: string;
  site: string;
}

export interface Sites {
  name: string;
}

export interface IDataTable {
  DT_RowId: string;
  users: Users;
  sites: Sites;
}
