import React from "react";
import { Link } from "react-router-dom";
import {
  postdata,
  getData,
  putdata,
  deleteData,
} from "../../../service/httputlity";
import {
  downloadURI,
  formatDateTime,
  notification,
  options,
} from "../../../service/utility";
import Table from "../../../shared/table";
import Modal from "react-bootstrap/Modal";
import { KTSVG } from "../../../_metronic/helpers";
import "./accountsettings.scss";

export default class Categories extends React.Component {
  state = {
    newUser: "",
    role: "user",
    UsersList: [],
    fileUpdaloaded: false,
    data: { data: [], totalRows: 0 },
    showaddview: false,
    columns: [
      {
        field: "category_name",
        headerName: "Category Name",
        flex: 0.5,
      },
      { field: "category_desc", headerName: "Desc", flex: 0.5 },
      {
        headerName: "Action",
        field: "id",
        flex: 0.6,
        renderCell: (params) => (
          <div className="icon-center">
            <button
              className="btn btn-sm btn-color-primary btn-active-light-primary"
              onClick={() => this.editClicked(params.row)}
            >
              <i class="bi bi-pencil pr-1"></i> Edit
            </button>
            <button
              className="btn btn-sm btn-color-danger btn-active-light-danger"
              onClick={() => this.deleteClicked(params.row)}
            >
              <i class="bi bi-trash3 pr-1"></i> Delete
            </button>
          </div>
        ),
      },
    ],
    Body: "",
    Status: "Assigned",
    emailUsers: [],
    _id: "",
    getType: "Assigned",

    addview: false,
    selectedChild: 1,
    menuList: [
      {
        icon: "bi bi-list-task text-info menuIcon",
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

  gridjson = {
    limit: 20,
    skip: 0,
    sort: "time",
    sortOrder: "desc",
    selection: "",
    ParentId: "",
    getType: "Assigned",
  };

  handleChange = this.handleChange.bind(this);

  // eslint-disable-next-line no-dupe-class-members
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  componentDidMount() {
    this.getDataFromServer();
    setTimeout(() => {}, 2000);
  }

  getDataFromServer() {
    postdata("getcategories", this.gridjson).then(
      (d) => {
        this.setState({ data: { data: d.data, totalRows: d.totalRows } });
      },
      (e) => {}
    );
  }

  refreshTable(params) {
    if (params) {
      this.gridjson.limit = params.limit
      this.gridjson.skip = params.skip
      this.gridjson.sort = params.sort
      this.gridjson.sortOrder = params.sortOrder
    }
    this.getDataFromServer();
  }

  timer = null;
  handleSearch(event) {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.timer = setTimeout(() => {
      var search = event.target.value.toLowerCase();
      this.gridjson.search = search;
      this.getDataFromServer();
    }, 1000);
  }

  handleFilter = (items) => {
    return (searchValue) => {
      if (searchValue.length === 0) {
        return this.state.UsersList.map((d) => {
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

  editClicked(row) {
    this.setState({
      CategoryName: row.category_name,
      CategoryDesc: row.category_desc,
      id: row.id,
      editId: row.id,
      showaddview: true,
    });
  }

  deleteClicked(row) {
    notification.showConfirmDialogue(
      "Delete Category",
      "Are sure you want to delete this category ? ",
      () => {
        deleteData("deletecategory?id=" + row.id).then(
          (d) => {
            this.refreshTable();
            notification.showSuccessMessage('Deleted category successfully');
          },
          (e) => {}
        );
      },
      () => {}
    );
  }

  saveCategory() {
    try {
      if (this.state.CategoryName && this.state.CategoryDesc) {
        var json = {
          CategoryName: this.state.CategoryName,
          CategoryDesc: this.state.CategoryDesc,
        };
        if (this.state.editId) {
          json["id"] = this.state.editId;
          putdata("editcategory", json).then((d) => {
            notification.showSuccessMessage("Updated category successfully");
            this.refreshTable();
            this.setState({
              CategoryName: "",
              CategoryDesc: "",
              editId: "",
              showaddview: false,
            });
          });
        } else if (this.state.CategoryName && this.state.CategoryDesc) {
         
          postdata("addcategory", json).then((d) => {
            notification.showSuccessMessage("Added category successfully");
            this.refreshTable();
            this.setState({
              CategoryName: "",
              CategoryDesc: "",
              editId: "",
              showaddview: false,
            });
          });
        }
      } else {
        notification.showErrorMessage("Please provide category name and description");
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <>
          <div class="card mb-5 mb-xxl-8 accSettings_body">
          {/* <div className='card-header border-0 pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bold fs-4 mb-1'>Add your Categories</span>
              </h3>
          </div> */}
          <div class="card-header px-5 border-0">
          <div className='d-flex align-items-center position-relative my-1'>
            <KTSVG
              path='/media/icons/duotune/general/gen021.svg'
              className='svg-icon-1 position-absolute ms-6'
            />
             <input placeholder="search" type="text" className="form-control form-control-solid w-250px ps-14" name="searchVal"
              onChange={(e) => { this.handleSearch(e);}}value={this.state.searchVal}></input>
               <button class='btn btn-outline form-control form-control-solid btn-icon ms-2'
                onClick={() => { this.refreshTable(this.gridjson)}}><i class="fa-solid fa-arrow-rotate-right"></i>
            </button>    
          </div>
          <div class="card-toolbar">
          <input type="file" id="importfile" onChange={(e) => {this.handleFileUpload(e); }} class="hide"></input>
          <button  placeholder="" class="btn btn-primary btn-sm m-1"
              name="add" onClick={(e) => {this.setState({ showaddview: true, editId: "",newUser: "",id: "",});}} >
              <i class="fa fa-plus fs-4"></i>&nbsp; Add Category
          </button>
          </div>

          </div>
            <div class="card-body px-5 py-3">
           
              <div
                id="tableView"
                className={`table_content  ${
                  this.state.addview ? "hide" : "show"
                }`}
              >
                <Table
                  className="table table-striped"
                  setSelection={(id) => {
                    this.setState({ editId: id });
                  }}
                  refresh={(params) => {
                    this.refreshTable(params);
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
          onHide={() => this.setState({ showaddview: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
          <Modal.Title>{this.state.editId ?  "Edit Category Details" : "Add New Category"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className={`row h-100 overflow-auto`}>
              <div class="input_blk h-100">
                <div class="form-group">
                  <label class="form-label fs-6 fw-semibold">Name</label>
                  <input
                    value={this.state.CategoryName}
                    onChange={this.handleChange}
                    name="CategoryName"
                    type="text"
                    class="form-control form-control-solid"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label fs-6 fw-semibold">Description</label>
                  <input
                    value={this.state.CategoryDesc}
                    onChange={this.handleChange}
                    name="CategoryDesc"
                    type="text"
                    class="form-control form-control-solid"
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
          <button type="button"  onClick={() => this.setState({ showaddview: false, CategoryName: "", CategoryDesc: "", editId: "", })}
             class="btn btn-danger btn-sm m-2"><i class="fa-solid fa-xmark mr-2"></i>Cancel</button>
          <button type="button" onClick={() => this.saveCategory()} class="btn btn-success btn-sm">
          <i class="fa-regular fa-bookmark mr-2"></i><span>{this.state.editId ? "Update" : "Save"}</span>
          </button>
          </Modal.Footer>
        </Modal>
      </>
     
    );
  }
}
