import React from 'react'
import { PageTitle } from '../../../_metronic/layout/core'
import { KTSVG } from '../../../_metronic/helpers'
import DataTable from '../../../shared/table'
import { Modal } from 'react-bootstrap'
import { notification } from '../../../service/utility'
import { deleteData, postdata, putdata } from '../../../service/httputlity'

export default class CannedRequest extends React.Component {
  state = {
    newUser: '',
    data: {data: [], totalRows: 0},
    showaddview: false,
    columns: [
     
      {field: 'Request', headerName: 'Request', flex: 0.5 , width:'20%'},
      {field: 'Response', headerName: 'Response', flex: 10,  width:'60%'},
      {
        headerName: 'Action',
        sortable:false,
        field: 'action',
        flex: 0.5,
        width:'20%',
        renderCell: (params) => (
          <div className='icon-center'>
            <button
              className='btn btn-sm btn-color-primary btn-active-light-primary'
              onClick={() => this.editClicked(params.row)}
            >
              <i class='bi bi-pencil pr-1'></i> Edit
            </button>
            <button
              className='btn btn-sm btn-color-danger btn-active-light-danger'
              onClick={() => this.deleteClicked(params.row)}
            >
              <i class='bi bi-trash3 pr-1'></i> Delete
            </button>
          </div>
        ),
      },
    ],
    addview: false,
    menuList: [
      {
        icon: 'bi bi-list-task menuIcon',
        id: 0,
        title: 'Tasks',
        children: [
          {
            id: 1,
            title: 'To Do',
          },
          {
            id: 2,
            title: 'Create By Me',
          },
        ],
      },
    ],
  }

  gridjson = {
    limit: 100,
    start: 0,
    sortCol: 'request',
    sortOrder: 1,
    type: 0,
    searchVal:""
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
    postdata('CannedRequest/getcannedReq', this.gridjson).then(
      (d) => {
        this.setState({data:{data:d.rows , totalRows:d.totalRows}})
      },
      (e) => {}
    )
  }

  refreshTable(params) {
    if (params) {
      this.gridjson.limit = params.limit
      this.gridjson.start = params.skip
      this.gridjson.sortCol = params.sort
      this.gridjson.sortOrder = params.sortOrder == 'asc' ?  1 : -1
      this.gridjson.searchVal = params.searchVal
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
      this.gridjson.search = search
      this.getDataFromServer()
    }, 1000)
  }

  handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        // return UsersList.map((d) => {
        //   return {
        //     name: d.email.toLowerCase(),
        //     value: d.email.toLowerCase(),
        //   }
        // })
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
  addcannedReq(){
    this.initFeilds();
    this.setState({showaddview: true});
    
  }
  editClicked(row) {
    console.log(row);
    this.setState({
      id: row.Id,
      request: row.Request,
      response: row.Response,
      editId: row.Id,
      showaddview: true,
    })
  }

  deleteClicked(row) {
    notification.showConfirmDialogue(
      'Delete Canned Request',
      'Are sure you want to delete this Canned Request ? ',
      () => {
        deleteData('CannedRequest/deletecannedReq/' + row.Id).then(
          (d) => {
            this.refreshTable();
            notification.showSuccessMessage('Deleted Canned Request successfully')
          },
          (e) => {}
        )
      },
      () => {}
    )
  }

  saveCannedRequest() {
    try {
      var json = {
        id: this.state.editId,
        request: this.state.request,
        response: this.state.response,
      }
      if (this.state.request && this.state.response) {
        if (this.state.editId) {
          putdata('CannedRequest/updatecannedReq', json).then((d) => {
            notification.showSuccessMessage('Updated Canned Request successfully')
            this.refreshTable()
            this.initFeilds()
          })
        } else {
          postdata('CannedRequest/addcannedReq', json).then((d) => {
            notification.showSuccessMessage('Added Canned Request successfully')
            this.refreshTable()
            this.initFeilds()
          })
        }
      } else {
        notification.showErrorMessage('Provide Canned Request and Response')
      }
    } catch (e) {
      console.log(e)
    }
  }

  initFeilds() {
    this.setState({
      DepartmentName: '',
      DepartmentHead: '',
      Departmentcolor: '#fff',
      DepartmentDesc: '',
      OKREmployee: '',
      id: '',
      newUser: '',
      Country: '',
      editId: '',
      showaddview: false,
    })
  } 
 
  getDefaultValue(list, value) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].value === value) {
        return list[i]
      }
    }
  }


  render() {
 
    const cannedRequestBreadCrumbs = [
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
        <PageTitle breadcrumbs={cannedRequestBreadCrumbs}>Canned Requests</PageTitle>
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
            <button
                placeholder=''
                class='btn btn-primary btn-sm m-1'
                name='add'
                onClick={() => this.addcannedReq()}>
                <i class="fa fa-plus fs-4"></i>&nbsp; Add canned Request
              </button>
            </div>
          </div>
          <div class='card-body px-0 py-0'>
            <div
              id='tableView'
              className={`table_content  ${this.state.addview ? 'hide' : 'show'}`}
            >
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
        <Modal
          show={this.state.showaddview}
          onHide={() => this.setState({showaddview: false})}
          backdrop='static'
          keyboard={false}
          size='md'
        >
          <Modal.Header closeButton>
            <Modal.Title>
            {this.state.editId ?  "Edit Canned Request" : "Add Canned Request"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={`row h-100 overflow-auto`}>
                <div className="form-group">
                <label class="form-label fs-6 fw-semibold">Request</label>
                    <input type="text" className="form-control form-control-solid" name="request" onChange={this.handleChange}  value={this.state.request}  placeholder="Request" />
                </div>
                <div className="form-group">
                <label class="form-label fs-6 fw-semibold">Response</label>
                    <input type="text" className="form-control form-control-solid" name="response" onChange={this.handleChange}  value={this.state.response} placeholder="Response" />
                </div>
                      
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-danger btn-sm' onClick={() => this.initFeilds()}>
            <i class="fa-solid fa-xmark mr-2"></i>Cancel
            </button>
            <button className='btn btn-success btn-sm' onClick={() => this.saveCannedRequest()}>
            <i class="fa-regular fa-bookmark mr-2"></i>Save
            </button>
          </Modal.Footer>
        </Modal>
       
      </>
    )
  }
}
