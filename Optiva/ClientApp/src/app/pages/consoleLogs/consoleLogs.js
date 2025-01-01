import React from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import DataTable from '../../../shared/table'
import { KTSVG } from '../../../_metronic/helpers'
import { postdata } from '../../../service/httputlity'
import { formatDateTime } from "../../service/utility"

export default class ConsoleLogs extends React.Component {
  state = {
    data: {data: [], totalRows: 0},
      columns: [
          { field: 'CreateOn', headerName: 'Time', flex: 2, width: '20%', renderCell: (params) => (formatDateTime(params.row.CreateOn) )},
            {field: 'Request', headerName: 'Logs - Request/ Response', flex: 7 , width:'60%',
            renderCell: (params) => {
              return <span> <p>Request : </p><p>{params.row.Request}</p><p>Response : </p><p>{ params.row.Response}</p></span>
            }
          },
          {field: 'Download', headerName: 'Download', flex: 2 , width:'20%',
          renderCell: (params) => {
            var json = btoa(JSON.stringify({request : JSON.parse(params.row.Request), response : JSON.parse(params.row.Response)}));
            return <a href={"data:application/json;base64," + json} download="product.json">Download</a>
          }
        },
    /*  {field: 'Data', headerName: 'Plan Details', flex: 10,  width:'45%'},*/
    ],
  }
  gridjson = {
    limit: 100,
    skip: 0,
    sortCol: 'created_date',
    sortOrder: -1,
    selection: '',
    ParentId: '',
    getType: 'Assigned',
  }

  handleChange = this.handleChange.bind(this)

  // eslint-disable-next-line no-dupe-class-members
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  componentDidMount() {
    this.getDataFromServer()
    setTimeout(() => {}, 2000)
  }

  getDataFromServer() {
    postdata('ConsoleLogs/getconsoleLogs', this.gridjson).then(
      (d) => {
            this.setState({ data: d })
            console.log(d);
      },
      (e) => {}
    )
  }

  refreshTable(params) {
    if (params) {
      this.gridjson.limit = params.limit
      this.gridjson.skip = params.skip
      this.gridjson.sortCol = params.sort
      this.gridjson.sortOrder = params.sortOrder == 'asc' ?  1 : -1
    }
    this.getDataFromServer()
  }

  timer = null
  handleSearch(event) {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
    this.setState({
      [event.target.name]: event.target.value,
    })
    this.timer = setTimeout(() => {
      var search = event.target.value.toLowerCase()
      this.gridjson.searchVal = search
      this.getDataFromServer()
    }, 1000)
  }

  handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        
      }
      console.log(items)
      var result = []
      for (var i = 0; i < items.length; i++) {
        if (items[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
          result.push(items[i])
        }
      }
      return result
    }
  }

  render() {
    const consoleLogsBreadCrumbs = [
      {
        title: 'Home >',
        path: '/home',
        isSeparator: false,
        isActive: false,
      },
      {
        title: '',
        path: '',
        isSeparator: true,
        isActive: false,
      },
    ]
    return (
      <>
        <PageTitle breadcrumbs={consoleLogsBreadCrumbs}>Console Logs</PageTitle>
        <div class="card h-100">
          <div class='card-header px-5 border-0'>
            <div class='card-title'>
              <div className='d-flex align-items-center position-relative my-1'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-1 position-absolute ms-6'
                />
                <input placeholder='search'
                  type='text'
                  className='form-control form-control-solid w-250px ps-14'
                  name='searchVal'
                  onChange={(e) => {
                    this.handleSearch(e)
                  }}
                  value={this.state.searchVal}
                ></input>
                 <button class='btn btn-outline form-control form-control-solid btn-icon ms-2'
                  onClick={() => { this.refreshTable(this.gridjson)}}><i class="fa-solid fa-arrow-rotate-right"></i>
                </button>
              </div>
            </div>
            <div class='card-toolbar'>
          
            </div>
          </div>
          <div class='card-body px-0 py-0'>
            <div id='tableView' className={`table_content`} >
              <DataTable
                className='table table-striped'
                setSelection={(id) => {
                  this.setState({editId: id})
                }}
                refresh={(params) => {
                  this.refreshTable(params)
                }}
                columns={this.state.columns}
                data={this.state.data}
                 gridJson = {this.gridjson}
              />
            </div>
          </div>
        </div>
     
      </>
    )
  }
}
