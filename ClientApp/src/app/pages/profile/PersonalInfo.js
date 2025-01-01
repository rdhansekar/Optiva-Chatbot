import React from "react";
import "./profile.css";
import { getAccountsettings, notification, setAccProfileDetails } from "../../../service/utility";
import { postdata } from "../../../service/httputlity";

export default class PersonalInfo extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    emailExist: false,
    registrationsuccess: false,
    selectedChild: 1,
    newpswd:"",
    currentpswd:"",
    cnfrmpswd:"", 
    profilePic:
      "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
    // menuList: [
    //   {
    //     icon: "bi bi-person-lines-fill menuIcon",
    //     id: 0,
    //     title: "Profile",
    //     children: [
    //       {
    //         id: 1,
    //         title: "Personal Info",
    //       },
    //       {
    //         id: 2,
    //         title: "Credential Manager",
    //       },
    //     ],
    //   },
    // ],
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

  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      this.setState({ profilePic: text });
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  importClicked() {
    document.getElementById("input-file").click();
  }

  componentDidMount(){
    this.init();
  }

  init(){
    var settings = getAccountsettings();
    if(!settings){
      setTimeout(()=>{this.init()},1000);
    }
    else{
      this.setState({
        firstName:settings.fName ? settings.fName : "",
        lastName:settings.lName ? settings.lName : "",
        profilePic:settings.image ? settings.image : "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
      })
    }
  }
  
  saveNewPassword(){
    if(this.state.currentpswd && this.state.newpswd && this.state.cnfrmpswd && (this.state.newpswd === this.state.cnfrmpswd)){
        var json = {
            currentpswd:this.state.currentpswd,
            newpswd:this.state.currentpswd,
        }
        postdata("changepassword",json).then((d)=>{
          if(d.success){
            notification.showSuccessMessage("Updated password successfully");
          }
          else{
            notification.showErrorMessage(d.message);
          }
        });
    }
    else{
        notification.showErrorMessage("Passwords cannot be empty")
    }
  }

  saveUser(){
   var json = {
            firstName: this.state.firstName.trim(),
            lastName: this.state.lastName.trim(),
            image:this.state.profilePic
    };
    postdata("editprofile",json).then((d)=>{
      if(d.success){
        var settings = getAccountsettings();
        if(this.state.firstName){
          settings.fName = this.state.firstName
        }
        if(this.state.lastName){
          settings.lName = this.state.lastName
        }
        if(this.state.profilePic){
          settings.image = this.state.profilePic
        }
        setAccProfileDetails(settings);
        notification.showSuccessMessage("Updated details successfully");
      }
    });
  }

  render() {

    // var menuList = this.state.menuList.map((item) => {
    //   if (item.children) {
    //     var menuChild = item.children.map((child) => {
    //       return (
    //         <li>
    //           <a
    //             className={`child ${
    //               this.state.selectedChild === child.id ? "selected" : ""
    //             }`}
    //             onClick={() => {
    //               this.setState({ selectedChild: child.id });
    //             }}
    //           >
    //             <span>{child.title}</span>
    //             <i class="bi bi-caret-right-fill menuIcon"></i>
    //           </a>
    //         </li>
    //       );
    //     });
    //   }
    //   return (
    //     <li>
    //       <a
    //         className={`parent arrow-down ${
    //           this.state.selectedChild === item.id ? "selected" : ""
    //         }`}
    //         onClick={() => {
    //           this.sidebarItemsClicked(item.id);
    //         }}
    //       >
    //         <i class={item.icon}></i> <span>{item.title}</span>
    //       </a>
    //       <ul className={`sub-menu ${menuChild ? "" : "d-none"}`}>
    //         {menuChild}
    //       </ul>
    //     </li>
    //   );
    // });
    return (
      <>
          <div className='commingSoon'>
              <img src="/media/flags/commingSoon.jpg"  alt="comming soon" width="50%"/>
            </div>
            {/* <div className='card mb-5 mb-xxl-8'>
            <div className='card-header border-0 pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bold fs-3 mb-1'>Personal Info</span>

                <span className='text-muted fw-semibold fs-7'>Add or Edit your Profile Info</span>
              </h3>
               <div className='card-toolbar'>
                <button
                  type='button'
                  className='btn btn-sm btn-color-primary btn-active-light-primary'
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-end'
                  data-kt-menu-flip='top-end'
                >
                 You can edit Profile
                </button>
              </div> 
            </div>
            <div className='card-body'>
                  <div class="row w-50">
                   
                 
                  <div className="form-group">
                  <label class="form-label fs-6 fw-semibold required">First Name</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="firstName"
                      onChange={this.handleChange}
                      value={this.state.firstName}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="form-group">
                  <label class="form-label fs-6 fw-semibold required">Last Name</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="lastName"
                      onChange={this.handleChange}
                      value={this.state.lastName}
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="form-group">
                  <label class="form-label fs-6 fw-semibold">Profile Pic</label>
                    <input
                      className="form-control form-control-solid"
                      id="profile-pic"
                      type="file"
                      name="profilePic"
                      onChange={this.onChangeFile.bind(this)}
                    />
                  </div>
                  <div id="actionbtns" className={`float-right col-12 `}>
                    <div class="float-right">
                      <button
                        className={`btn btn-success btn-popup m-2 ${
                          this.state.firstName.trim().length > 0 &&
                          this.state.lastName.trim().length > 0
                            ? ""
                            : "disabled"
                        }`}
                        onClick={() => this.saveUser()}
                      >
                        <i class="fa-regular fa-bookmark mr-2"></i>Update Profile
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
            </div> */}
      </>
             
    );
  }
}
