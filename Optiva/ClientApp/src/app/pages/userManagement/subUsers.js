import React from 'react'
import {postdata, getData, putdata, deleteData} from '../../../service/httputlity'
import {getDEPsettings, notification} from '../../../service/utility'
import DataTable from '../../../shared/table'
import {
  getAllSettings,
  getDepartments,
  UsersList,
} from '../../../service/taskservice'
import Modal from 'react-bootstrap/Modal'
import {KTSVG} from '../../../_metronic/helpers'
import Select from 'react-select'
import {serverDNS} from '../../../service/contants'

export default class SubUsers extends React.Component {
  depSettings = getDEPsettings()
  state = {
    newUser: '',
    role: 'User',
    featureTemplateId: '-1',
    UsersList: [],
    AccessControl: [],
    Departments: [],
    fileUpdaloaded: false,
    data: {data: UsersList, totalRows: UsersList.length},
    showaddview: false,
    columns: [
      {field: 'fName', headerName: 'User Name', flex: 0.5},
      {
        field: 'email',
        headerName: 'Email Id',
        flex: 0.5,
      },
      {field: 'country', headerName: 'Region / Country', flex: 0.5},
      {
        field: 'Status',
        headerName: 'Status',
        flex: 0.5,
        renderCell: (params) => (
          <div className='icon-center'>
            <p className={params.row.verificationExpiry < new Date() ? 'hide' : ''}>
              {params.row.status}{' '}
            </p>
            <p className={params.row.verificationExpiry < new Date() ? '' : 'hide'}>
              {' Invite Expired '}
            </p>
            <button
              className={
                params.row.verificationExpiry < new Date() ? 'btn btn-sm text-secondary' : 'hide'
              }
              onClick={() => this.retryEmail(params.row)}
            >
              <i class='bi bi-recycle'></i>
            </button>
          </div>
        ),
      },
      {
        headerName: 'Action',
        sortable:false,
        field: 'action',
        flex: 0.6,
        renderCell: (params) => (
          <div className={params.row['user_type'] == 'Admin' ? 'hide':'icon-center'}>
            <button
              className='btn btn-sm btn-color-primary btn-active-light-primary'
              onClick={() => this.editClicked(params.row)}
            >
              <i className='bi bi-pencil text-primary'></i>&nbsp;<span>Edit</span>
            </button>
            <button className='btn btn-sm' onClick={() => this.deleteClicked(params.row)}>
              <i className='bi bi-trash3 text-danger'></i>
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
    json: {
      limit: 20,
      skip: 0,
      sort: 'time',
      sortOrder: 'desc',
      selection: '',
      ParentId: '',
      getType: 'Assigned',
    },
    addview: false,
    selectedChild: 1,
    menuList: [
      {
        icon: 'bi bi-list-task text-info menuIcon',
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

  constructor(props) {
    super(props)
    this.refreshTable()
    this.getRegions()
  }

  regions = []
  getRegions() {
    let gridjson = {
      limit: 20,
      skip: 0,
      sort: 'time',
      sortOrder: 'desc',
      selection: '',
      ParentId: '',
      getType: 'Assigned',
    }
    postdata('getregions', gridjson).then(
      (d) => {
        this.setState({regionList: d.data})
        for (var i = 0; i < d.data.length; i++) {
          this.regions.push({label: d.data[i].region_name, value: d.data[i].region_name})
        }
      },
      (e) => {}
    )
  }

  handleChange = this.handleChange.bind(this)

  // eslint-disable-next-line no-dupe-class-members
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  getDefaultValue(list, value) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].value === value) {
        return list[i]
      }
    }
  }

  getAccessControlList() {
    var json = {
      limit: -1,
      skip: 0,
      sort: 'time',
      sortOrder: 'desc',
      selection: '',
      ParentId: '',
      getType: 'Assigned',
    }

    postdata('getroles', json).then(
      (d) => {
        this.setState({AccessControl: d.data})
      },
      (e) => {}
    )
  }

  setDepartments() {
    var dept = getDepartments()
    if (dept) {
      this.setState({Departments: dept})
    }
  }

  componentDidMount() {
    if (!this.depSettings) {
      getAllSettings()
    }
    if (this.depSettings && this.depSettings.SLDeployment) {
      this.getDataFromServer()
    }
    this.setDepartments()
    this.getAccessControlList()
    setTimeout(() => {
      this.setState({data: {data: UsersList, totalRows: UsersList.length}})
    }, 2000)
  }

  getDataFromServer() {
    if (this.depSettings && this.depSettings.SLDeployment) {
      getData('getnewusers').then(
        (d) => {
          this.setState({UsersList: d})
        },
        (e) => {}
      )
    }
  }
  
  gridjson = {
    limit: 20,
    skip: 0,
    sort: 'time',
    sortOrder: 'desc',
    selection: '',
    ParentId: '',
    getType: '0',
    search: '',
    objectiveId: '',
  }

  refreshTable(params) {
    this.getDataFromServer()
    if (params) {
      this.gridjson.limit = params.limit
      this.gridjson.skip = params.skip
      this.gridjson.sort = params.sort
      this.gridjson.sortOrder = params.sortOrder
    }
    postdata('getuserslist',this.gridjson).then((d) => {
      if (d && d.data) {
        //setUserMailIds(d.data)
        this.setState({data: d})
      }
    })
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
      this.gridjson.search = event.target.value;
      this.refreshTable();
    }, 1000)
  }

  handleFilter = (items, data) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return data
      }
      var result = []
      for (var i = 0; i < items.length; i++) {
        if (items[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
          result.push(items[i])
        }
      }
      return result
    }
  }

  getRoleName(id) {
    for (var i = 0; i < this.state.AccessControl.length; i++) {
      if (this.state.AccessControl[i].id === id) {
        return this.state.AccessControl[i].roleName
      }
    }
  }

  editClicked(row) {
    this.setState({
      role: row.Role,
      id: row.id,
      country: row.country,
      editId: row.id,
      newUser: row.email,
      showaddview: true,
      fName: row.fName,
      featureTemplateId: row.featureTemplateId,
      department: row.department,
      Manager: row.manager,
    })
  }

  retryEmail(row) {
    console.log(row)
  }

  deleteClicked(row) {
    notification.showConfirmDialogue(
      <span>
        <i class='bi bi-exclamation-triangle text-danger m-1'></i> <span>Delete User</span>
      </span>,
      <p>Are sure you want to delete this user ?</p>,
      () => {
        deleteData('deleteuser?id=' + row.id).then(
          (d) => {
            this.refreshTable()
          },
          (e) => {}
        )
      },
      () => {}
    )
  }

  initFields() {
    this.setState({
      role: 'User',
      id: '',
      newUser: '',
      country: '',
      editId: '',
      fName: '',
      showaddview: false,
      Manager: '',
      department: '',
      featureTemplateId: '-1',
    })
  }

  addUser() {
    try {
      var json = {
        id: this.state.id,
        role: this.state.role,
        country: this.state.country,
        fName: this.state.fName,
        manager: this.state.Manager,
        department: this.state.department,
        featureTemplateId: this.state.featureTemplateId,
        email: this.state.newUser,
      }
      if (this.state.editId) {
        putdata('updateUser', json).then((d) => {
          notification.showSuccessMessage('Updated user successfully')
          this.refreshTable();
          this.initFields();
        })
      } else if (this.state.id && this.state.featureTemplateId !== '-1') {
        postdata('verifyemail', {username: this.state.id}).then((d) => {
          if (d && !d.exist) {
            postdata('addnewuser', json).then((d) => {
              notification.showSuccessMessage(
                'Sent verification mail to user. Once email is verified, user will be able to access application.'
              )
              this.refreshTable();
              this.initFields()
            })
          } else {
            notification.showErrorMessage('Email Id already exists')
          }
        })
      } else {
        notification.showErrorMessage('Please select user')
      }
    } catch (e) {
      console.log(e)
    }
  }

  handleFileUpload(e) {
    var files = e.target.files
    // Check if the file is an image.
    if (!files || files.length === 0 || !files[0].type || !files[0].type.startsWith('text/')) {
      notification.showErrorMessage('Invalid File. ~' + files[0].type)
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      var text = event.target.result
      console.log(text)
      var ar = text.split('\r\n')
      for (var i = 0; i < ar.length; i++) {
        var ar1 = ar[i].split(',')
        if (ar1 && ar1.length === 3 && ar1[0] !== 'Email ID') {
          for (var j = 0; j < this.state.UsersList.length; j++) {
            if (ar1[0] === this.state.UsersList[j].email) {
              var json = {
                id: this.state.UsersList[j].id,
                role: ar1[1].trim('"'),
                country: ar1[2].trim('"'),
                email:ar1[0]
              }
              postdata('addnewuser', json).then((d) => {
                this.refreshTable()
              })
              notification.showSuccessMessage(
                'Initiated User Import. Refresh Grid for viewing users'
              )
              break
            }
          }
        }
      }
    })
    reader.readAsText(files[0])
    console.log(e)
  }

  render() {
    var selectOption = (
      <input
        value={this.state.id}
        onChange={this.handleChange}
        name='id'
        type='text'
        class='form-control form-control-solid'
      />
    )
    var usersList = []
    if (this.depSettings && this.depSettings.SLDeployment) {
      if (!this.state.editId) {
        usersList = this.state.UsersList.map((d) => {
          return {
            label: d.email.toLowerCase(),
            value: d.email.toLowerCase(),
          }
        })
          if (usersList.length > 0) {
            selectOption = (
              <Select
                className='basic-single'
                classNamePrefix='select'
                value={this.getDefaultValue(usersList, this.state.newUser)}
                isDisabled={false}
                isLoading={false}
                isClearable={true}
                isRtl={false}
                isSearchable={true}
                name='newUser'
                options={usersList}
                onChange={(val) => {
                  for (var i = 0; i < this.state.UsersList.length; i++) {
                    if (this.state.UsersList[i].email === val.value) {
                      this.setState({
                        newUser: val.value,
                        id: this.state.UsersList[i].id,
                        fName: this.state.UsersList[i].fName,
                      })
                      break
                    }
                  }
                }}
                placeholder='Choose Email Id'
              />
            )
          }
      } 
      else {
        selectOption = (
          <div className='form-conrol'>
            <b>{this.state.newUser}</b>
          </div>
        )
      }
    }
    var department = this.state.Departments.map((d) => {
      return {
        label: d.department_name,
        value: d.id,
      }
    })
    var existingUsersList = UsersList.map((d) => {
      return {
        label: d.email.toLowerCase(),
        value: d.email.toLowerCase(),
      }
    })
    console.log(this.state.AccessControl)
    var accessControlList = this.state.AccessControl.map((d) => {
      return {
        value: d.id,
        label: d.roleName,
      }
    })
    return (
      <>
        <div class='card mb-5 mb-xxl-8 h-100'>
          {/* <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-4 mb-1'>Add Users</span>
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
                className='form-control form-control-solid w-250px ps-14'
                name='searchVal'
                onChange={(e) => {
                  this.handleSearch(e)
                }}
                value={this.state.searchVal}
              ></input>
              <button
                class='btn btn-outline form-control form-control-solid btn-icon ms-2'
                onClick={() => {
                  this.refreshTable(this.gridjson)
                }}
              >
                <i class='fa-solid fa-arrow-rotate-right'></i>
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
                  this.setState({showaddview: true})
                }}
              >
                {' '}
                <i className='fa fa-plus fs-4'></i>&nbsp; Add User
              </button>
              <button
                placeholder=''
                class='btn btn-primary btn-sm m-1'
                name='import'
                onClick={(e) => {
                  document.getElementById('importfile').click()
                }}
              >
                <i class='bi bi-upload'></i>&nbsp; Import Users
              </button>
              <a
                class='btn btn-secondary btn-sm m-1'
                name='import'
                href={serverDNS + 'userimporttemplate.csv'}
                target='_blank'
              >
                <i class='bi bi-download'></i>&nbsp; Download Template{' '}
              </a>
            </div>
          </div>
          <div class='card-body px-0 py-0'>
            <div
              id='tableView'
              className={`table_content h-100  ${this.state.addview ? 'hide' : 'show'}`}
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
          onHide={() => this.initFields()}
          backdrop='static'
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.editId ? 'Edit User Details' : 'Add New User'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className='pb-0'>
            <div className={`row h-100 overflow-auto`}>
              <div class='input_blk h-100'>
                <div class='form-group mb-4 select_search'>
                  <label class='form-label w-100'>Email Id</label>
                  {selectOption}
                </div>

                <div class='form-group mb-4'>
                  <label class='form-label'>Name</label>
                  <input
                    value={this.state.fName}
                    onChange={this.handleChange}
                    name='fName'
                    type='text'
                    class='form-control form-control-solid'
                    readOnly={usersList.length > 0}
                  />
                </div>

                <div class='form-group mb-4 select_search'>
                  <label class='form-label required'>Reporting To</label>
                  <Select
                    className='basic-single'
                    classNamePrefix='select'
                    value={this.getDefaultValue(existingUsersList, this.state.Manager)}
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    name='Manager'
                    options={existingUsersList}
                    onChange={(val) => {
                      this.setState({Manager: val.value})
                    }}
                    placeholder='Choose Manager'
                  />
                </div>
                {/* <div class='form-group mb-4 select_search'>
                  <label class='form-label'>User Type:</label>
                  <select
                    class='form-control form-control-solid'
                    value={this.state.role}
                    onChange={(event) => {
                      this.setState({role: event.target.value})
                    }}
                    placeholder='Choose user type'
                  >
                    <option value='Admin'>Admin</option>
                    <option value='R-CEO'>R-CEO</option>
                    <option value='User'>Basic User</option>
                  </select>
                </div> */}

                <div class='form-group mb-4 select_search'>
                  <label class='form-label'>Permission Template:</label>
                  <Select
                    className='basic-single'
                    classNamePrefix='select'
                    value={this.getDefaultValue(accessControlList, this.state.featureTemplateId)}
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    name='Manager'
                    options={accessControlList}
                    onChange={(val) => {
                      this.setState({featureTemplateId: val.value})
                    }}
                    placeholder='Choose feature permission template'
                  />
                </div>

                <div class='form-group mb-4 select_search'>
                  <label class='form-label'>Region / Country: </label>
                  <Select
                    inputProps={{autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off'}}
                    className='basic-single'
                    classNamePrefix='select'
                    value={this.getDefaultValue(this.regions, this.state.country)}
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    autoComplete='off'
                    name='region'
                    options={this.regions}
                    onChange={(val) => {
                      this.setState({country: val.value})
                    }}
                    placeholder='Choose region'
                  />
                </div>
                <div class='form-group mb-5 pb-5 select_search'>
                  <label class='form-label'>Department: </label>
                  <Select
                    className='basic-single'
                    classNamePrefix='select'
                    value={this.getDefaultValue(department, this.state.department)}
                    isDisabled={false}
                    isLoading={false}
                    isClearable={true}
                    isRtl={false}
                    isSearchable={true}
                    name='department'
                    options={department}
                    onChange={(val) => {
                      this.setState({department: val.value})
                    }}
                    placeholder='Choose department'
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type='button'
              onClick={() => this.initFields()}
              class='btn btn-danger btn-sm m-2'
            >
              <i class='fa-solid fa-xmark mr-2'></i>Cancel
            </button>
            <button type='button' onClick={() => this.addUser()} class='btn btn-success btn-sm'>
              <i class='fa-regular fa-bookmark mr-2'></i>
              <span>{this.state.editId ? 'Update' : 'Save'}</span>
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}
