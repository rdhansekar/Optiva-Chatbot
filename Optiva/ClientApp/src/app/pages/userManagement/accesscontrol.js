import React from 'react'
import {Link} from 'react-router-dom'
import {postdata, getData, putdata, deleteData} from '../../../service/httputlity'
import {downloadURI, formatDateTime, notification, options} from '../../../service/utility'
import DataTable from '../../../shared/table'
import Modal from 'react-bootstrap/Modal'
import CheckboxTree from 'react-checkbox-tree'
// import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import 'react-checkbox-tree/lib/react-checkbox-tree.css'
import {KTSVG} from '../../../_metronic/helpers'
import './userManagement.css'

export default class AccessControl extends React.Component {
  state = {
    icons: {
      check: <span className='rct-icon rct-icon-check' />,
      uncheck: <span className='rct-icon rct-icon-uncheck' />,
      halfCheck: <span className='rct-icon rct-icon-half-check' />,
      expandClose: <span className='rct-icon rct-icon-expand-close' />,
      expandOpen: <span className='rct-icon rct-icon-expand-open' />,
      expandAll: <span className='rct-icon rct-icon-expand-all' />,
      collapseAll: <span className='rct-icon rct-icon-collapse-all' />,
      parentClose: <span className='rct-icon rct-icon-parent-close' />,
      parentOpen: <span className='rct-icon rct-icon-parent-open' />,
      leaf: <span className='rct-icon rct-icon-leaf' />,
    },
    checked: [],
    expanded: [],
    newUser: '',
    role: 'user',
    UsersList: [],
    fileUpdaloaded: false,
    data: {data: [], totalRows: 0},
    showaddview: false,
    columns: [
      {
        field: 'roleName',
        headerName: 'Access Name',
        flex: 0.5,
      },
      {field: 'roleDesc', headerName: 'Desc', flex: 0.5},
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
              <i className='bi bi-pencil text-primary'></i>&nbsp;<span>Edit</span>
            </button>
            <button className='btn btn-sm btn-color-danger btn-active-light-danger' onClick={() => this.deleteClicked(params.row)}>
              <i className='bi bi-trash3 text-danger'></i>&nbsp;<span>Delete</span>
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
    limit: 20,
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
    postdata('getroles', this.gridjson).then(
      (d) => {
        this.setState({data: {data: d.data, totalRows: d.totalRows}})
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
        return this.state.UsersList.map((d) => {
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
      AccessName: row.roleName,
      AccessDesc: row.roleDesc,
      editId: row.id,
      showaddview: true,
      checked: row.permissionList,
    })
  }

  deleteClicked(row) {
    notification.showConfirmDialogue(
      'Delete Access',
      'Are sure you want to delete this access ? ',
      () => {
        deleteData('deleterole?id=' + row.id).then(
          (d) => {
            this.refreshTable()
          },
          (e) => {}
        )
      },
      () => {}
    )
  }

  initFeilds() {
    this.setState({
      AccessName: '',
      AccessDesc: '',
      newUser: '',
      editId: '',
      showaddview: false,
      checked: [],
    })
  }

  saveAccess() {
    try {
      if (this.state.AccessName && this.state.AccessDesc) {
        var json = {
          roleName: this.state.AccessName,
          roleDesc: this.state.AccessDesc,
          id: this.state.editId,
          permissionList: this.state.checked,
        }
        if (this.state.editId) {
          putdata('updaterole', json).then((d) => {
            notification.showSuccessMessage('Updated access successfully')
            this.refreshTable()
            this.initFeilds()
          })
        } else {
          postdata('addrole', json).then((d) => {
            notification.showSuccessMessage('Added access successfully')
            this.refreshTable()
            this.initFeilds()
          })
        }
      } else {
        notification.showErrorMessage('Please provide access Name and Description')
      }
    } catch (e) {
      console.log(e)
    }
  }
  nodes = [
    //permission count 42
    {
      value: '42',
      label: 'Business Dashboard',
    },
    {
      value: 'dashboard',
      label: 'Dashboard',
      children: [{value: '1', label: 'Organization Level'}],
    },
    {
      value: 'task',
      label: 'Org Level Task',
      children: [
        {value: '20', label: 'View'},
        {value: '18', label: 'Add'},
        {value: '19', label: 'Edit'},
      ],
    },
    {
      value: 'reports',
      label: 'Reports',
      children: [
        {value: '21', label: 'Organization Level'},
        {value: '22', label: 'Executive Level'},
      ],
    },
    {
      value: 'userManagement',
      label: 'User Management',
      children: [
        {
          value: 'Users',
          label: 'Users',
          children: [
            {value: '24', label: 'Add'},
            {value: '25', label: 'Edit'},
            {value: '26', label: 'Delete'},
          ],
        },
        {
          value: 'Access Control',
          label: 'Access Control',
          children: [
            {value: '27', label: 'Add'},
            {value: '28', label: 'Edit'},
            {value: '29', label: 'Delete'},
          ],
        },
      ],
    },
    {
      value: 'accountSettings',
      label: 'Account Settings',
      children: [
        {value: '30', label: 'Branding'},
        {
          value: 'Catgories',
          label: 'Categories',
          children: [
            {value: '31', label: 'Add'},
            {value: '32', label: 'Edit'},
            {value: '33', label: 'Delete'},
          ],
        },
        {
          value: 'departments',
          label: 'Departments',
          children: [
            {value: '34', label: 'Add'},
            {value: '35', label: 'Edit'},
            {value: '36', label: 'Delete'},
          ],
        },
        {
          value: 'region',
          label: 'Region',
          children: [
            {value: '37', label: 'Add'},
            {value: '38', label: 'Edit'},
            {value: '39', label: 'Delete'},
          ],
        },
        {
          value: 'subscription',
          label: 'Subscription',
          children: [
            {value: '41', label: 'Subscription Management'},
          ],
        },
      ],
    },
    {
      value: 'dataaccess',
      label: 'Global Data Access',
      children: [{value: '40', label: 'Across Region'}],
    },
  ]

  render() {
    return (
      <>
        <div className='card mb-5 mb-xxl-8 h-100'>
          {/* <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-4 mb-1'>Add Access Control</span>
            </h3>
          </div> */}
          <div class='card-header px-5 border-0'>
            <div className='d-flex align-items-center position-relative my-1'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-1 position-absolute ms-6'
              />
              <input
                placeholder='search'
                type='text'
                className='form-control form-control-solid form-control form-control-solid-solid w-250px ps-14'
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
            <div class='card-toolbar'>
              <input
                type='file'
                id='importfile'
                onChange={(e) => {
                  this.handleFileUpload(e)
                }}
                class='hide'
              ></input>
              <button
                placeholder=''
                class='btn btn-primary btn-sm m-1'
                name='add'
                onClick={(e) => {
                  this.initFeilds()
                  this.setState({showaddview: true})
                }}
              >
                <i className='fa fa-plus fs-4'></i>&nbsp; Add Access
              </button>
            </div>
          </div>
          <div class='card-body px-0 py-0'>
            <div
              id='tableView'
              className={`table_content h-100 ${this.state.addview ? 'hide' : 'show'}`}
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
          className='model_full_h overflow-hidden'
        >
          <Modal.Header closeButton>
          <Modal.Title>{this.state.editId ?  "Edit Access Details" : "Add New Access"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class='input_blk'>
              <div class='form-group mb-4'>
                <label className='form-label fs-6 fw-semibold required'>Name</label>
                <input
                  value={this.state.AccessName}
                  onChange={this.handleChange}
                  name='AccessName'
                  type='text'
                  class='form-control form-control-solid'
                />
              </div>
              <div class='form-group mb-4'>
                <label className='form-label fs-6 fw-semibold required'>Description</label>
                <input
                  value={this.state.AccessDesc}
                  onChange={this.handleChange}
                  name='AccessDesc'
                  type='text'
                  class='form-control form-control-solid'
                />
              </div>
              <div class='form-group mb-4 chkbox_tree_body'>
                <label className='form-label fs-6 fw-semibold'>Permissions</label>
                <CheckboxTree
                  nodes={this.nodes}
                  checked={this.state.checked}
                  expanded={this.state.expanded}
                  onCheck={(checked) => this.setState({checked})}
                  onExpand={(expanded) => this.setState({expanded})}
                  showExpandAll={true}
                  nativeCheckboxes={true}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type='button'
              onClick={() => this.setState({showaddview: false})}
              class='btn btn-danger btn-sm m-2'><i class="fa-solid fa-xmark mr-2"></i>Cancel
            </button>
            <button type='button' onClick={() => this.saveAccess()} class='btn btn-success btn-sm'>
            <i class="fa-regular fa-bookmark mr-2"></i><span>{this.state.editId ? 'Update' : 'Save'}</span>
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}
