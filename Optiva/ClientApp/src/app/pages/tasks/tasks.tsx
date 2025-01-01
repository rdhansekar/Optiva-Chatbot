import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {getData, postdata} from '../../../service/httputlity'
import {
  MixedWidget2,
  MixedWidget10,
  MixedWidget11,
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget5,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  StatisticsWidget5,
  ListsWidget1,
} from '../../../_metronic/partials/widgets'
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../../../service/utility';
import { UsersList } from '../../../service/taskservice';

export default class TaskList extends React.Component {
  state = {
      Priority: "Medium",
      fileUpdaloaded: false,
      data: { data: [], totalRows: 0 },
      searchVal:'',
      Assignee:'',TaskNotes:'',Category:'',CompletionDate:'',CompletionTime:'',TaskHeader:'',ValueInDolor:'',
      columns: [
        {
          field: "id",
          headerName: "Task Id",
          flex: 0.5,
          renderCell: (params:any) => (
            <Link className="child" to={"/home/taskview?id=" + params.row._id}>
              <span>
                
                {params.row.id}
              </span>
            </Link>
          ),
        },
        { field: "TaskHeader", headerName: "Title", flex: 0.5 },
        { field: "Priority", headerName: "Priority", flex: 0.5 },
        {
          field: "TaskCreatedAt",
          headerName: "Created",
          flex: 0.5,
          renderCell: (params:any) => formatDateTime(params.row.TaskCreatedAt),
        },
        {
          field: "EstimatedCompletionTime",
          headerName: "Due Date",
          flex: 0.5,
          renderCell: (params:any) =>
            formatDateTime(params.row.EstimatedCompletionTime),
        },
        { field: "AssigneeEmailAddress", headerName: "Assignee", flex: 0.5 },
        { field: "AssignerEmailAddress", headerName: "Assigner", flex: 0.5 },
        { field: "Status", headerName: "Status", flex: 0.5 },
      ],
      Body: "",
      Status: "Assigned",
      emailUsers: [],
      _id: "",
      getType: "Assigned",
      json: {
        limit: 20,
        skip: 0,
        sort: "time",
        sortOrder: "desc",
        selection: "",
        ParentId: "",
        getType: "Assigned",
        search:'',
      },
      addview: false,
      selectedChild: 1,
      menuList: [
        {
          icon: "bi bi-list-task menuIcon",
          id: 0,
          title: "Tasks",
          children: [
            {
              id: 1,
              title: "To Do",
            },
            {
              id: 2,
              title: "Create By Me",
            },
          ],
        },
      ],
    };
  

  
    // eslint-disable-next-line no-dupe-class-members
    handleChange(event:any) {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
    // handleChange = this.handleChange.bind(this);
    componentDidMount() {
      this.getDataFromServer(this.state.json);
      this.getCategories();
    }
  
    getCategories() {
      var json = {
        limit: -1,
        skip: 0,
        sort: "time",
        sortOrder: "desc",
        selection: "",
        ParentId: "",
        getType: "Assigned",
      };
  
      postdata( "getcategories", json).then(
        (d) => {
          this.setState({ CategoryList: d.rows });
        },
        (e) => {}
      );
    }
  
    getDataFromServer(params:any) {
      postdata("gettasks", params).then(
        (d) => {
          if (d) {
            this.setState({
              data: d,
            });
          }
        },
        (e) => {}
      );
    }
  
    getUserList(callback:any) {
      this.setState({ emailUsers: UsersList });
    }
  
    refreshTable(params:any) {
      console.log(params);
      params.ParentId = "";
      params.getType = this.state.getType;
      this.getDataFromServer(params);
    }
  
    timer:any;
    handleSearch(event:any) {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
      this.setState({
        [event.target.name]: event.target.value,
      });
      this.timer = setTimeout(() => {
        var json = this.state.json;
        json["search"] = event.target.value;
        this.refreshTable(this.state.json);
      }, 1000);
    }
  
    sidebarItemsClicked(event:any) {
      var id = event.target.dataset.rrUiEventKey;
      var json = this.state.json;
      json.getType = id == "0" ? "Assigned" : "Created";
      this.setState({ selectedChild: id, getType: json.getType });
      this.getDataFromServer(json);
    }
  
    AddTask() {
      this.setState({ addview: true });
      this.initFields();
    }
  
    cancelAdd() {
      this.setState({ addview: false });
      this.initFields();
    }
  
    getUserFName(email:any) {
      email = email.toLowerCase();
      for (var i = 0; i < UsersList.length; i++) {
        if (UsersList[i].email.toLowerCase() === email) {
          return UsersList[i].fName;
        }
      }
    }
  
    initFields() {
      var date = new Date();
      date.setDate(date.getDate() + 3);
      var yyyy = date.getFullYear();
      var mm = (date.getMonth() + 1).toString().padStart(2, "0");
      var dd = date.getDate().toString().padStart(2, "0");
      this.setState({
        Assignee: "",
        Category: "Proposal",
        TaskNotes: "",
        CompletionDate: yyyy + "-" + mm + "-" + dd,
        CompletionTime: "18:00",
        Priority: "Medium",
        TaskHeader: "",
        ValueInDolor: "",
      });
    }
  
    saveTicket() {
      var json = {
        ParentId: null,
        conversationId: "Not Available",
        AssigneeEmailAddress: this.state.Assignee,
        Body: this.state.TaskNotes,
        Category: this.state.Category,
        CompletionDate: this.state.CompletionDate,
        CompletionTime: this.state.CompletionTime,
        FromEmailAddress: "",
        FromName: "",
        Priority: this.state.Priority,
        Status: "Open",
        Subject: this.state.TaskHeader,
        TaskHeader: this.state.TaskHeader,
        TaskNotes: this.state.TaskNotes,
        ValueInDolor: this.state.ValueInDolor,
        AssigneeName: this.getUserFName(this.state.Assignee),
      };
      postdata("createsubtask", json).then((d) => {
        if (d && d.success) {
          this.cancelAdd();
        }
      });
    }
  
    handleFilter = (items:any) => {
      return (searchValue:any) => {
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
      console.log(this.state.Body);
  
      var usersList = UsersList.map((d) => {
        return {
          name: d.email.toLowerCase(),
          value: d.email.toLowerCase(),
        };
      });
      // var tabContent = (
      //   <div className="main-content">
      //     <div className="card task_view h-100">
      //       <div className="card task_view h-100">
      //         <div
      //           id="actionbtns"
      //           className={`p-2 align-items-center justify-content-between d-flex ${
      //             this.state.addview ? "hide" : "d-flex"
      //           }`}
      //         >
      //           <div className="d-flex icon-set-box-left">
      //             <div className="icon-set-box-left float-right">
      //               <button
      //                 className="btn btn-primary btn-sm"
      //                 onClick={() => this.AddTask()}
      //                 title="Add Task"
      //               >
      //                 <i className="bi bi-plus fs-3"></i> Add Task
      //               </button>
      //             </div>
      //           </div>
      //           <div className="d-flex align-item-center justify-content-center">
      //             <input
      //               placeholder="search"
      //               type="text"
      //               className="form-control"
      //               name="searchVal"
      //               onChange={(e) => {
      //                 this.handleSearch(e);
      //               }}
      //               value={this.state.searchVal}
      //             ></input>
      //           </div>
      //         </div>
      //         <div
      //           id="tableView"
      //           className={`table_content table-responsive  ${
      //             this.state.addview ? "hide" : "d-flex"
      //           }`}
      //         >
      //           <Table
      //             className="table table-striped"
      //             setSelection={(id:any) => {
      //               this.setState({ editId: id });
      //             }}
      //             refresh={(params:any) => {
      //               this.refreshTable(params);
      //             }}
      //             columns={this.state.columns}
      //             data={this.state.data}
      //           />
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // );
      return (
            <>
 <div className='row gy-5 gx-xl-8'>
 <div className="card task_view h-100">
        <div className="card task_view h-100">
          <div
            id="actionbtns"
            className={`p-2 align-items-center justify-content-between d-flex ${
              this.state.addview ? "hide" : "d-flex"
            }`}
          >
            <div className="d-flex icon-set-box-left">
              <div className="icon-set-box-left float-right">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>this.AddTask()}
                  title="Add Task"
                >
                  <i className='fa fa-plus fs-4'></i> Add Task
                </button>
              </div>
            </div>
            <div className="d-flex align-item-center justify-content-center">
              <input
                placeholder="search"
                type="text"
                className="form-control"
                name="searchVal"
                onChange={(e) => {
                  this.handleSearch(e);
                }}
                value={this.state.searchVal}
              ></input>
            </div>
          </div>
          <div
            id="tableView"
            className={`content  ${
              this.state.addview ? "hide" : "d-flex"
            }`}
          >
            {/* <Table
              className="table table-striped"
              setSelection={(id) => {
                this.setState({ editId: id });
              }}
              refresh={(params) => {
                this.refreshTable(params);
              }}
              columns={this.state.columns}
              data={this.state.data}
            /> */}
          </div>
        </div>
      </div>
 </div>
  {/* begin::Row */}
  <div className='row gy-5 gx-xl-8'>
    <div className='col-xxl-4'>
      <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
    </div>
    <div className='col-xl-8'>
      <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' />
    </div>
  </div>
  {/* end::Row */}

  {/* begin::Row */}
  <div className='row gy-5 g-xl-8'>
    <div className='col-xl-4'>
      <ListsWidget2 className='card-xl-stretch mb-xl-8' />
    </div>
    <div className='col-xl-4'>
      <ListsWidget6 className='card-xl-stretch mb-xl-8' />
    </div>
    <div className='col-xl-4'>
      <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
      {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5' */}
    </div>
  </div>
  {/* end::Row */}
</>
      //   <div className="nav-line-tabs">
      //     <Tabs
      //       onClick={(event) => this.sidebarItemsClicked(event)}
      //       defaultActiveKey="0"
      //       id="justify-tab-example"
      //       justify
      //     >
      //       <Tab eventKey="0" title="To Do">
      //         {tabContent}
      //       </Tab>
      //       <Tab eventKey="1" title="Create By Me">
      //         {tabContent}
      //       </Tab>
      //     </Tabs>
      //     <Modal
      //       show={this.state.addview}
      //       onHide={() => {
      //         this.cancelAdd();
      //       }}
      //       backdrop="static"
      //       keyboard={false}
      //       size="lg"
      //     >
      //       <Modal.Header closeButton>
      //         <Modal.Title>Create a new task</Modal.Title>
      //       </Modal.Header>
      //       <Modal.Body>
      //         <div
      //           className={`row h-100 overflow-auto ${
      //             this.state.addview ? "show" : "hide"
      //           } `}
      //         >
      //           <div className="input_blk h-100">
      //             <div className="row">
      //               <div className="col-md-6">
      //                 <div className="form-group">
      //                   <label> Task TItle:</label>
      //                   <input
      //                     type="text"
      //                     value={this.state.TaskHeader}
      //                     onChange={this.handleChange}
      //                     name="TaskHeader"
      //                     id="task_header"
      //                     className="form-control"
      //                   />
      //                 </div>
      //               </div>
      //               <div className="col-md-6">
      //                 <div className="form-group">
      //                   <label>Category :</label>
      //                   <select
      //                     value={this.state.Category}
      //                     onChange={this.handleChange}
      //                     name="Category"
      //                     id="category"
      //                     className="form-control"
      //                   >
      //                     <option value="Lead Generation">Lead Generation</option>
      //                     <option value="Proposal" selected>
      //                       Proposal
      //                     </option>
      //                     <option value="Action">Action</option>
      //                     <option value="Client Delivery">Client Delivery</option>
      //                     <option value="Complaint">Complaint</option>
      //                     <option value="Others">Others</option>
      //                   </select>
      //                 </div>
      //               </div>
      //               <div className="col-md-6">
      //                 <div className="form-group">
      //                   <label> Value ($):</label>
      //                   <input
      //                     type="text"
      //                     value={this.state.ValueInDolor}
      //                     onChange={this.handleChange}
      //                     name="ValueInDolor"
      //                     id="valueinDolor"
      //                     className="form-control"
      //                   />
      //                 </div>
      //               </div>
      //               <div className="col-md-6">
      //                 <div className="form-group">
      //                   <label>Priority:</label>
      //                   <select
      //                     value={this.state.Priority}
      //                     onChange={this.handleChange}
      //                     name="Priority"
      //                     id="Priority"
      //                     className="form-control"
      //                   >
      //                     <option value="High">High</option>
      //                     <option value="Medium" selected>
      //                       Medium
      //                     </option>
      //                     <option value="Low">Low</option>
      //                   </select>
      //                 </div>
      //               </div>
      //               <div className="col-md-6">
      //                 <div className="form-group">
      //                   <label>Completion Date:</label>
      //                   <input
      //                     value={this.state.CompletionDate}
      //                     onChange={this.handleChange}
      //                     name="CompletionDate"
      //                     type="date"
      //                     id="completion_date"
      //                     className="form-control"
      //                   />
      //                 </div>
      //               </div>
      //               <div className="col-md-6">
      //                 <div className="form-group">
      //                   <label>Completion Time:</label>
      //                   <input
      //                     value={this.state.CompletionTime}
      //                     onChange={this.handleChange}
      //                     name="CompletionTime"
      //                     type="time"
      //                     className="form-control"
      //                   />
      //                 </div>
      //               </div>
      //               <div className="col-md-6">
      //                 <div className="form-group">
      //                   <label>Assign To:</label>
      //                   <SelectSearch
      //                     options={usersList}
      //                     filterOptions={this.handleFilter}
      //                     value={this.state.Assignee}
      //                     name="Assignee"
      //                     placeholder="Choose a Assignee"
      //                     search
      //                     onChange={(item) => {
      //                       this.setState({ Assignee: item });
      //                     }}
      //                   />
      //                 </div>
      //               </div>
      //               <div className="col-md-6">
      //                 <div className="form-group">
      //                   <label> Comments:</label>
      //                   <textarea
      //                     value={this.state.TaskNotes}
      //                     onChange={this.handleChange}
      //                     name="TaskNotes"
      //                     row="3"
      //                     type="text"
      //                     id="task_notes"
      //                     className="form-control"
      //                   ></textarea>
      //                 </div>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </Modal.Body>
      //       <Modal.Footer>
      //         <button
      //           className="btn btn-danger btn-sm"
      //           onClick={() => this.cancelAdd()}
      //         >
      //          <i class="fa-solid fa-xmark mr-2"></i>Cancel
      //         </button>
      //         <button
      //           className="btn btn-success btn-sm"
      //           onClick={() => this.saveTicket()}
      //         >
      //            <i class="fa-regular fa-bookmark mr-2"></i>Save
      //         </button>
      //       </Modal.Footer>
      //     </Modal>
      //   </div>
      );
    }
}


// const TaskPage = () => (
//   <>
//    <div className='row gy-5 gx-xl-8'>
//    <div className="card task_view h-100">
//           <div className="card task_view h-100">
//             <div
//               id="actionbtns"
//               className={`p-2 align-items-center justify-content-between d-flex ${
//                 addview ? "hide" : "d-flex"
//               }`}
//             >
//               <div className="d-flex icon-set-box-left">
//                 <div className="icon-set-box-left float-right">
//                   <button
//                     className="btn btn-primary btn-sm"
//                     onClick={() =>AddTask()}
//                     title="Add Task"
//                   >
//                     <i className="bi bi-plus"></i> Add Task
//                   </button>
//                 </div>
//               </div>
//               <div className="d-flex align-item-center justify-content-center">
//                 <input
//                   placeholder="search"
//                   type="text"
//                   className="form-control"
//                   name="searchVal"
//                   onChange={(e) => {
//                     this.handleSearch(e);
//                   }}
//                   value={this.state.searchVal}
//                 ></input>
//               </div>
//             </div>
//             <div
//               id="tableView"
//               className={`content table-responsive  ${
//                 this.state.addview ? "hide" : "d-flex"
//               }`}
//             >
//               <Table
//                 className="table table-striped"
//                 setSelection={(id) => {
//                   this.setState({ editId: id });
//                 }}
//                 refresh={(params) => {
//                   this.refreshTable(params);
//                 }}
//                 columns={this.state.columns}
//                 data={this.state.data}
//               />
//             </div>
//           </div>
//         </div>
//    </div>
//     {/* begin::Row */}
//     <div className='row gy-5 gx-xl-8'>
//       <div className='col-xxl-4'>
//         <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
//       </div>
//       <div className='col-xl-8'>
//         <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' />
//       </div>
//     </div>
//     {/* end::Row */}

//     {/* begin::Row */}
//     <div className='row gy-5 g-xl-8'>
//       <div className='col-xl-4'>
//         <ListsWidget2 className='card-xl-stretch mb-xl-8' />
//       </div>
//       <div className='col-xl-4'>
//         <ListsWidget6 className='card-xl-stretch mb-xl-8' />
//       </div>
//       <div className='col-xl-4'>
//         <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
//         {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5' */}
//       </div>
//     </div>
//     {/* end::Row */}
//   </>
// )

// const TasksWrapper = () => {
//   const intl = useIntl()
//   return (
//     <>
//       <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
//       <TaskPage />
//     </>
//   )
// }

// export {TasksWrapper}
