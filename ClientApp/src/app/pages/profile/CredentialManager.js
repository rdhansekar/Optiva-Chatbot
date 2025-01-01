import React from "react";
import "./profile.css";
import { getAccountsettings, notification, setAccProfileDetails } from "../../../service/utility";
import { postdata } from "../../../service/httputlity";

export default class CredentialManager extends React.Component {
  state = {
    newpswd:"",
    currentpswd:"",
    cnfrmpswd:"", 
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


  render() {
    return (
            <div class="card container_height">
               <div class="card-body p-4">
                  <div class="card-title border-bottom mb-4">
                    <h5 className="title">Change Password</h5>
                  </div>
                  <div className="row w-50">
                  <div className="form-group">
                  <label class="form-label required">Current Password</label>
                    <input
                      type="password"
                      className="form-control form-control-solid form-control-lg"
                      name="currentpswd"
                      onChange={this.handleChange}
                      value={this.state.currentpswd}
                      placeholder="Current Password"
                    />
                  </div>
                  <div className="form-group">
                  <label class="form-label required">New Password</label>
                    <input
                      type="password"
                      className="form-control form-control-solid form-control-lg"
                      name="newpswd"
                      onChange={this.handleChange}
                      value={this.state.newpswd}
                      placeholder="New Password"
                    />
                  </div>
                  <div className="form-group">
                  <label class="form-label required">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control form-control-solid form-control-lg"
                      name="cnfrmpswd"
                      onChange={this.handleChange}
                      value={this.state.cnfrmpswd}
                      placeholder="Confirm Password"
                    />
                  </div>
                  <div className={this.state.cnfrmpswd && this.state.newpswd && (this.state.cnfrmpswd !== this.state.newpswd) ? "form-group invalid-feedback show" : "hide"}>
                    <p >Passwords do not match</p>
                  </div>
                  <div id="actionbtns" className={`float-right col-12 `}>
                    <div class="float-right">
                      <button
                        className={`btn btn-success btn-popup m-2 ${
                            this.state.currentpswd && this.state.newpswd && this.state.cnfrmpswd && (this.state.newpswd === this.state.cnfrmpswd)
                            ? ""
                            : "disabled"
                        }`}
                        onClick={() => this.saveNewPassword()}
                      >
                        Update Password
                      </button>
                    
                    </div>
                  </div>
                  </div>
              </div>
            </div>
    );
  }
}
