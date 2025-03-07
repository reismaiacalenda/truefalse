export class Datatable {
  page: {
    totalElements:number,
    pageNumber:number,
    size:number
  };
  rows: any[];
  local_copy: any[];
}

export function fabricarDatatable(){
  let datatable =  new Datatable()
  datatable.page.totalElements = 0;
  datatable.page.pageNumber = 0;
  datatable.page.size = 25;
  datatable.rows = null;
  datatable.local_copy = null;
  return datatable;
}