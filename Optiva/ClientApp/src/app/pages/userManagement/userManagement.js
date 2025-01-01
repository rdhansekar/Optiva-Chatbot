import React from "react";
import "./userManagement.css";
 import SubUsers from "./subUsers";
 import AccessControl from "./accesscontrol";
 import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default class UserManagement extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    emailExist: false,
    registrationsuccess: false,
    image:
      "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
    selectedChild: 1,
    menuList: [
      {
        icon: "bi bi-person-rolodex menuIcon",
        id: 0,
        title: "User Management",
        children: [
          {
            id: 1,
            title: "Users",
          },
          {
            id: 2,
            title: "Access Control",
          },
        ],
      },
    ],
  };

  handleChange = this.handleChange.bind(this);

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  triggerProfieChange() {
    document.getElementById("profile-pic").click();
  }
  cancelUserEdit() {
    window.location.href = "/home/dashboard";
  }


  sidebarItemsClicked(id) {
    this.setState({ selectedChild: id });
  }

  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      this.setState({ image: text });
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  importClicked() {
    document.getElementById("input-file").click();
  }
  
  render() {
    let display;
    switch(this.state.selectedChild){
        case 1:default:display=<SubUsers />;break;
        case 2:display=<AccessControl/>;break;
    }

    var menuList = this.state.menuList.map((item) => {
      if (item.children) {
        var menuChild = item.children.map((child) => {
          return (
            <li>
              <a 
                className={`child ${
                  this.state.selectedChild === child.id ? "selected" : ""
                }`}
                onClick={() => {
                  this.sidebarItemsClicked(child.id);
                }}
              >
                <span>{child.title}</span>
                <i class="bi bi-caret-right-fill menuIcon"></i>
              </a>
            </li>
          );
        });
      }
      return (
        <li>
          <a
            className={`parent arrow-down ${
              this.state.selectedChild === item.id ? "selected" : ""
            }`}
            onClick={() => {
              this.sidebarItemsClicked(item.id);
            }}
          >
            <i class={item.icon}></i> <span>{item.title}</span>
          </a>
          <ul className={`sub-menu ${menuChild ? "" : "d-none"}`}>
            {menuChild}
          </ul>
        </li>
      );
    });
    return (
      <>
      <div className="nav nav-stretch nav-line-tabs_custom nav-line-tabs-2x border-transparent fs-5 fw-bolder h-100">
        <Tabs defaultActiveKey="0" id="justify-tab-example" justify>
          <Tab eventKey="0" title="Users">
          <SubUsers />
          </Tab>
          <Tab eventKey="1" title="Access Control">
          <AccessControl/>
          </Tab>
        </Tabs>
      </div>
      </>
    );
  }
}
