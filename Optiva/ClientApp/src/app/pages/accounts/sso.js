import React from "react";
import { getData, postdata } from "../../../service/httputlity";
import { notification } from "../../../service/utility";

export default class SSO extends React.Component{

    state = {
        tenantId:'',
        clientSecret:'',
        authToken:''
    };
    componentDidMount(){
        getData("sso").then((d)=>{
            if(d ){
                this.setState(d);
            }
        });
    }

    handleChange = this.handleChange.bind(this);
    
    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
          })
    }

    save(){
        if(this.state.tenantId && this.state.clientSecret && this.state.authToken){
            postdata("sso",this.state).then((d)=>{
                if(d && d.success){
                    notification.showInfoMessage("Saved settings successfully");
                }
            });
        }
    }

    render(){
        return <>
         <div class="card mb-5 mb-xxl-8">
         <div class="row justify-content-between">
          <div class="col-lg-6 col-sm-12">
          <div className='card-header border-0 pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bold fs-4 mb-1'>Active Directory Settings</span>
              </h3>
          </div>
          <div class="card-body"> 
         
                    <div class="row" >
                            <div className="form-group">
                            <label class="form-label fs-6 fw-semibold">Client Auth Token</label>
                                <input type="text" className="form-control form-control-solid" name="authToken" onChange={this.handleChange}  value={this.state.authToken}  placeholder="Client Auth Token" />
                            </div>
                            <div className="form-group">
                            <label class="form-label fs-6 fw-semibold">Client secret</label>
                                <input type="text" className="form-control form-control-solid" name="clientSecret" onChange={this.handleChange}  value={this.state.clientSecret} placeholder="CLIENT SECRET" />
                            </div>
                            <div className="form-group">
                            <label class="form-label fs-6 fw-semibold">Tenant ID</label>
                                <input type="text" className="form-control form-control-solid" name="tenantId" onChange={this.handleChange}  value={this.state.tenantId} placeholder="TENANT ID" />
                            </div>
                            <div id="actionbtns">
                                <div class="float-right">
                                    <button  className={`btn btn-success btn-popup m-2 ${(this.state.authToken.trim().length > 0 && this.state.clientSecret.trim().length > 0&& this.state.tenantId.trim().length > 0) ? "" : "disabled"}`}  onClick={() => this.save()}  >
                                    <i class="fa-regular fa-bookmark mr-2"></i>Save
                                    </button> 
                                </div>
                            </div>
                    </div>          
                    
                </div>
                </div>
                <div class="col-lg-3 col-sm-12">
                    <div class="card-body info_box">  
                    <div class="card-title mb-4">
                        <h6 className='title'><i class="bi bi-magic"></i>&nbsp;  How to set Active Directory?</h6>              
                    </div>         
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
          </div>
          </div>
          </>
          
    }
}