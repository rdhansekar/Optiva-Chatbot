import React from 'react';
import {Link} from 'react-router-dom';
import {postdata, getData, putdata, deleteData} from '../../../service/httputlity';
import {downloadURI, formatDateTime, notification, options} from '../../../service/utility';
import DataTable from '../../../shared/table';
import Modal from 'react-bootstrap/Modal';
import {KTSVG} from '../../../_metronic/helpers';
import { UsersList } from '../../../service/taskservice';
import Select from 'react-select';

export default class Region extends React.Component {
  state = {
    newUser: '',
    role: 'user',
    fileUpdaloaded: false,
    data: {data: [], totalRows: 0},
    showaddview: false,
    columns: [
      {
        field: 'region_name',
        headerName: 'Region Name',
        flex: 0.5,
      },
      {field: 'region_desc', headerName: 'Desc', flex: 0.5},
      {field: 'region_head', headerName: 'Head', flex: 0.5},
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
    postdata('getregions', this.gridjson).then(
      (d) => {
        this.setState({data: d})
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

  editClicked(row) {
    this.setState({
      id: row.id,
      RegionName: row.region_name,
      RegionHead: row.region_head,
      RegionDesc: row.region_desc,
      editId: row.id,
      showaddview: true,
    })
  }

  deleteClicked(row) {
    notification.showConfirmDialogue(
      'Delete Region',
      'Are sure you want to delete this region ? ',
      () => {
        deleteData('deleteregion?id=' + row.id).then(
          (d) => {
            this.refreshTable()
          },
          (e) => {}
        )
      },
      () => {}
    )
  }

  saveRegion() {
    try {
      var json = {
        id: this.state.editId,
        RegionName: this.state.RegionName,
        RegionHead: this.state.RegionHead,
        Regioncolor: this.state.Regioncolor,
        RegionDesc: this.state.RegionDesc,
      }
      if (this.state.RegionName) {
        if (this.state.editId) {
          putdata('updateregion', json).then((d) => {
            notification.showSuccessMessage('Updated region successfully')
            this.refreshTable()
            this.initFeilds()
          })
        } else {
          postdata('addregion', json).then((d) => {
            notification.showSuccessMessage('Added region successfully')
            this.refreshTable()
            this.initFeilds()
          })
        }
      } else {
        notification.showErrorMessage('Provide region Name')
      }
    } catch (e) {
      console.log(e)
    }
  }

  initFeilds() {
    this.setState({
      RegionName: '',
      RegionHead: '',
      RegionDesc: '',
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
              <span className='card-label fw-bold fs-4 mb-1'>Add your Regions</span>
            </h3>
          </div> */}
          <div class='card-header px-5 border-0'>
            <div class='card-title'>
              <div className='d-flex align-items-center position-relative my-1'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-1 position-absolute ms-6'
                />
                <input
                  placeholder='search'
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
                onClick={(e) => {
                  this.setState({
                    showaddview: true,
                    editId: '',
                    newUser: '',
                    id: '',
                  })
                }}
              >
                <i class="fa fa-plus fs-4"></i>&nbsp; Add Region
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
            <Modal.Title>{this.state.editId ?  "Edit Region Details" : "Add New Region"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={`row h-100 overflow-auto`}>
              <div class='input_blk h-100'>
                <div className='row'>
                  <div className='col-md-6'>
                    <div class='form-group'>
                      <label class='form-label fs-6 fw-semibold required'>Region Name</label>
                      <input
                        value={this.state.RegionName}
                        onChange={this.handleChange}
                        name='RegionName'
                        type='text'
                        class='form-control form-control-solid'
                      />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div class='form-group select_search'>
                      <label class='form-label fs-6 fw-semibold'>Region Head</label>
                      <Select
                        className='basic-single'
                        classNamePrefix='select'
                        value={this.getDefaultValue(userList, this.state.RegionHead)}
                        isDisabled={false}
                        isLoading={false}
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name='RegionHead'
                        options={userList}
                        onChange={(val) => {
                          this.setState({RegionHead: val.value})
                        }}
                        placeholder='Choose Region Head'
                      />
                    </div>
                  </div>
                 
                  <div className='col-md-6'>
                    <div class='form-group'>
                      <label class='form-label fs-6 fw-semibold'>Description</label>
                      <input
                        value={this.state.RegionDesc}
                        onChange={this.handleChange}
                        name='RegionDesc'
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
            <button className='btn btn-success btn-sm' onClick={() => this.saveRegion()}>
            <i class="fa-regular fa-bookmark mr-2"></i>Save
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}
