import React from "react";
import { DataGrid } from "@material-ui/data-grid";
import { Stack } from "react-bootstrap";
import Table from 'react-bootstrap/Table';

export default class DataTable extends React.Component {

  state = {
    selected: '',
    limit: 20,
    totalRows: 0,
    skip: 0,
    sort: '',
    sortOrder: 'asc',
    page1: 0,
    page2: 0,
    page3: 0,
    currentPage: 0
  }

  reloadTable() {
    this.props.refresh(this.json)
  }

  sortChange(e) {
    this.props.gridJson.sort = e[0].field;
    this.props.gridJson.sortOrder = e[0].sort;
    this.props.refresh(this.props.gridJson);
  }

  rowSelected(row) {
    this.setState({ selected: row["id"] });
  }

  // <DataGrid sortingOrder={['asc', 'desc']} rowCount={this.props.data.totalRows} rows={this.props.data.data} 
  //       columns={this.props.columns} pageSize={this.props.gridJson.limit} rowsPerPageOptions={[20, 50, 100]}
  //         onPageChange={(e) => { this.props.gridJson.skip = e * this.props.gridJson.limit; this.props.refresh(this.props.gridJson); }}
  //         onPageSizeChange={(e) => { this.props.gridJson.limit = e; this.props.refresh(this.props.gridJson); }}
  //         onSortModelChange={(e) => { this.sortChange(e) }}
  //         onSelectionModelChange={(e) => { this.setState({ selection: e[0] }); this.props.setSelection(e[0]) }}
  //         components={{
  //           NoRowsOverlay: () => (
  //             <div class='MuiDataGrid-overlay nodata text-secondary p-0'>
  //               <i class='bi bi-file-earmark-excel icon'></i>
  //               <div class='pt-4'>No Data Available</div>
  //             </div>
  //           )
  //         }}
  // />

  previousClick() {
    if (this.state.page1 > 1) {
      this.setState({
        page1: this.state.page1 - 1,
        page2: this.state.page2 - 1,
        page3: this.state.page3 - 1,
      });
    }
  }

  nextClick() {
    var pages = parseInt(this.props.data.totalRows / this.state.limit) + (this.props.data.totalRows % this.state.limit > 0 ? 1 : 0);

    if (this.state.page3 && this.state.page3 < pages) {
      this.setState({
        page1: this.state.page1 + 1,
        page2: this.state.page2 + 1,
        page3: this.state.page3 + 1,
      });
    }
  }

  pageSizeChange(val) {
    this.json["limit"] = parseInt(val)
    this.setState({ limit: this.json["limit"] });
    this.reloadTable();
    setTimeout(() => { this.initPagination() }, 200);
  }

  pageClick(page) {
    this.json["skip"] = page
    this.setState({ currentPage: page });
    this.reloadTable();
  }

  componentDidMount() {
    if (this.props) {
      this.setState({
        limit: this.props.gridJson.limit,
        skip: this.props.gridJson.skip,
        sort: this.props.gridJson.sort,
        sortOrder: this.props.gridJson.sortOrder
      })
      this.json = {
        limit: this.props.gridJson.limit,
        skip: this.props.gridJson.skip,
        sort: this.props.gridJson.sort,
        sortOrder: this.props.gridJson.sortOrder
      }
    }
  }

  initPagination() {
    var pages = parseInt(this.props.data.totalRows / this.state.limit) + (this.props.data.totalRows % this.state.limit > 0 ? 1 : 0);
    if (pages >= 3) {
      this.setState({
        page1: 1,
        page2: 2,
        page3: 3,
        currentPage: 1
      })
    }
    else if (pages === 2) {
      this.setState({
        page1: 1,
        page2: 2,
        page3: 0,
        currentPage: 1
      })
    }
    else if (pages === 1) {
      this.setState({
        page1: 1,
        page2: 0,
        page3: 0,
        currentPage: 1
      })
    }
  }
  componentDidUpdate(a,b) {
    if (this.state.page1 === 0) {
      this.initPagination()
    }
  }

  onSort(col) {
    var sortOrder = 'asc';
    if (this.state.sort === col.field && this.state.sortOrder === 'asc') {
      sortOrder = 'desc'
    }
    this.setState({ sortOrder: sortOrder, sort: col.field });
    this.json["sortOrder"] = sortOrder;
    this.json["sort"] = col.field;
    this.reloadTable();
  }

  render() {
    console.log(this.props.data)
    if (this.props.data && this.props.data.data && this.props.data.data.length > 0) {
      var pages = parseInt(this.props.data.totalRows / this.state.limit) + (this.props.data.totalRows % this.state.limit > 0 ? 1 : 0);
      return (
          <div className='table-responsive'>
          <div className="tableFixHead">
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-2 gy-4'>
          
            <thead>
             <tr className="fw-bold text-muted">
                {this.props.columns.map((col, index) => (  <th width={col.width} className="table-header text_extract" onClick={() => { this.onSort(col) }}>{col.headerName}
                    {col.sortable !== false ? <span className="pl-3">
                      {this.state.sort === col.field ?
                        this.state.sortOrder === 'asc' ? <i class="fa fa-sort-up"></i> : <i class="fa fa-sort-down"></i>
                        : <i class="fa fa-sort"></i>}
                    </span> : <></>}
                  </th>
                ))}
              </tr>
            </thead>
        
            <tbody>
            {
                this.props.data.data.map((row, index) => {
                  return <tr className={"table_row" + (this.state.selected === row["id"] ? " row-selected " : "")} onClick={() => {
                    this.rowSelected(row)
                  }}>
                    {
                      this.props.columns.map((col, index) => (
                        <td>{col.renderCell ? col.renderCell({ row: row }) : row[col.field]}</td>
                      ))
                    }
                  </tr>
                }
                )}
            </tbody>
           
          </table>
          <nav aria-label="Page navigation example" className="navigation">
            <ul class="pagination">
              <li>Rows per page :</li>
              <li class="page-item">
                <select className="btn btn-sm btn-white btn-flex btn-center btn-active-light-primary" onChange={(e) => { this.pageSizeChange(e.target.value) }} value={this.state.limit}>
                  {/* <option value={2}>2</option> */}
                  <option value={20}>20</option>
                  <option value={50}> 50</option>
                  <option value={100}>100</option>
                </select>
              </li>
              {this.props.data && this.props.data.data ? <li class="page-item semibold">
                {this.props.data.data.length + " of " + this.props.data.totalRows}
              </li> : <></>}
              <li class="page-item mr-0"><button className={"page-link btn btn-white btn-icon" + (this.state.page1 === 1 || pages <= 3 ? " disabled " : "")} onClick={() => { this.previousClick() }} >
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
              </button>
              </li>
              {this.state.page1 ? <li class="page-item mr-0"><button className={"page-link " + (this.state.currentPage === this.state.page1 ? 'selected' : '')} onClick={() => { this.pageClick(this.state.page1) }} >{this.state.page1}</button></li> : <></>}
              {this.state.page2 ? <li class="page-item mr-0"><button className={"page-link " + (this.state.currentPage === this.state.page2 ? 'selected' : '')} onClick={() => { this.pageClick(this.state.page2) }} >{this.state.page2}</button></li> : <></>}
              {this.state.page3 ? <li class="page-item mr-0"><button className={"page-link " + (this.state.currentPage === this.state.page3 ? 'selected' : '')} onClick={() => { this.pageClick(this.state.page3) }} >{this.state.page3}</button></li> : <></>}
              <li class="page-item">
                <button className={"page-link btn btn-white btn-icon" + (this.page3 === pages || pages <= 3 ? " disabled " : "")} onClick={() => { this.nextClick() }} >
                  <span aria-hidden="true">&raquo;</span>
                  <span class="sr-only">Next</span>
                </button>
              </li>
            </ul>
          </nav>
          </div>
          </div>
      );
    }
    else {
      return (
      <div className='nodata text-primary p-0'>
         <image src="../../../media/illustrations/sigma-1/21.png" alt="NO DATA"/>
        <i className='bi bi-file-earmark-excel icon'></i>
        <div className='pt-4'>No Data Available</div>
      </div>
      )
    }

  }
}



// <Table responsive className="h-80">
// <thead className="table-header-border">
//   <tr>
//     {this.props.columns.map((col, index) => (
//       <th>{col.headerName}</th>
//     ))}
//   </tr>
// </thead>
// <tbody>
//   {
//     this.props.data.data.map((row, index) => {
//       return <tr className={"table-row " + (this.state.selected === row["id"] ? "row-selected" : "")} onClick={() => {
//         this.rowSelected(row)
//       }}>
//         {
//           this.props.columns.map((col, index) => (
//             <td>{col.renderCell ? col.renderCell({ row: row }) : row[col.field]}</td>
//           ))
//         }
//       </tr>
//     }
//     )}
// </tbody>
// </Table>