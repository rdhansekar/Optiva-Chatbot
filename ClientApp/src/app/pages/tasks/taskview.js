import React from "react";
import { postdata, getData, putdata } from "../../../service/httputlity";
import "./taskview.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { getAccountsettings, notification } from "../../../service/utility";
import { IsFeatureAllowed, UsersList } from "../../../service/taskservice";
import Select from "react-select";
import { KTSVG } from "../../../_metronic/helpers";
import { Messages } from "../../../service/contants";
import { PageTitle } from "../../../_metronic/layout/core";

export default class Task extends React.Component {
  state = {
    fileUpdaloaded: false,
    data: { data: [], totalRows: 0 },
    columns: [
      {
        field: "imageLink",
        headerName: "Image",
        flex: 0.5,
        renderCell: (params) => (
          <div>{this.getImage(params.row.imageLink)}</div>
        ),
      },
      { field: "Name", headerName: "Name", flex: 0.5 },
      { field: "Gender", headerName: "Gender", flex: 0.5 },
      { field: "estimatedDOB", headerName: "Estimated DOB", flex: 0.5 },
      { field: "status", headerName: "Status", flex: 0.5 },
    ],
    Body: "",
    Status: "",
    emailUsers: [],
    _id: "",
    taskData: {
      TaskNotes: [],
      Log: [],
    },
    subTasks: [],
  };

  handleChange = this.handleChange.bind(this);

  // eslint-disable-next-line no-dupe-class-members
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
    var data = {};
    switch (event.target.name) {
      case "Status":
        data = {
          _id: this.state._id,
          Status: event.target.value,
        };
        this.updateTask(data);
        break;
      case "AssigneeEmailAddress":
        data = {
          _id: this.state._id,
          AssigneeEmailAddress: event.target.value,
        };
        this.reassignTask(data);
        break;
      default:
        break;
    }
  }

  getallowedTaskStatus() {
    var tasks = [];

    switch (this.state.Status) {
      case "Assigned":
        tasks = ["Assigned", "Open"];
        break;
      case "Done":
        tasks = ["Done", "Open"];
        if (
          getAccountsettings().userid.toLowerCase() ===
          this.state.AssignerEmailAddress.toLowerCase()
        ) {
          tasks = ["Done", "Approved", "Open"];
        }
        break;
      case "Cancelled":
        tasks = ["Cancelled", "Reopen"];
        break;
      case "Reopen":
        tasks = ["Reopen", "Open", "In Progress", "Done", "Reject"];
        break;
      case "Approved":
        tasks = ["Approved", "Open"];
        break;
      case "Open":
        tasks = ["Open", "In Progress", "Done",  "Reject"];
        break;
      case "Reject":
        tasks = ["Open", "Reject"];
        break;
      case "In Progress":
        tasks = [
          "In Progress",
          "Done",
          "Waiting on Customer",
          "Waiting on Third Party",
        ];
        break;
      case "Waiting on Customer":
        tasks = ["Open", "Waiting on Customer", "Cancelled"];
        break;
      case "Waiting on Third Party":
        tasks = ["Open", "Waiting on Third Party", "Cancelled"];
        break;
      default:
        tasks = ["Open"];
        break;
    }
    return tasks.map((d) => {
      return <option value={d}>{d}</option>;
    });
  }

  getTaskDetails() {
    var d = window.location.href.split("?");
    var query = d[1].split("=");
    getData( "gettaskdetails?id=" + query[1]).then(
      (d) => {
        if (d) {
          this.setState({
            _id: d._id,
            taskData: d,
            Body: d.Body,
            Status: d.Status,
            TaskNotes: "",
            Priority: d.Priority,
            AssigneeEmailAddress: d.AssigneeEmailAddress,
            AssignerEmailAddress: d.AssignerEmailAddress,
            TaskHeader: d.TaskHeader,
            Rating: d.Rating,
            Feedback: d.Feedback,
            ExternalStatus: d.ExternalStatus,
            Type:d.Type
          });
        }
      },
      (e) => {}
    );
  }

  componentDidMount() {
    var d = window.location.href.split("?");
    if (d[1]) {
      var query = d[1].split("=");
      if (query[1]) {
        this.getUserList();
        this.getTaskDetails();
        var json = {
          limit: 20,
          skip: 0,
          sort: "time",
          sortOrder: "desc",
          selection: "",
          ParentId: query[1],
        };
        postdata( "gettasks", json).then(
          (d) => {
            if (d && d.data && d.data.length > 0) {
              this.setState({
                subTasks: d.data,
              });
              console.log(d.data);
            }
          },
          (e) => {}
        );
      }
    }
  }

  getImage(imageLink) {
    return <img alt="" src={imageLink} />;
  }

  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      var rows = text.replace(/\r\n/g, "\n").split("\n");
      var headers = rows[0].split(",");
      var jsonar = [];
      for (var i = 1; i < rows.length; i++) {
        if (rows[i]) {
          var json = {};
          var row = rows[i].split(",");
          for (var j = 0; j < row.length; j++) {
            json[headers[j]] = row[j];
          }
          json["status"] = "Pending";
          json["id"] = i;
          json["_id"] = i;
          jsonar.push(json);
        }
      }
      var d = {
        data: jsonar,
        totalRows: jsonar.length,
      };
      this.setState({ data: d });
    };
    reader.readAsText(event.target.files[0]);
  }

  onFileUploadClick(id) {
    document.getElementById(id).click();
  }

  updateNotes() {
    var data = {
      TaskNotes: this.state.notes,
      _id: this.state._id,
    };
    if (this.state.Rating) {
      data["Rating"] = this.state.Rating;
    }
    if(this.state.Feedback){
      data["Feedback"] = this.state.Feedback;

    }
    if(this.state["ExternalStatus"] ){
      data["ExternalStatus"] = this.state.ExternalStatus;
    }
    this.updateTask(data);
  }

  updateTask(data) {
    if(this.state.Type =='OrgLevel' && !IsFeatureAllowed('orgtaskEdit')){
      notification.showErrorMessage(Messages.access_denied)
      return;
    }
    putdata( "updatetask", data).then((d) => {
      notification.showInfoMessage("Updated task successfully");
      this.getTaskDetails();
    });
  }

  reassignTask(data) {
    if(this.state.Type =='OrgLevel' && !IsFeatureAllowed('orgtaskEdit')){
      notification.showErrorMessage(Messages.access_denied)
      return;
    }
    postdata( "reassigntask", data).then((d) => {});
  }

  rejectTask() {
    if(this.state.Type =='OrgLevel' && !IsFeatureAllowed('orgtaskEdit')){
      notification.showErrorMessage(Messages.access_denied)
      return;
    }
    var data = {
      asignee: this.state.assigner,
      _id: this.state._id,
    };
    postdata( "rejecttask", data).then((d) => {});
  }

  getUserList() {
    this.setState({ emailUsers: UsersList });
    if (UsersList.length === 0) {
      setTimeout(() => {
        this.getUserList();
      }, 1000);
    }
  }

  getUTCTimeFormatted(time) {
    var date = new Date(time);
    return date.toString();
  }

  linkSubTask() {
    this.setState({ addview: true });
  }

  cancelAdd() {
    this.setState({ addview: false });
  }


  getUserName(email) {
    for (var i = 0; i < UsersList.length; i++) {
      if (UsersList[i].email.toLowerCase() === email.toLowerCase()) {
        return UsersList[i].fName + " " + UsersList[i].lName;
      }
    }
  }

  handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return UsersList.map((d) => {
          return {
            name: d.email.toLowerCase(),
            value: d.email.toLowerCase(),
          };
        });
      }
      console.log(items);
      var result = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
          result.push(items[i]);
        }
      }
      return result;
    };
  };

  render() {
    var usersList = UsersList.map((d) => {
      return {
        label: d.email.toLowerCase(),
        value: d.email.toLowerCase(),
      };
    });

    var selectOption;
    if (this.state.AssigneeEmailAddress && UsersList.length > 0) {
      selectOption = (
        <Select
          options={usersList}
          filterOptions={this.handleFilter}
          value={this.state.AssigneeEmailAddress}
          search
          name="AssigneeEmailAddress"
          placeholder="Choose a Assignee"
          onChange={(item) => {
            this.setState({ AssigneeEmailAddress: item });
          }}
        />
      );
    }

    var comments = this.state.taskData.TaskNotes.map((d) => {
      return <div className="pt-4"><p className="pt-1">{this.getUTCTimeFormatted(d.time) + " : " + d.message}</p></div>;
    });
    var logs = this.state.taskData.Log.map((d) => {
      return <div className="pt-4"><p className="pt-1">{this.getUTCTimeFormatted(d.time) + " : " + d.message}</p></div>;
    });
    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        <div className="form-group">
          <span>Value</span> : <span>${this.state.taskData.ValueInDolor}</span>
        </div>
        <div className="form-group">
          <span>Category</span> : <span>{this.state.taskData.Category}</span>
        </div>
      </Tooltip>
    );
    var subtasks = this.state.subTasks.map((d) => {
      return (
        <div className="col-md-12">
          <div className="card p-3 mb-2 d-flex align-items-center flex-row justify-content-between">
            <div className="d-flex">
            <Link
              className="child"
              to={"/home/taskview?id=" + d._id}
              target="_blank"
            >
              <div className="id">{d.id}</div>
            </Link> 
            <div className="px-2 tit">{d.TaskHeader}</div>
            </div>
          
            <div className="sub-txt">
              {this.getUserName(d.AssigneeEmailAddress)}
            </div>
            <div className="status">{d.Status}</div>
          </div>
        </div>
      );
    });
    const taskViewBreadCrumbs = [
      {
        title: 'Task Flow View >',
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
        <PageTitle breadcrumbs={taskViewBreadCrumbs}> Task Flow View</PageTitle>
      <div className="card task_view">
      <div className={'card-header border-0 px-5 pt-0'}>
            <h3 className='card-title'>
                <span className='card-label fw-bold fs-4 mb-1 d-flex align-items-center'>
                  <i className="text_extract mw-330px" title={this.state.TaskHeader}>{this.state.TaskHeader}</i>
                &nbsp; <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}>
                  <i className="bi bi-info-circle-fill"></i>
                </OverlayTrigger>
                </span>
              </h3>
              <div class='card-toolbar'>
                <div class='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
                  <div className='alert alert-primary mb-0 fs-6 py-1 mr-1 d-flex align-items-center btn-sm'>
                    <span><b>Reporter</b> : {this.state.AssignerEmailAddress} </span>
                  </div>
                  &nbsp;
                  <div className='alert alert-primary mb-0 fs-6 py-1 d-flex align-items-center btn-sm'>
                    {' '}
                    <span><b>Completion Date</b> :  {this.state.taskData.CompletionDate +" " + this.state.taskData.CompletionTime}{" "}</span>
                  </div>
                  <Link to={'/home/tasks?search=&type='+btoa(this.state.Type == 'OrgLevel' ? 'OrgLevel' : '')} className='btn btn-sm btn-danger btn-sm ms-2'>
                  Go Back <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon-1' />
                  </Link>
                  {/* <button className="btn btn-primary d-flex align-items-center btn-sm"
                  onClick={() => this.linkSubTask()} title="Link Task">
                  <i className="bi bi-link"></i> &nbsp; Create Sub Task
                  </button>  */}
                </div>
              </div>
            </div>
        {/* <div className="d-flex flex-row justify-content-between pt-3">
          <div className="d-flex align-items-center px-4">
            <h5 className="card-title">Task Flow View - <i>{this.state.TaskHeader}</i></h5>
            <div className="form-group mb-2 m-1">
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <i className="bi bi-info-circle-fill"></i>
              </OverlayTrigger>
            </div>
          </div>
          <div className="info_top_box">
            <div className="form-group">
              <span>Reporter</span> :{" "}
              <span>{this.state.AssignerEmailAddress}</span>
            </div>
            <div className="form-group">
              <span>Completion Date Time </span> :{" "}
              <span>
                {this.state.taskData.CompletionDate +
                  " " +
                  this.state.taskData.CompletionTime}{" "}
              </span>
            </div>
             <button
              className="btn btn-outline-primary d-flex align-items-center btn-sm"
              onClick={() => this.linkSubTask()}
              title="Link Task"
            >
              <i className="bi bi-link"></i> &nbsp; Create Sub Task
            </button> 
          </div>
        </div> */}
        <div className={`card-body py-0`}>
          <div className="row h-100 pb-2">
            <div className="col-sm-12 col-lg-8 left_card">
              <div
                className="overflow-auto p-2 mb-3 h-100"
                dangerouslySetInnerHTML={{ __html: this.state.Body }}
              ></div>
            </div>
            <div className="col-sm-12 col-lg-4 shadow right_card overflow-auto">
              <div className="form-group">
                <label class="form-label">Status</label>
                <select
                  value={this.state.Status}
                  onChange={this.handleChange}
                  name="Status"
                  id="Status"
                  type="text"
                  className="form-control"
                  placeholder="Status"
                >
                  {this.getallowedTaskStatus(this.state.Status)}
                </select>
              </div>
              <div
                className={`form-group ${
                  this.state.Status === "Approved" ? "" : "hide"
                }`}
              >
                <label class="form-label">FeedBack</label>
                <textarea
                  rows={3}
                  value={this.state.Feedback}
                  onChange={this.handleChange}
                  name="Feedback"
                  id="Feedback"
                  className="form-control"
                  placeholder="Feedback"
                />
              </div>

              <div
                className={`form-group ${
                  this.state.Status === "Approved" ? "" : "hide"
                }`}
              >
                <label class="form-label">External Status</label>
                <textarea
                  rows={3}
                  value={this.state.ExternalStatus}
                  onChange={this.handleChange}
                  name="ExternalStatus"
                  id="ExternalStatus"
                  className="form-control"
                  placeholder="External Status"
                />
              </div>

              <div
                className={`form-group ${
                  this.state.Status === "Approved" ? "" : "hide"
                }`}
              >
                <label class="form-label"> Rating:</label>
              </div>
              <div
                className={`rating ${
                  this.state.Status === "Approved" ? "" : "hide"
                }`}
              >
                <input
                  type="radio"
                  checked={this.state.Rating == 5 ? true : false}
                  name="rating"
                  value="5"
                  id="rating_5"
                />
                <label htmlFor="5" title="5 Excelent" onClick={() => {
                    this.setState({ Rating: 5 });
                  }}>
                  ☆
                </label>
                <input
                  type="radio"
                  checked={this.state.Rating == 4 ? true : false}
                  name="rating"
                  value="4"
                  
                  id="rating_4"
                />
                <label htmlFor="4" title="4 Good" onClick={() => {
                    this.setState({ Rating: 4 });
                  }}>
                  ☆
                </label>
                <input
                  type="radio"
                  checked={this.state.Rating == 3 ? true : false}
                  name="rating"
                  value="3"
                  
                  id="rating_3"
                />
                <label htmlFor="3" title="3 Better" onClick={() => {
                    this.setState({ Rating: 3 });
                  }}>
                  ☆
                </label>
                <input
                  type="radio"
                  checked={this.state.Rating == 2 ? true : false}
                  name="rating"
                  value="2"
                  
                  id="rating_2"
                />
                <label htmlFor="2" title="2 ok" onClick={() => {
                    this.setState({ Rating: 2 });
                  }}>
                  ☆
                </label>
                <input
                  type="radio"
                  checked={this.state.Rating == 1 ? true : false}
                  name="rating"
                  value="1"
                  
                  id="rating_1"
                />
                <label htmlFor="1" title="1 Not Bad" onClick={() => {
                    this.setState({ Rating: 1 });
                  }}>
                  ☆
                </label>
              </div>

              <div className="form-group mb-2 mt-4">
                <label class="form-label">Assignee : </label>
                {this.state.AssigneeEmailAddress}
              </div>
              <div className="form-group">
                <label class="form-label">Priority</label>
                <select
                  value={this.state.Priority}
                  onChange={this.handleChange}
                  name="Priority"
                  id="Priority"
                  className="form-control"
                  placeholder="Priority"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <textarea
                  rows={6}
                  value={this.state.notes}
                  onChange={this.handleChange}
                  name="notes"
                  id="notes"
                  className="form-control"
                  placeholder="Comments"
                />
              </div>
              <button
                type="button"
                onClick={() => this.updateNotes()}
                className="btn btn-primary btn-block float-right shadow mb-2"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
        <div className="Tabs_container">
                <Tabs defaultActiveKey="Comments">
                  <Tab eventKey="Comments" title="Comments">
                    {comments}
                  </Tab>
                  <Tab eventKey="Logs" title="Logs">
                    {logs}
                  </Tab>
                  <Tab eventKey="SubTasks" title="Sub Tasks">
                    <div>{subtasks}</div>
                  </Tab>
                </Tabs>
              </div>
        </div>
      </div>
      </>
    
    );
  }
}
