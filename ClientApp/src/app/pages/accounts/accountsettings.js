import React from "react";
import "./accountsettings.scss";
import { Link } from "react-router-dom";
import Branding from "./branding";

import SSO from "./sso";
import Categories from "./categories";
import Depatment from "./department";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Department from "./department";
import Region from "./region";

//import AccessControl from "./accesscontrol";
//import SubUsers from "../userManagement/subUsers";

export default class AccountSettings extends React.Component {
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
        icon: "bi bi-gear-fill menuIcon",
        id: 0,
        title: "Account Settings",
        children: [
          {
            id: 1,
            title: "Branding",
          },
          // {
          //   id: 2,
          //   title: "Active Directory",
          // },
          {
            id: 2,
            title: "Categories",
          },
          {
            id: 3,
            title: "Departments",
          },
          {
            id: 4,
            title: "Region",
          },
          {
            id: 5,
            title: "Subscription",
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
        case 1:default:
            display = <Branding/>;break;
        case 4: display = <SSO />;break;
        case 2: display=<Categories />;break;
        case 3: display=<Depatment />;break;
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
        <div className="nav-line-tabs">
          <Tabs defaultActiveKey="branding" id="justify-tab-example" justify>
            <Tab eventKey="branding" title="Branding">
            <Branding/>
            </Tab>
            {/* <Tab eventKey="activeDirectory" title="Active Directory">
            <SSO />
            </Tab> */}
            <Tab eventKey="categories" title="Categories">
            <Categories />
            </Tab>
            <Tab eventKey="departments" title="Departments">
            <Department />
            </Tab>
            <Tab eventKey="departments" title="Departments">
            <Region />
            </Tab>
            <Tab eventKey="region" title="Region">
            <Region />
            </Tab>
          </Tabs>
        </div>
        {/* <div class="conatiner-xl h-100">
        <div class="sidebar-menu">
          <ul class="list-unstyled">{menuList}</ul>
        </div>
        <div class="isSidebar">
         { display }
        </div>
      </div> */}
        </>
     
    );
  }
}
