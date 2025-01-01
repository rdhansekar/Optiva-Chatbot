import React from 'react'
import {getData} from '../../../../service/httputlity'
import { Link } from 'react-router-dom'

export default class VerifyEmail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      success: true,
      submitted: true,
    }
    this.initPage()
  }

  initPage() {
    if (window.location.href.search('id=') !== -1) {
     var id = window.location.href.split('?id=')[1]
      if (id) {
        let tid = id.split(':')[1]
        getData('validateemailverification?id=' + tid).then(
          (d) => {
            if (d.success) {
              this.setState({submitted: true, success: true})
              setTimeout(() => {
                window.location.href = '/auth/login'
              }, 3000)
            } else {
              this.setState({submitted: true, success: false})
            }
          },
          (e) => {
            this.setState({submitted: true, success: false})
            setTimeout(() => {
              window.location.href = '/auth/login'
            }, 3000)
          }
        )
      }
    } else {
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 3000)
    }
  }

  render() {
    return (
      <div className='row w-100 mx-0 align-items-center h-100'>
        <div className='col-lg-12 col-sm-12 mx-auto'>
          <div className='card text-left py-5 px-4 px-sm-5 text-dark'>
            {!this.state.submitted ? <h4 className={`card-title `}>Verifying...</h4> : <></>}
            <div class='pt-3'>
              {this.state.submitted ? (
                this.state.success ? (
                  <div className='mb-lg-15 alert alert-success'>
                    <div className='alert-text font-weight-bold'>
                      Successfully verified your email address. Please wait while we redirect you to
                      login page.
                    </div>
                  </div>
                ) : (
                  <div className='mb-lg-15 alert alert-danger'>
                    <div className='alert-text font-weight-bold'>
                      Invalid verification link. If verified already please continue to login.
                    </div>
                    <Link to='/auth/login' className='btn btn-primary float-right'>Login</Link>
                  </div>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
