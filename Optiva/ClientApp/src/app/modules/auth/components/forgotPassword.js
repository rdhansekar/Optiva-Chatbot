import React from "react";
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { getData, postdata } from "../../../../service/httputlity";

export default class ForgotPswd extends React.Component {
   
    constructor(props){
        super(props);
        this.state = {
            username: '',
            success:false,
            submitted:false,
            invalidEmail:false,
            resetform:0,
            password:'',
            confirmPassword:'',
            message:''
        };
        this.initPage();
        this.handleChange = this.handleChange.bind(this);
    }

    initPage(){
        if(window.location.href.search('id=') !== -1){
            var id =window.location.href.split('?id=')[1];
            if(id){
                getData('verifyresetid?id='+id).then((d)=>{
                    if(d.success){
                        this.setState({resetform:1, allowpaswordreset:true})
                    }
                    else{
                        this.setState({resetform:2,message:'Password link is invalid. Please request again or login if reset already.'})
                    }
                },(e)=>{
                    this.setState({resetform:2,message:'Password link is invalid. Please request again or login if reset already.'})
                })
            }
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
          })
    }

    ResetPswd(){
        this.setState({
            submitted : true
        });
        if(this.state.allowpaswordreset){
            var json = {password:this.state.password,id:window.location.href.split('?id=')[1]};
            postdata("updatepassword",json).then((d)=>{
                if(d && d.success){
                    this.setState({submitted : false,resetform:2,message:'Password reset successfully. Please click here to login.'})
                }
                else {
                    this.setState({resetform:2,message:'Password link is invalid. Please request again or login if reset already.'})
                }
            },
            (e)=>{
                this.setState({
                    submitted : false
                });
                console.log(e);
            });
        }
        else{
            var json1 = {username:this.state.username};
            postdata("resetpswdreq",json1).then((d)=>{
                if(d && d.success){
                    this.setState({
                        success : true,
                        submitted : false,
                        message:'Password reset mail sent successfully.'
                    });
                }
                else {
                    this.setState({
                        invalidEmail : true,
                        submitted : false,
                        message:'Failed to reset Password!.'
                    });
                }
                console.log(d);
            },
            (e)=>{
                this.setState({
                    submitted : false
                });
                console.log(e);
            });
        }
    }

    render(){
        return (
                <div className="row w-100 mx-0 align-items-center h-100">
                    <div className="col-lg-12 col-sm-12 mx-auto">
                    <div className="card text-left py-5 px-4 px-sm-5 text-dark">
                            <h4 className={`card-title ${(this.state.resetform !== 2 ? 'show':'hide' )}`} class="">Forgot Your Password?</h4>
                            <h6 className={`mt-3 ${(this.state.success === true ? 'text-success':'text-danger' )}`} >{this.state.message} </h6>
                            <div class="pt-3">
                                <Form.Group className={`d-flex search-field ${(this.state.resetform === 0 ? 'show':'hide' )}`}>
                                    <Form.Control type="email" placeholder="Enter Username" size="lg" className="h-auto" name="username"  onChange={this.handleChange}  value={this.state.username}  />
                                </Form.Group>

                                <Form.Group className={`d-flex search-field ${(this.state.resetform === 1 ? 'show':'hide' )}`}>
                                    <Form.Control type="password" placeholder="New Passsword" size="lg" className="h-auto m-2" name="password"  onChange={this.handleChange}  value={this.state.password}  />
                                    <Form.Control type="password" placeholder="Confirm Passsword" size="lg" className="h-auto m-2" name="confirmPassword"  onChange={this.handleChange}  value={this.state.confirmPassword}  />
                                    <div className={`invalid-feedback ${(this.state.password !== this.state.confirmPassword && this.state.confirmPassword !== '') ? 'show':'hide'}`}>
                                        Passwords doesn't match
                                    </div>
                                </Form.Group>
                                <div className={`mt-3 ${(this.state.resetform === 2 ? 'show':'hide' )}`} >
                                    {this.state.message} 
                                    <Link className={`btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn`} to={"/auth/login"} >Log In</Link>
                                </div>
                                <div className={`mt-3 ${(this.state.resetform !== 2 ? 'show':'hide' )}`} >
                                    <button className={`btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn ${(this.state.username.trim().length > 0 || (this.state.password === this.state.confirmPassword && this.state.confirmPassword !== '')) ? "" : "disabled"}`} onClick={() => this.ResetPswd() } > Reset password</button>
                                </div>
                               
                            </div>
                    </div>
                    </div>
                </div>
        )
    }
    
}