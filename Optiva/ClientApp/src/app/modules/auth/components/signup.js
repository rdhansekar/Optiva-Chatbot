import React from 'react'
import { postdata } from '../../../service/httputlity';


class Signup  extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        email:'',
        phone:'',
        password:'',
        emailExist:false,
        confirmPassword:'',
        registrationsuccess:false
    };

    handleChange = this.handleChange.bind(this);
    
    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
          })
    }

    registerUser(){
        if(this.state.password === this.state.confirmPassword){
            var json = {username:this.state.email};
            console.log(json);
            postdata("verifyemail",json).then((d)=>{
                if(d && !d.exist){
                     json = this.state;
                     postdata("registerUser",json).then((d)=>{
                            this.setState({submitted:true,registrationsuccess:true});
                        },(e)=>{
                            console.log(e);
                            this.setState({submitted:true,registrationsuccess:false});
                        });
                }
                else{
                    this.setState({
                        emailExist : true
                      });
                }
                console.log(d);
            },
            (e)=>{
                console.log(e);
            });
        }
    }

    onChangeFile(event) {
        event.stopPropagation();
        event.preventDefault();
        const reader = new FileReader()
        reader.onload = async (e) => { 
          const text = (e.target.result)
          console.log(text)
          this.setState({image:text});
        };
        reader.readAsDataURL(event.target.files[0])
      }
    
    importClicked(){
        document.getElementById('input-file').click();
    }

    render(){
        return ( 
            <div className="row w-100 mx-0 bg-dark align-items-center h-100">
             <div className="col-lg-7 col-sm-0 mx-auto">
             <img  src={require("../../src/background1.png")} width='100%'/>
            </div>
            <div className="col-lg-5 col-sm-12 mx-auto">
             <div className="card text-left py-5 px-4 px-sm-5 text-dark">
               {/* <h3 class="mb-4 text-primary">Optiva</h3> */}
                            {/* <h6 className={`font-weight-light ${ (this.state.registrationsuccess) ? 'hide':'show'}`} >Signing up is easy. It only takes a few steps</h6> */}
                            <div className={`my-login-validation ${ (this.state.registrationsuccess) ? 'hide':'show'}`} >
                            <div className="pt-3">
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input type="text" className="form-control form-control-lg" name="firstName" onChange={this.handleChange}  value={this.state.firstName}  placeholder="Enter First Name" />
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input type="text" className="form-control form-control-lg" name="lastName" onChange={this.handleChange}  value={this.state.lastName} placeholder="Enter Last Name" />
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Email ID</label>
                                            <input className="form-control form-control-lg" placeholder="Only Co-oporate EMail ID" id="email" type="email" name="email" onChange={this.handleChange}  value={this.state.email}/>
                                            <div className={`invalid-feedback ${ this.state.emailExist ? 'show':'hide'}`}>
                                                Email Id already registered
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Phone Number</label>
                                            <input type="phone" className="form-control form-control-lg" name="phoneNumber" onChange={this.handleChange}  value={this.state.phone} placeholder="Enter Phone Number" />
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input type="password" className="form-control form-control-lg" name="password" onChange={this.handleChange}  value={this.state.password}  placeholder="Enter Password" />
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label>Confirm Password</label>
                                            <input type="password" className="form-control form-control-lg" name="confirmPassword" onChange={this.handleChange}  value={this.state.confirmPassword} placeholder="Confirm Password" />
                                            <div className={`invalid-feedback ${(this.state.password !== this.state.confirmPassword && this.state.confirmPassword !== '')? 'show':'hide'}`}>
                                                    Passwords doesn't match
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="form-group">
                                    <input className="form-control form-control-lg" id="input-file" type="file" name="profilePic"  onChange={this.onChangeFile.bind(this)} />
                                </div>
                             */}
                                <div className="mb-4">
                                    <div className={this.state.submitted ? 'show':'hide'}>
                                        <div className={`invalid-feedback ${ this.state.registrationsuccess ? 'hide':'show'}`} >
                                            Regiatration Failed
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="form-check">
                                    <label className="form-check-label text-muted">
                                        <input type="checkbox" className="form-check-input" />
                                        <i className="input-helper"></i>
                                        I agree to all<a href="/agreement" className='auth-link '> Terms & Conditions</a>
                                    </label>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-block btn-primary font-weight-medium auth-form-btn" onClick={() => this.registerUser()}>SIGN UP</button>
                                </div>
                                <div className="text-center mt-4 font-weight-light">
                                    Already have an account? <a href="/auth/login" className="text-primary">Login</a>
                                </div>
                            </div>
                            </div>
                            <div className={`mb-4 ${ (this.state.registrationsuccess) ? 'show':'hide'}`}>
                            <h6 className={`sucess-feedback  text-success}`}>
                                        Regiatration success. Mail will be sent once details are verified.
                             </h6>
                            </div>
                        </div>
                    </div>
                </div>

    )
    }
}

export default Signup;