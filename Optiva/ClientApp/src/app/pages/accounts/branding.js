import React from 'react'
import {postdata} from '../../../service/httputlity'
import {getAllSettings} from '../../../service/taskservice'
import {getAccountsettings, getBranding, notification} from '../../../service/utility'

export default class Branding extends React.Component {
  state = {
    img: '',
    title: '',
  }
  handleFileUpload(e) {
    var files = e.target.files
    // Check if the file is an image.
    if (!files || files.length === 0 || !files[0].type || !files[0].type.startsWith('image/')) {
      notification.showErrorMessage('Invalid File. ~' + files[0].type)
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      var url = event.target.result
      var ar = url.split('base64,')
      this.setState({img: url})
    })
    reader.readAsDataURL(files[0])
    console.log(e)
  }

  save() {
    if(this.state.companyName && this.state.companyEmail && this.state.title){
      var json = {
        brandLogo: this.state.img,
        brandTitle: this.state.title,
        companyName:this.state.companyName,
        companyAddress:this.state.companyAddress,
        companyContactNo:this.state.companyContactNo,
        companyEmail:this.state.companyEmail
      }
      postdata('addbranding', json).then((d) => {
        notification.showSuccessMessage('Branding Info updated successfully')
        getAllSettings(true)
      })
    }
    else{
      notification.showErrorMessage('Title , Organization name and email cannot be empty');
    }
  }

  handleChange = this.handleChange.bind(this)

  // eslint-disable-next-line no-dupe-class-members
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  componentDidMount() {
    var branding = getBranding();
    if (branding) {
      this.setState({
        img: branding.brandLogo,
        title: branding.brandTitle,
        companyName:branding.companyName,
        companyAddress:branding.companyAddress,
        companyContactNo:branding.companyContactNo,
        companyEmail:branding.companyEmail
      })
    }
  }

  render() {
    return (
      <div className='card mb-5 mb-xxl-8 accSettings_body'>
        <div class='row justify-content-between h-100'>
          <div class='col-lg-9 col-sm-12'>
            <div className='card-header border-0 pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bold fs-4 mb-1'>Set your Branding Info</span>
              </h3>
            </div>

            <div className='card-body'>
            <div className='form-group w-100 mb-4'>
                  <label class='form-label fs-6 fw-semibold'>Upload Logo</label>
                  <div className='d-flex align-items-center gap-10'>
                  <input
                    type='file'
                    className='form-control form-control-solid form-control form-control-solid-lg w-50'
                    name='logo'
                    accept='image/*'
                    onChange={(e) => {
                      this.handleFileUpload(e)
                    }}
                    placeholder='Upload your Logo'
                  />
                  <div className='w-80px'>
                  <img
                  src={this.state.img}
                  className={this.state.img ? 'w-100' : 'hide'}/>
                  </div>
                 
                  </div>
                  
              </div>
              <div class='row'>
                <div className='col-md-6'>
                <div className='form-group mb-4'>
                  <label class='form-label fs-6 fw-semibold required'>Title</label>
                  <input
                    type='text'
                    className='form-control form-control-solid form-control form-control-solid-lg'
                    name='title'
                    onChange={this.handleChange}
                    value={this.state.title}
                    placeholder='eg : Optiva Pvt. Ltd.'
                  />
                </div>
                <div className='form-group'>
                  <label class='form-label fs-6 fw-semibold required'>Organization Email</label>
                  <input
                    type='text'
                    className='form-control form-control-solid form-control form-control-solid-lg'
                    name='companyEmail'
                    onChange={this.handleChange}
                    value={this.state.companyEmail}
                    placeholder='eg : user@domain.com'
                  />
                </div>
                </div>
                <div className='col-md-6'>
                <div className='form-group mb-4'>
                  <label class='form-label fs-6 fw-semibold required'>Organization Name</label>
                  <input
                    type='text'
                    className='form-control form-control-solid form-control form-control-solid-lg'
                    name='companyName'
                    onChange={this.handleChange}
                    value={this.state.companyName}
                    placeholder='eg : Optiva Pvt. Ltd.'
                  />
                </div>
                <div className='form-group mb-4'>
                  <label class='form-label fs-6 fw-semibold'>Organization Contact Num</label>
                  <input
                    type='text'
                    className='form-control form-control-solid form-control form-control-solid-lg'
                    name='companyContactNo'
                    onChange={this.handleChange}
                    value={this.state.companyContactNo}
                    placeholder='Provide contact num'
                  />
                </div>
                </div>
                <div className='form-group mb-4'>
                  <label class='form-label fs-6 fw-semibold'>Organization Address</label>
                  <textarea
                    type='text'
                    className='form-control form-control-solid form-control form-control-solid-lg'
                    name='companyAddress'
                    onChange={this.handleChange}
                    value={this.state.companyAddress}
                    placeholder='Provide Organization Address'
                  />
                </div>
                <div id='actionbtns'>
                  <div class='float-right'>
                    <button
                      className={`btn btn-success m-2`}
                      onClick={() => this.save()}
                    >
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
                  <h6 className="title">
                    <i class="bi bi-magic"></i>&nbsp; What is Branding?
                  </h6>
                </div>
                <p class="card-text">
                The branding section helps the admin to rebrand the Optiva web application per their 
                company’s branding guidelines like logo, and title.
                </p>
              </div>
            </div>
        </div>
      </div>
    )
  }
}
