/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useEffect} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'
import {postdata} from '../../../../service/httputlity'

const initialValues = {
  firstname: '',
  lastname: '',
  //companyName: '',
  phone: '',
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false,
}

function registerUser(values: any) {
  return new Promise((res, rej) => {
    var json = {username: values.email}
    postdata('verifyemail', json).then(
      (d) => {
        if (d && !d.exist) {
          postdata('registerUser', values).then(
            (d) => {
              res({submitted: true, registrationsuccess: true})
            },
            (e) => {
              console.log(e)
              res({submitted: true, registrationsuccess: false})
            }
          )
        } else {
          res({
            emailExist: true,
          })
        }
        console.log(d)
      },
      (e) => {
        console.log(e)
      }
    )
  })
}

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('First name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  lastname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Last name is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .required('Password confirmation is required')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    }),
  //companyName: Yup.string().required('Company Name is required'),
  phone: Yup.string().required('Phone Number is required'),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        registerUser(values).then(
          (d: any) => {
            if (d.submitted) {
              setStatus('Verification mail sent to your email address. Please verify to login')
              setIsRegistered(true)
              values = initialValues
            } else if (d.emailExist) {
              setStatus('Email Id already present')
            }
            setLoading(false)
          },
          (e) => {
            setStatus('The registration details is incorrect')
          }
        )
      } catch (error) {
        console.error(error)
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {isRegistered ? (
        <div className='mb-lg-15 alert alert-success'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <></>
      )}

      {!isRegistered ? (
        <>
          {/* begin::Heading */}
          <div className='mb-10 text-center'>
            {/* begin::Title */}
            <h1 className='text-dark mb-3'>Create an Account</h1>
            {/* end::Title */}

            {/* begin::Link */}
            <div className='text-gray-400 fw-bold fs-4'>
              Already have an account?
              <Link to='/auth/login' className='link-primary fw-bolder' style={{marginLeft: '5px'}}>
                Forgot Password ?
              </Link>
            </div>
            {/* end::Link */}
          </div>

          {formik.status && (
            <div className='mb-lg-15 alert alert-danger'>
              <div className='alert-text font-weight-bold'>{formik.status}</div>
            </div>
          )}

          {/* begin::Form group Firstname */}
          <div className='row fv-row mb-7'>
            <div className='col-xl-6'>
              <label className='class="form-label fw-bolder text-dark fs-6'>First name</label>
              <input
                placeholder='First name'
                type='text'
                autoComplete='off'
                {...formik.getFieldProps('firstname')}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                  {
                    'is-invalid': formik.touched.firstname && formik.errors.firstname,
                  },
                  {
                    'is-valid': formik.touched.firstname && !formik.errors.firstname,
                  }
                )}
              />
              {formik.touched.firstname && formik.errors.firstname && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.firstname}</span>
                  </div>
                </div>
              )}
            </div>
            <div className='col-xl-6'>
              {/* begin::Form group Lastname */}
              <div className='fv-row mb-5'>
                <label className='form-label fw-bolder text-dark fs-6'>Last name</label>
                <input
                  placeholder='Last name'
                  type='text'
                  autoComplete='off'
                  {...formik.getFieldProps('lastname')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    {
                      'is-invalid': formik.touched.lastname && formik.errors.lastname,
                    },
                    {
                      'is-valid': formik.touched.lastname && !formik.errors.lastname,
                    }
                  )}
                />
                {formik.touched.lastname && formik.errors.lastname && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.lastname}</span>
                    </div>
                  </div>
                )}
              </div>
              {/* end::Form group */}
            </div>
          </div>
          {/* end::Form group */}

          {/* begin::Form group Email */}
          <div className='row fv-row mb-7'>
            <div className='col-xl-6'>
                <div className='fv-row mb-7'>
                <label className='form-label fw-bolder text-dark fs-6'>Email</label>
                <input
                  placeholder='Email'
                  type='email'
                  autoComplete='off'
                  {...formik.getFieldProps('email')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    {'is-invalid': formik.touched.email && formik.errors.email},
                    {
                      'is-valid': formik.touched.email && !formik.errors.email,
                    }
                  )}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='col-xl-6'>
                {/* begin::Form group Phone */}
              <div className='fv-row mb-7'>
                  <label className='form-label fw-bolder text-dark fs-6'>Phone</label>
                  <input
                    placeholder='Phone No'
                    type='text'
                    autoComplete='off'
                    {...formik.getFieldProps('phone')}
                    className={clsx(
                      'form-control form-control-lg form-control-solid',
                      {'is-invalid': formik.touched.phone && formik.errors.phone},
                      {
                        'is-valid': formik.touched.phone && !formik.errors.phone,
                      }
                    )}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        <span role='alert'>{formik.errors.phone}</span>
                      </div>
                    </div>
                  )}
              </div>
          {/* end::Form group */}
            </div>
          </div>
         
          {/* end::Form group */}
        
          {/* begin::Form group Password */}
          <div className='row fv-row mb-7'>
            <div className='col-xl-6'>
            <div className='mb-10 fv-row' data-kt-password-meter='true'>
            <div className='mb-1'>
              <label className='form-label fw-bolder text-dark fs-6'>Password</label>
              <div className='position-relative mb-3'>
                <input
                  type='password'
                  placeholder='Password'
                  autoComplete='off'
                  {...formik.getFieldProps('password')}
                  className={clsx(
                    'form-control form-control-lg form-control-solid',
                    {
                      'is-invalid': formik.touched.password && formik.errors.password,
                    },
                    {
                      'is-valid': formik.touched.password && !formik.errors.password,
                    }
                  )}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.password}</span>
                    </div>
                  </div>
                )}
              </div>
              {/* begin::Meter */}
              <div
                className='d-flex align-items-center mb-3'
                data-kt-password-meter-control='highlight'
              >
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
                <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
              </div>
              {/* end::Meter */}
            </div>
            <div className='text-muted'>
              Use 8 or more characters with a mix of letters, numbers & symbols.
            </div>
            </div>
            </div>
            <div className='col-xl-6'>
                {/* begin::Form group Confirm password */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
            <input
              type='password'
              placeholder='Password confirmation'
              autoComplete='off'
              {...formik.getFieldProps('changepassword')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
                },
                {
                  'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
                }
              )}
            />
            {formik.touched.changepassword && formik.errors.changepassword && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.changepassword}</span>
                </div>
              </div>
            )}
            </div>
            </div>
          </div>
       
        
          {/* begin::Form group Company */}
          {/* <div className='fv-row mb-7'>
            <label className='form-label fw-bolder text-dark fs-6'>Organization Name</label>
            <input
              placeholder='Company Name'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('companyName')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {'is-invalid': formik.touched.companyName && formik.errors.companyName},
                {
                  'is-valid': formik.touched.companyName && !formik.errors.companyName,
                }
              )}
            />
            {formik.touched.companyName && formik.errors.companyName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.companyName}</span>
                </div>
              </div>
            )}
          </div> */}
          {/* end::Form group */}

        

          {/* begin::Form group */}
          <div className='fv-row mb-10'>
            <div className='form-check form-check-custom form-check-solid'>
              <input
                className='form-check-input'
                type='checkbox'
                id='kt_login_toc_agree'
                {...formik.getFieldProps('acceptTerms')}
              />
              <label
                className='form-check-label fw-bold text-gray-700 fs-6 pl-4'
                htmlFor='kt_login_toc_agree'
              >
                I Agree the{' '}
                <Link to='/auth/terms' className='ms-1 link-primary'>
                  terms and conditions
                </Link>
                .
              </label>
              {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.acceptTerms}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* end::Form group */}

          {/* begin::Form group */}
          <div className='text-center'>
            <button
              type='submit'
              id='kt_sign_up_submit'
              className='btn btn-lg btn-primary w-100 mb-5'
              disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
            >
              {!loading && <span className='indicator-label'>Submit</span>}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            <Link to='/auth/login'>
                Already have a account ? Login
            </Link>
          </div>
          {/* end::Form group */}
        </>
      ) : (
        <></>
      )}
    </form>
  )
}
