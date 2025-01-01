import React from 'react'
import { Link } from 'react-router-dom'
import { deleteData, postdata } from '../../../service/httputlity'
import { formatDate, formatTime, notification } from '../../../service/utility'
import './taskview.css'
import DataTable from '../../../shared/table'
import { IsFeatureAllowed, UsersList } from '../../../service/taskservice'
import Modal from 'react-bootstrap/Modal'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { KTSVG } from '../../../_metronic/helpers'
import Select from 'react-select'
import { Messages } from '../../../service/contants'
import { Dropdown } from 'react-bootstrap'

export default class TaskList extends React.Component {
  state = {
    Priority: 'Medium',
    fileUpdaloaded: false,
    data1: { data: [], totalRows: 0 },
    data2: { data: [], totalRows: 0 },
    data3: { data: [], totalRows: 0 },
    columns: [
      {
        field: 'id',
        headerName: 'Id',
        width: "5%",
        renderCell: (params) => (
          <Link className='child' to={'/home/taskview?id=' + params.row._id}>
            <span>
              {params.row.id}
            </span>
          </Link>
        ),
      },
      {
        field: 'TaskHeader', headerName: 'Title',
        width: "18%",
      },
      {
        field: 'Priority',
        headerName: 'Priority',
        width: "11%",
        renderCell: (params) => (
          <>
            <i
              className={`fa-solid fs-5
          ${params.row.Priority === 'High' ? 'fa-arrow-up-wide-short text-danger' : ''} 
          ${params.row.Priority === 'Medium' ? 'fa-arrows-up-down text-warning' : ''}
          ${params.row.Priority === 'Low' ? 'fa-arrow-down-wide-short text-success' : ''}`}
            />
            <span class='ml-2 fs-8'>{params.row.Priority}</span>
          </>
        ),
      },
      {
        field: 'TaskCreatedAt',
        headerName: 'Created',
        width: "12%",
        renderCell: (params) => (
          <>
            <div className='text-gray-800 me-2'
              data-bs-toggle='tooltip-inner'
              data-bs-boundary='window'
              data-bs-placement='top'
              title={formatDate(params.row.TaskCreatedAt) + '-' + formatTime(params.row.TaskCreatedAt)}
            >
              {formatDate(params.row.TaskCreatedAt)}
            </div>
          </>
        ),
      },
      {
        field: 'EstimatedCompletionTime',
        headerName: 'Due Date',
        width: "12%",
        renderCell: (params) => (
          <>
            <div className='text-gray-800 me-2'
              data-bs-toggle='tooltip-inner'
              data-bs-boundary='window'
              data-bs-placement='top'
              title={formatDate(params.row.EstimatedCompletionTime) + '-' + formatTime(params.row.EstimatedCompletionTime)}
            >
              {formatDate(params.row.EstimatedCompletionTime)}
            </div>
          </>
        ),
      },
      { field: 'AssigneeEmailAddress', headerName: 'Assignee', width: "12%", },
      { field: 'AssignerEmailAddress', headerName: 'Assigner', width: "12%", },
      {
        field: 'Status',
        headerName: 'Status',
        width: "10%",
        renderCell: (params) => (
          <span
            className={`badge px-2 py-3 text-uppercase
            ${params.row.Status === 'Open' || params.row.Status === 'waiting for customer' ? 'badge-light-info' : ''}
            ${params.row.Status === 'Reopen' || params.row.Status === 'Reject' ? 'badge-light-danger' : ''}
            ${params.row.Status === 'In Progress' || params.row.Status === 'Resolved' ? 'badge-light-primary' : ''}
            ${params.row.Status === 'Completed' || params.row.Status === 'Done' || params.row.Status === 'Closed' || params.row.Status === 'Approved' ? 'badge-light-success' : ''}`}
          >
            {params.row.Status}
          </span>
        ),
      },
      {
        headerName: 'Action',
        sortable: false,
        field: 'action',
        width: "5%",
        renderCell: (params) => (
          <Dropdown>
            <Dropdown.Toggle
              variant='light'
              size='sm'
              id='dropdown-basic'
              className='btn-sm btn-icon'
            >
              <i class='bi bi-three-dots-vertical fs-3'></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item >
                <Link to={'/home/taskview?id=' + params.row._id} title='Edit'
                  className='btn btn-sm btn-color-primary w-100 btn-active-light-primary'
                >
                  <i className='bi bi-pencil text-primary'></i> Edit
                </Link>
              </Dropdown.Item>
              <Dropdown.Item  >
                <button className='btn btn-sm btn-color-danger' title='Delete' onClick={() => this.deleteClicked(params.row)}>
                  <i className='bi bi-trash3 text-danger'></i> Delete
                </button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        ),
      },

    ],
    Body: '',
    Status: 'Assigned',
    emailUsers: [],
    _id: '',
    getType: 'Assigned',
    addview: false,
    selectedTab: 'Assigned',
  }

  json = {
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
    if (window.location.href.search('search=') !== -1) {
      var queryparams = window.location.href.split('?')[1]
      if (queryparams) {
        queryparams = queryparams.split('&')
        let t = atob(queryparams[0].split('search=')[1])
        this.json['search'] = t ? t : ''
        let t1 = atob(queryparams[1].split('type=')[1])
        this.json['getType'] = t1 ? t1 : ''
        if (t1 || t)
          this.setState({ searchVal: this.json['search'], selectedTab: this.json['getType'] })
      }
    }
    this.getDataFromServer()
    this.getCategories()
  }

  getCategories() {
    var json = {
      limit: -1,
      skip: 0,
      sort: 'time',
      sortOrder: 'desc',
      selection: '',
      ParentId: '',
      getType: 'Assigned',
    }

    postdata('getcategories', json).then(
      (d) => {
        this.setState({ CategoryList: d.rows })
      },
      (e) => { }
    )
  }

  deleteClicked(row) {
    notification.showConfirmDialogue(
      'Delete Task',
      'Are sure you want to delete this task ? ',
      () => {
        deleteData('deletetask?id=' + row._id).then(
          (d) => {
            if (d && d.success) {
              this.refreshTable();
              notification.showSuccessMessage('Deleted rask successfully');
            } else {
              notification.showErrorMessage(d.message ? d.message : 'Some error occured');
            }
          },
          (e) => { }
        )
      },
      () => { }
    )
  }

  getDataFromServer() {
    postdata('gettasks', this.json).then(
      (d) => {
        if (d) {
          if (this.state.selectedTab == 'OrgLevel') {
            this.setState({
              data1: d,
            })
          }
          else if (this.state.selectedTab == 'Assigned') {
            this.setState({
              data3: d,
            })
          }
          else if (this.state.selectedTab == 'Created') {
            this.setState({
              data2: d,
            })
          }
        }
      },
      (e) => { }
    )
  }

  getUserList(callback) {
    this.setState({ emailUsers: UsersList })
  }


  refreshTable(params) {
    if (params) {
      this.json.limit = params.limit
      this.json.skip = params.skip
      this.json.sort = params.sort
      this.json.sortOrder = params.sortOrder
    }
    this.json.getType = this.state.selectedTab
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
      this.json['search'] = event.target.value
      this.refreshTable()
    }, 1000)
  }

  sidebarItemsClicked(event) {
    var id = event.target.dataset.rrUiEventKey
    this.json.getType = id
    this.json.search = '';
    this.json.limit = 20;
    this.json.skip = 0;
    this.setState({ selectedTab: id, searchVal: '', updateTable: true })
    this.getDataFromServer()
  }

  AddTask() {
    this.setState({ addview: true })
    this.initFields()
  }

  cancelAdd() {
    this.setState({ addview: false })
    this.initFields()
  }

  getUserFName(email) {
    if (email) {
      email = email.toLowerCase()
      for (var i = 0; i < UsersList.length; i++) {
        if (UsersList[i].email.toLowerCase() === email) {
          return UsersList[i].fName
        }
      }
    }
    return ''
  }

  initFields() {
    var date = new Date()
    date.setDate(date.getDate() + 3)
    var yyyy = date.getFullYear()
    var mm = (date.getMonth() + 1).toString().padStart(2, '0')
    var dd = date.getDate().toString().padStart(2, '0')
    this.setState({
      Assignee: '',
      Category: 'Proposal',
      TaskNotes: '',
      CompletionDate: yyyy + '-' + mm + '-' + dd,
      CompletionTime: '18:00',
      Priority: 'Medium',
      TaskHeader: '',
      ValueInDolor: '',
      MailCC: '',
    })
  }

  saveTicket() {
    if (this.state.selectedTab === 'OrgLevel' && !IsFeatureAllowed('orgtaskAdd')) {
      notification.showErrorMessage(Messages.access_denied)
      return
    }
    var json = {
      ParentId: null,
      conversationId: 'Not Available',
      AssigneeEmailAddress: this.state.Assignee,
      Body: this.state.TaskNotes,
      Category: this.state.Category,
      CompletionDate: this.state.CompletionDate,
      CompletionTime: this.state.CompletionTime,
      FromEmailAddress: '',
      FromName: '',
      Priority: this.state.Priority,
      Status: 'Open',
      Subject: this.state.TaskHeader,
      TaskHeader: this.state.TaskHeader,
      TaskNotes: this.state.TaskNotes,
      ValueInDolor: this.state.ValueInDolor,
      MailCC: this.state.MailCC,
      AssigneeName: this.getUserFName(this.state.Assignee),
      Type: this.state.selectedTab,
    }
    if (this.state.Assignee && this.state.TaskHeader && this.state.Priority && this.state.CompletionDate && this.state.CompletionTime) {
      postdata('createsubtask', json).then((d) => {
        if (d && d.success) {
          this.cancelAdd()
          this.getDataFromServer();
          notification.showSuccessMessage('Task created successfully');
        }
      })
    } else {
      notification.showErrorMessage('Please fill all the required fields');
    }

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

  render() {
    console.log(this.state.Body)
    var usersList = UsersList.map((d) => {
      return {
        label: d.email.toLowerCase(),
        value: d.email.toLowerCase(),
      }
    })
    var tabContent = (
      <>
        <div class='card h-100'>
          <div class='card-header border-0 px-5'>
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
                <button
                  class='btn btn-outline form-control form-control-solid btn-icon ms-2'
                  onClick={() => {
                    this.refreshTable()
                  }}
                >
                  <i class='fa-solid fa-arrow-rotate-right'></i>
                </button>
              </div>
            </div>
            <div class='card-toolbar'>
              <div class='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
                <button
                  className='btn btn-primary btn-sm'
                  onClick={() => this.AddTask()}
                  title='Add Task'
                >
                  <i className='fa fa-plus fs-4'></i> Add Task
                </button>
              </div>
              <div
                class='d-flex justify-content-end align-items-center d-none'
                data-kt-user-table-toolbar='selected'
              >
                <div class='fw-bold me-5'>
                  <span class='me-2' data-kt-user-table-select='selected_count'></span> Selected
                </div>

                <button
                  type='button'
                  class='btn btn-danger'
                  data-kt-user-table-select='delete_selected'
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
          <div class='card-body px-0 py-0'>
            <div
              id='tableView'
              className={`table_content  ${this.state.addview ? 'hide' : 'd-flex'
                }`}
            >
              {this.state.selectedTab === 'OrgLevel' ?
                <DataTable
                  className='table table-striped'
                  setSelection={(id) => {
                    this.setState({ editId: id })
                  }}
                  refresh={(params) => {
                    this.refreshTable(params)
                  }}
                  columns={this.state.columns}
                  data={this.state.data1}
                  gridJson={this.json}
                  reInit={this.state.updateTable}
                /> : <></>}
              {this.state.selectedTab === 'Created' ?
                <DataTable
                  className='table table-striped'
                  setSelection={(id) => {
                    this.setState({ editId: id })
                  }}
                  refresh={(params) => {
                    this.refreshTable(params)
                  }}
                  columns={this.state.columns}
                  data={this.state.data2}
                  gridJson={this.json}
                  reInit={this.state.updateTable}
                /> : <></>}
              {this.state.selectedTab === 'Assigned' ?
                <DataTable
                  className='table table-striped'
                  setSelection={(id) => {
                    this.setState({ editId: id })
                  }}
                  refresh={(params) => {
                    this.refreshTable(params)
                  }}
                  columns={this.state.columns}
                  data={this.state.data3}
                  gridJson={this.json}
                  reInit={this.state.updateTable}
                /> : <></>}
            </div>

          </div>
        </div>
      </>
    )
    const taskBreadCrumbs = [
      {
        title: 'Task >',
        path: '/home/tasks',
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
        <PageTitle breadcrumbs={taskBreadCrumbs}>Task List</PageTitle>
        <div className='nav nav-stretch nav-line-tabs_custom nav-line-tabs-2x border-transparent fs-5 fw-bolder h-100'>
          <Tabs
            onClick={(event) => this.sidebarItemsClicked(event)}
            activeKey={this.state.selectedTab}
            id='justify-tab-example'
            justify
            className='w-100'
          >
            <Tab eventKey='Assigned' title='To Do'>
              {tabContent}
            </Tab>
            <Tab eventKey='Created' title='Create By Me'>
              {tabContent}
            </Tab>
            {IsFeatureAllowed('orgtaskAdd') ||
              IsFeatureAllowed('orgtaskEdit') ||
              IsFeatureAllowed('orgtaskView') ? (
              <Tab eventKey='OrgLevel' title='Org Level'>
                {tabContent}
              </Tab>
            ) : (
              <></>
            )}
          </Tabs>
          <Modal
            show={this.state.addview}
            onHide={() => {
              this.cancelAdd()
            }}
            backdrop='static'
            keyboard={false}
            size='lg'
          >
            <Modal.Header closeButton>
              <Modal.Title>Create a new task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className={`row h-100 overflow-auto ${this.state.addview ? 'show' : 'hide'} `}>
                <div className='input_blk h-100'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='form-group mb-4'>
                        <label class='form-label fs-6 fw-semibold mb-2 required'>
                          {' '}
                          Task Title:
                        </label>
                        <input
                          type='text'
                          value={this.state.TaskHeader}
                          onChange={this.handleChange}
                          name='TaskHeader'
                          id='task_header'
                          className='form-control form-control-solid'
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group mb-4'>
                        <label class='form-label fs-6 fw-semibold mb-2 required'>Category :</label>
                        <select
                          value={this.state.Category}
                          onChange={this.handleChange}
                          name='Category'
                          id='category'
                          className='form-select form-select-solid'
                        >
                          <option value='Lead Generation'>Lead Generation</option>
                          <option value='Proposal' selected>
                            Proposal
                          </option>
                          <option value='Action'>Action</option>
                          <option value='Client Delivery'>Client Delivery</option>
                          <option value='Complaint'>Complaint</option>
                          <option value='Others'>Others</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group mb-4'>
                        <label class='form-label fs-6 fw-semibold mb-2 required'> Value ($):</label>
                        <input
                          type='number'
                          value={this.state.ValueInDolor}
                          onChange={this.handleChange}
                          name='ValueInDolor'
                          id='valueinDolor'
                          className='form-control form-control-solid'
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group mb-4'>
                        <label class='form-label fs-6 fw-semibold mb-2 required'>Priority:</label>
                        <select
                          value={this.state.Priority}
                          onChange={this.handleChange}
                          name='Priority'
                          id='Priority'
                          className='form-select form-select-solid'
                        >
                          <option value='High'>High</option>
                          <option value='Medium' selected>
                            Medium
                          </option>
                          <option value='Low'>Low</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group mb-4'>
                        <label class='form-label fs-6 fw-semibold mb-2 required'>
                          Completion Date:
                        </label>
                        <input
                          value={this.state.CompletionDate}
                          onChange={this.handleChange}
                          name='CompletionDate'
                          type='date'
                          id='completion_date'
                          className='form-control form-control-solid'
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group mb-4 select_search'>
                        <label class='form-label fs-6 fw-semibold mb-2 required'>Assign To:</label>
                        <Select
                          className='basic-single'
                          classNamePrefix='select'
                          defaultValue={() => {
                            return this.state.Assignee
                          }}
                          isDisabled={false}
                          isLoading={false}
                          isClearable={true}
                          isRtl={false}
                          isSearchable={true}
                          name='Assignee'
                          options={usersList}
                          onChange={(val) => {
                            this.setState({ Assignee: val.value })
                          }}
                          placeholder='Choose Assignee'
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group mb-4'>
                        <label class='form-label fs-6 fw-semibold mb-2 required'>
                          Completion Time:
                        </label>
                        <input
                          value={this.state.CompletionTime}
                          onChange={this.handleChange}
                          name='CompletionTime'
                          type='time'
                          className='form-control form-control-solid'
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group mb-4 select_search'>
                        <label class='form-label fs-6 fw-semibold mb-2 '>CC:</label>
                        <Select
                          className='basic-single'
                          classNamePrefix='select'
                          defaultValue={() => {
                            return this.state.MailCC
                          }}
                          isDisabled={false}
                          isLoading={false}
                          isClearable={true}
                          isRtl={false}
                          isSearchable={true}
                          name='MailCC'
                          options={usersList}
                          onChange={(val) => {
                            this.setState({ MailCC: val })
                          }}
                          isMulti
                          placeholder='Choose CC'
                        />
                        {/* <input
                          value={this.state.MailCC}
                          onChange={this.handleChange}
                          name='MailCC'
                          type='text'
                          className='form-control form-control-solid'
                        /> */}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group mb-4'>
                        <label class='form-label fs-6 fw-semibold mb-2'> Comments:</label>
                        <textarea
                          value={this.state.TaskNotes}
                          onChange={this.handleChange}
                          name='TaskNotes'
                          row='3'
                          type='text'
                          id='task_notes'
                          className='form-control form-control-solid'
                        ></textarea>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button className='btn btn-danger btn-sm' onClick={() => this.cancelAdd()}>
                <i class='fa-solid fa-xmark mr-2'></i>Cancel
              </button>
              <button className='btn btn-success btn-sm' onClick={() => this.saveTicket()}>
                <i class='fa-regular fa-bookmark mr-2'></i>Save
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </>
    )
  }
}
