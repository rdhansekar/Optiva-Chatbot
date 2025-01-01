import React from 'react'
import './reports.css'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { deleteData, postdata, putdata } from '../../../service/httputlity'
import { formatDate, formatDateTime, getAccountsettings, notification } from '../../../service/utility'
import DataTable from '../../../shared/table'
import { IsFeatureAllowed, UsersList } from '../../../service/taskservice'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { KTSVG } from '../../../_metronic/helpers'
import Select from 'react-select'

export default class Reports extends React.Component {
  msToTime = function (milliseconds) {
    if (milliseconds !== 'N/A') {
      var seconds = Math.floor(milliseconds / 1000)
      var minutes = Math.floor(seconds / 60)
      var hours = Math.floor(minutes / 60)
      var days = Math.floor(hours / 24)
      hours = hours - days * 24
      minutes = minutes - days * 24 * 60 - hours * 60
      seconds = seconds - days * 24 * 60 - hours * 60 - minutes * 60
      seconds = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds
      return days + ' D ' + hours + ' Hr ' + minutes + ' Min '
    }
    return milliseconds
  }

  reportColumns = {
    1: [
      { field: 'id', headerName: 'Status', flex: 0.5 },
      { field: 'TaskTotal', headerName: '# Tasks', flex: 0.5 },
      { field: 'CompletedOnTime', headerName: '# On Time', flex: 0.5 },
      { field: 'NotCompletedOnTime', headerName: '# Delayed', flex: 0.5 },
      {
        field: 'AvgTimeTakenForCompletion',
        headerName: 'Avg Task Resolution Time',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.AvgTimeTakenForCompletion),
      },
      {
        field: 'AvgTimeTakenForApproval',
        headerName: 'Avg Task Approval Time',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.AvgTimeTakenForApproval),
      },
      { field: 'country', headerName: 'Country', flex: 0.5 },
    ],
    2: [
      { field: 'AssigneeName', headerName: 'Team Member', flex: 0.5 },
      { field: 'id', headerName: 'Email Id', flex: 0.5 },
      { field: 'TaskTotal', headerName: '# Tasks', flex: 0.5 },
      { field: 'CompletedOnTime', headerName: '# On Time', flex: 0.5 },
      { field: 'NotCompletedOnTime', headerName: '# Delayed', flex: 0.5 },
      {
        field: 'AvgTimeTakenForCompletion',
        headerName: 'Avg Task Resolution Time',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.AvgTimeTakenForCompletion),
      },
    ],
    3: [
      { field: 'id', headerName: 'Email Id', flex: 0.5 },
      { field: 'TaskTotal', headerName: '# Tasks', flex: 0.5 },
      { field: 'CompletedOnTime', headerName: '# On Time', flex: 0.5 },
      { field: 'NotCompletedOnTime', headerName: '# Delayed', flex: 0.5 },
      {
        field: 'AvgTimeTakenForApproval',
        headerName: 'Avg Task Approval Time',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.AvgTimeTakenForCompletion),
      },
      {
        field: 'AvgTimeTakenForCompletion',
        headerName: 'Avg Task Resolution Time',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.AvgTimeTakenForCompletion),
      },
      { field: 'AvgRating', headerName: 'Avg Rating', flex: 0.5 },
    ],
    4: [
      { field: 'id', headerName: 'Email Id', flex: 0.5 },
      { field: 'TaskTotal', headerName: '# Tasks', flex: 0.5 },
      { field: 'CompletedOnTime', headerName: '# On Time', flex: 0.5 },
      { field: 'NotCompletedOnTime', headerName: '# Delayed', flex: 0.5 },
      {
        field: 'AvgTimeTakenForApproval',
        headerName: 'Avg Task Approval Time',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.AvgTimeTakenForCompletion),
      },
      {
        field: 'AvgTimeTakenForCompletion',
        headerName: 'Avg Task Resolution Time',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.AvgTimeTakenForCompletion),
      },
      { field: 'AvgRating', headerName: 'Avg Rating', flex: 0.5 },
    ],
    5: [
      { field: 'AssignerName', headerName: 'Assigner By', flex: 0.5 },
      { field: 'AssigneeEmailAddress', headerName: 'Email Id', flex: 0.5 },
      { field: 'Status', headerName: 'Status', flex: 0.5 },
      {
        field: 'TimeForDone',
        headerName: 'Time for Done',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.TimeForDone),
      },
      {
        field: 'TimeForAppoval',
        headerName: 'Time for Approval',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.TimeForAppoval),
      },
      { field: 'Rating', headerName: 'Rating', flex: 0.5 },
    ],
    6: [
      { field: 'id', headerName: 'Task Id', flex: 0.5 },
      { field: 'TaskHeader', headerName: 'Task Title', flex: 0.5 },
      { field: 'AssigneeEmailAddress', headerName: 'Task Owner', flex: 0.5 },
      {
        field: 'EstimatedCompletionTime',
        headerName: 'Completion Date',
        flex: 0.5,
        renderCell: (params) => formatDateTime(params.row.EstimatedCompletionTime),
      },
      {
        field: 'Status',
        headerName: 'Task Status',
        flex: 0.5,
      },
      { field: 'Priority', headerName: 'Task Impact', flex: 0.5 },
      { field: 'ValueInDolor', headerName: 'Value($)', flex: 0.5 },
      { field: 'Category', headerName: 'Category', flex: 0.5 },
      { field: 'country', headerName: 'Country', flex: 0.5 },
    ],
  }

  state = {
    StartDate: new Date().toISOString().split('T')[0],
    EndDate: new Date().toISOString().split('T')[0],
    fileUpdaloaded: false,
    data: { data: [], totalRows: 0 },
    report1: { data: [], totalRows: 0 },
    report2: { data: [], totalRows: 0 },
    reportTitle: 'Task Performance Report',
    reportOptions: [],
    tabList: [],
    columns: [
      { field: 'id', headerName: 'Status', flex: 0.5 },
      { field: 'TaskTotal', headerName: '# Tasks', flex: 0.5 },
      { field: 'CompletedOnTime', headerName: '# On Time', flex: 0.5 },
      { field: 'NotCompletedOnTime', headerName: '# Delayed', flex: 0.5 },
      {
        field: 'AvgTimeTakenForApproval',
        headerName: 'Avg Task Approval Time',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.AvgTimeTakenForCompletion),
      },
      {
        field: 'AvgTimeTakenForCompletion',
        headerName: 'Avg Task Resolution Time',
        flex: 0.5,
        renderCell: (params) => this.msToTime(params.row.AvgTimeTakenForCompletion),
      },
    ],
    Body: '',
    Status: 'Assigned',
    emailUsers: [],
    _id: '',
    json: {
      limit: 20,
      skip: 0,
      sort: 'time',
      sortOrder: 'desc',
      selection: '',
    },
    reportView: false,
    selectedTab: 1,
    selectedReport: 1,
    selectedReportView: <p>Select Any Report</p>,
    menuList: [
      {
        icon: 'bi bi-file-earmark-bar-graph menuIcon',
        id: 0,
        title: 'Reports',
        children: [
          {
            id: 3,
            title: 'Individual Level',
          },
        ],
      },
    ],
  }

  initMenuList() {
    let tabList = [];
    let selectedTab = '3';
    if (IsFeatureAllowed('reportsorgLevel')) {
      tabList.push({
        id: 1,
        title: 'Organization Level',
      });
      selectedTab = '1';
    }
    if (IsFeatureAllowed('reportsexecutiveLevel')) {
      tabList.push({
        id: 2,
        title: 'Executive Level',
      });
      selectedTab = selectedTab === '1' ? '1' : '2';
    }
    tabList.push({
      id: 3,
      title: 'Individual Level',
    });
    this.setState({
      tabList: tabList,
      selectedTab: selectedTab,
    })
    this.tabClicked(selectedTab)
  }

  getUserList() {
    this.setState({ emailUsers: UsersList })
  }
  handleChange = this.handleChange.bind(this)

  // eslint-disable-next-line no-dupe-class-members
  handleChange(event) {
    console.log(event.target.value)
    this.setState({
      [event.target.name]: event.target.value,
    })
    console.log(this.state)
  }

  componentDidMount() {
    this.initMenuList()
    this.getUserList()
  }

  generateReport(id) {
    var data = {}
    id = parseInt(id);
    switch (id) {
      case 1:
      case 4:
      case 3:
        data = {
          reportId: id,
          StartDate: this.state.StartDate,
          EndDate: this.state.EndDate,
        }
        break
      case 5:
      case 6:
      case 2:
        data = {
          reportId: id,
          StartDate: this.state.StartDate,
          EndDate: this.state.EndDate,
          emailAddress: this.state.AssigneeEmailAddress,
        }
      default:
        break
    }
    postdata('getreport', data).then((d) => {
      if (d && d.data) {
        this.setState({
          data: d,
          tempData: d,
          reportView: true,
          columns: this.reportColumns[id],
        })
      } else {
        notification.showInfoMessage('No data available')
      }
    })
    this.setState({AssigneeEmailAddress:''})
    //this.state.timeRange, this.state.RAssignee,
  }

  setStartEndDate() {
    let date = new Date()
    let date1 = new Date()
    const startdate = new Date(date1.setDate(date1.getDate() - 30))
    const defaultEValue = date.toISOString().split('T')[0]
    const defaultSValue = startdate.toISOString().split('T')[0]
    this.setState({
      StartDate: defaultSValue,
      EndDate: defaultEValue,
    })
  }

  reportClicked(id) {
    this.setState({
      selectedReport: id,
      AssigneeEmailAddress: '',
      reportTitle: this.state.reportOptions[id-1].title,
    })
    this.setStartEndDate()
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
    if (params) {
      this.gridjson.limit = params.limit
      this.gridjson.skip = params.skip
      this.gridjson.sort = params.sort
      this.gridjson.sortOrder = params.sortOrder
    }
    console.log(params)
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
      var searchVal = event.target.value
      var resultrows = []
      if (searchVal) {
        for (var i = 0; i < this.state.tempData.data.length; i++) {
          var col = this.state.tempData.data[i].id.toLowerCase()
          if (col.search(searchVal.toLowerCase()) !== -1) {
            resultrows.push(this.state.tempData.data[i])
          }
        }
        this.setState({
          data: { data: resultrows, totalRows: resultrows.length },
        })
      } else {
        this.setState({ data: this.state.tempData })
      }
    }, 1000)
  }

  closeReportView() {
    this.setState({ reportView: false })
  }

  downloadReport(reportName) {
    var columns = []
    for (var i = 0; i < this.state.columns.length; i++) {
      columns.push(this.state.columns[i].headerName)
    }
    var csv = columns.join(',')
    for (var i = 0; i < this.state.data.data.length; i++) {
      var d = this.state.data.data[i]
      var row = []
      for (var j = 0; j < this.state.columns.length; j++) {
        row.push(d[this.state.columns[j].field])
      }
      csv += '\n' + row.join(',')
    }
    this.download(csv, 'repot_' + reportName + '.csv')
  }

  download(data, filename) {
    // Creating a Blob for having a csv file format
    // and passing the data with type
    const blob = new Blob([data], { type: 'text/csv' })
    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob)
    // Creating an anchor(a) tag of HTML
    const a = document.createElement('a')
    // Passing the blob downloading url
    a.setAttribute('href', url)
    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', filename)
    // Performing a download with click
    a.click()
  }

  tabClicked(tab) {
    this.setState({
      selectedTab: tab,
    })
    var reportOptions = []
    switch (tab) {
      case '1':
        reportOptions = [
          { title: 'Task Performance Report', id: 1 },
          { title: 'Employee Performance Report', id: 2 },
          { title: 'My Tasks', id: 3 },
          { title: 'Tasks Created By Me', id: 4 },
          { title: 'Individual Task Status Report', id: 5 },
          { title: 'Delayed Task Status Report', id: 6 },
        ]
        break
      case '2':
        reportOptions = [
          { title: 'Task Performance Report', id: 1 },
          { title: 'Employee Performance Report', id: 2 },
          { title: 'My Tasks', id: 3 },
          { title: 'Tasks Created By Me', id: 4 },
          { title: 'Individual Task Status Report', id: 5 },
        ]
        break
      case '3':
      default:
        reportOptions = [
          { title: 'My Tasks', id: 3 },
          { title: 'Tasks Created By Me', id: 4 },
        ]
        break
    }
    this.setState({
      reportOptions: reportOptions,
    })
    this.closeReportView()
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
    var usersList = UsersList.map((d) => {
      return {
        label: d.email.toLowerCase(),
        value: d.email.toLowerCase(),
      }
    })
    var defaultInfo = 'Choose a Assignee'
    if (this.state.selectedReport === 2) {
      usersList = [
        {
          name: 'All',
          value: 'All',
        },
        ...usersList,
      ]
      defaultInfo = 'All'
    }

    var tabContent = (
      <div class="card h-100 w-100 mt-4">
      <div class="card-body px-5 py-3">
          <div className='input_blk h-100 w-50'>
            <div className='form-group mb-4'>
              <label class="form-label fs-6 fw-semibold mb-2 required">Report Type</label>
              <select
                className='form-control form-control-solid'
                value={this.state.selectedReport}
                onChange={(event) => {
                  this.reportClicked(event.target.value)
                }}
              >
                {this.state.reportOptions.map((x) => {
                  return <option value={x.id}>{x.title}</option>
                })}
              </select>
            </div>
            <div className='form-group mb-4'>
              <label class="form-label fs-6 fw-semibold mb-2 required">Start</label>
              <input
                value={this.state.StartDate}
                onChange={this.handleChange}
                name='StartDate'
                type='date'
                id='timeRange1'
                className='form-control form-control-solid'
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className='form-group mb-4'>
              <label class="form-label fs-6 fw-semibold mb-2 required">End</label>
              <input
                value={this.state.EndDate}
                onChange={this.handleChange}
                name='EndDate'
                type='date'
                id='timeRange2'
                className='form-control form-control-solid'
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className={`form-group mb-4 ${this.state.selectedReport === '4' || this.state.selectedReport === '6' ? '' : 'hide '}`}>
              <div class='form-group select_search'>
                <label class='form-label fs-6 fw-semibold required'>Assignee</label>
                <Select
                  className='basic-single'
                  classNamePrefix='select'
                  value={this.state.AssigneeEmailAddress}
                  isDisabled={false}
                  isLoading={false}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={true}
                  name='DepartmentHead'
                  options={usersList}
                  onChange={(item) => {
                    this.setState({ AssigneeEmailAddress: item })
                  }}
                  placeholder='Choose Employ'
                />
              </div>
            </div>
            <button
              className='btn btn-success btn-sm float-right mt-4'
              onClick={() => {
                this.generateReport(this.state.selectedReport)
              }}
            >
              Generate Report
            </button>
          </div>

        </div>
      </div>
    )

    var tabs = this.state.tabList.map((x) => {
      return (
        <Tab eventKey={x.id} title={x.title}>
          {tabContent}
        </Tab>
      )
    })
    const reportsBreadCrumbs = [
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
          <PageTitle breadcrumbs={reportsBreadCrumbs}>Reports</PageTitle>
          <div className='commingSoon'>
            <img src="/media/flags/commingSoon.jpg"  alt="comming soon" width="50%"/>
          </div>
          {/* <div className={this.state.reportView ? 'card h-100 w-100'  : 'hide'}>
            <div className={'card-header border-0 pt-6 px-4'}>
            <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bold fs-4 mb-1'>{this.state.reportTitle}</span>
              </h3>
              <div class='card-toolbar'>
                <div class='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
                  <div className='alert alert-primary mb-0 py-1 mr-1'>
                    <span>Start Date : {this.state.StartDate} </span>
                  </div>
                  &nbsp;
                  <div className='alert alert-primary mb-0  py-1 '>
                    {' '}
                    <span> End Date : {this.state.EndDate}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={'card-header border-0 px-5 pt-3'}>
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
                    onClick={() => { this.refreshTable(this.gridjson) }}><i class="fa-solid fa-arrow-rotate-right"></i>
                  </button>
                </div>
              </div>
              <div class='card-toolbar'>
                <div class='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
                  <button
                    onClick={() => {
                      this.downloadReport()
                    }}
                    className='btn btn-primary btn-sm ml-2'
                  >
                    <i className='bi bi-download'></i>&nbsp; Download
                  </button>
                  &nbsp;
                  <button
                    onClick={() => {
                      this.closeReportView()
                    }}
                    className='btn btn-danger btn-sm'
                  >
                    <i class="fa-solid fa-xmark mr-2"></i> Close
                  </button>
                </div>
              </div>
            </div>
            <div className={'card-body px-0 py-0'}>
              <div className={` ${this.state.reportView ? 'show' : 'hide'} h-100`}>
                <div id='tableView' className={`table_content `}>
                  <DataTable
                    className='table table-striped'
                    setSelection={(id) => {
                      this.setState({ editId: id })
                    }}
                    refresh={(params) => {
                      this.refreshTable(params)
                    }}
                    columns={this.state.columns}
                    data={this.state.data}
                    gridJson={this.gridjson}
                  />
                </div>
              </div>
            </div>
          </div> */}
        </>
    )
  }
}
