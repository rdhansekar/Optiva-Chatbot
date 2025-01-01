import React from 'react';
import {Link} from 'react-router-dom';
import {postdata, getData, putdata, deleteData} from '../../../service/httputlity';
import {downloadURI, formatDateTime, notification, options} from '../../../service/utility';
import DataTable from '../../../shared/table';
import Modal from 'react-bootstrap/Modal';
import {KTSVG} from '../../../_metronic/helpers';
import { UsersList } from '../../../service/taskservice';
import Select from 'react-select';

export default class Department extends React.Component {
  state = {
    newUser: '',
    role: 'user',
    fileUpdaloaded: false,
    data: {data: [], totalRows: 0},
    showaddview: false,
    columns: [
      {
        field: 'department_name',
        headerName: 'Department Name',
        flex: 0.5,
      },
      {field: 'department_desc', headerName: 'Desc', flex: 0.5},
      {field: 'department_head', headerName: 'Head', flex: 0.5},
      {
        headerName: 'Action',
        sortable:false,
        field: 'action',
        flex: 0.6,
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
    Body: '',
    Status: 'Assigned',
    emailUsers: [],
    _id: '',
    getType: 'Assigned',

    addview: false,
    selectedChild: 1,
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
    skip: 0,
    sort: 'time',
    sortOrder: 'desc',
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
    postdata('getdepartments', this.gridjson).then(
      (d) => {
        this.setState({data:d})
      },
      (e) => {}
    )
  }

  refreshTable(params) {
    if (params) {
      this.gridjson.limit = params.limit
      this.gridjson.skip = params.skip
      this.gridjson.sort = params.sort
      this.gridjson.sortOrder = params.sortOrder
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
        return UsersList.map((d) => {
          return {
            name: d.email.toLowerCase(),
            value: d.email.toLowerCase(),
          }
        })
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
  addDepartment(){
    this.initFeilds();
    this.setState({showaddview: true});
    
  }
  editClicked(row) {
    this.setState({
      id: row.id,
      DepartmentName: row.department_name,
      DepartmentHead: row.department_head,
      Departmentcolor: row.department_color,
      DepartmentDesc: row.department_desc,
      OKREmployee: row.okr_employee,
      editId: row.id,
      showaddview: true,
    })
  }

  deleteClicked(row) {
    notification.showConfirmDialogue(
      'Delete Department',
      'Are sure you want to delete this department ? ',
      () => {
        deleteData('deletedepartment?id=' + row.id).then(
          (d) => {
            this.refreshTable();
            notification.showSuccessMessage('Deleted department successfully')
          },
          (e) => {}
        )
      },
      () => {}
    )
  }

  saveDepartment() {
    try {
      var json = {
        id: this.state.editId,
        DepartmentName: this.state.DepartmentName,
        DepartmentHead: this.state.DepartmentHead,
        Departmentcolor: this.state.Departmentcolor,
        DepartmentDesc: this.state.DepartmentDesc,
        OKREmployee: this.state.OKREmployee,
      }
      if (this.state.DepartmentName && this.state.DepartmentDesc && this.state.DepartmentHead) {
        if (this.state.editId) {
          putdata('updatedepartment', json).then((d) => {
            notification.showSuccessMessage('Updated department successfully')
            this.refreshTable()
            this.initFeilds()
          })
        } else {
          postdata('adddepartment', json).then((d) => {
            notification.showSuccessMessage('Added department successfully')
            this.refreshTable()
            this.initFeilds()
          })
        }
      } else {
        notification.showErrorMessage('Provide department name , department head and description')
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
    var userList = UsersList.map((d) => {
      return {
        label: d.email.toLowerCase(),
        value: d.email.toLowerCase(),
      }
    });
    return (
      <>
          <div class="card accSettings_body">
          {/* <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-4 mb-1'>Add your Departments</span>
            </h3>
          </div> */}
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
              <input type='file' id='importfile' onChange={(e) => {this.handleFileUpload(e)}} class='hide'></input>
              <button
                placeholder=''
                class='btn btn-primary btn-sm m-1'
                name='add'
                onClick={() => this.addDepartment()}>
                <i class="fa fa-plus fs-4"></i>&nbsp; Add Department
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
          size='lg'
        >
          <Modal.Header closeButton>
            <Modal.Title>
            {this.state.editId ?  "Edit Department Details" : "Add New Department"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={`row h-100 overflow-auto`}>
              <div class='input_blk h-100'>
                <div className='row'>
                  <div className='col-md-6'>
                    <div class='form-group'>
                      <label class='form-label fs-6 fw-semibold required'>Department Name</label>
                      <input
                        value={this.state.DepartmentName}
                        onChange={this.handleChange}
                        name='DepartmentName'
                        type='text'
                        class='form-control form-control-solid'
                      />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div class='form-group select_search'>
                      <label class='form-label fs-6 fw-semibold required'>Department Head</label>
                      <Select
                        className='basic-single'
                        classNamePrefix='select'
                        value={this.getDefaultValue(userList,this.state.DepartmentHead)}
                        isDisabled={false}
                        isLoading={false}
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name='DepartmentHead'
                        options={userList}
                        onChange={(val) => {
                          this.setState({DepartmentHead: val.value})
                        }}
                        placeholder='Choose Department Head'
                      />
                    </div>
                  </div>
                  {/* <div className='col-md-6 d-none'>  // this is REQUIRED in feature 
                    <div class='form-group'>
                      <label class='form-label fs-6 fw-semibold'>Color</label>
                      <div className='row align-items-center'>
                        <div className='col-md-10 pr-0'>
                          <input
                            type='text'
                            class='w-100 form-control form-control-solid'
                            value={
                              this.state.Departmentcolor ? this.state.Departmentcolor : '#000000'
                            }
                            placeholder='click on color box to select color ->'
                          />
                        </div>
                        <div className='col-md-2 pl-0'>
                          <input
                            value={this.state.Departmentcolor}
                            onChange={this.handleChange}
                            name='Departmentcolor'
                            type='color'
                            class='form-control form-control-solid'
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className='col-md-12'>
                    <div class='form-group'>
                      <label class='form-label fs-6 fw-semibold required'>Description</label>
                      <input
                        value={this.state.DepartmentDesc}
                        onChange={this.handleChange}
                        name='DepartmentDesc'
                        type='text'
                        class='form-control form-control-solid'
                      />
                    </div>
                  </div>
                
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-danger btn-sm' onClick={() => this.initFeilds()}>
            <i class="fa-solid fa-xmark mr-2"></i>Cancel
            </button>
            <button className='btn btn-success btn-sm' onClick={() => this.saveDepartment()}>
            <i class="fa-regular fa-bookmark mr-2"></i>Save
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}
