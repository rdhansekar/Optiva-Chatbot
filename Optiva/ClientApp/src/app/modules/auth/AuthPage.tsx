/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect} from 'react'
import {Outlet, Route, Routes} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import { Login } from './components/Login'
import { Registration } from './components/Registration'
import VerifyEmail from './components/verifyuseremail'
import ForgotPswd from './components/forgotPassword'

const AuthLayout = () => {
  useEffect(() => {
    document.body.style.backgroundImage = 'none'
    return () => {}
  }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed averflow-auto'
      style={{
        backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/dozzy-1/14.png')})`,
        backgroundColor: `#063251`
      }}
    >
      {/* begin::Content */}
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Logo */}
        <a href='#' className='mb-12'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/default-dark.svg')}
            className='theme-dark-show h-45px'
          />
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/Optiva_Logo_white.png')}
            className='theme-light-show h-45px'
          ></img>
        </a>
       
        <div className='w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto'>
          <Outlet />
        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
      {/* begin::Footer */}
      <div className='d-flex flex-center flex-column-auto p-10'>
        <div className='d-flex align-items-center fw-semibold fs-6'>
          <a href='#' className='text-muted text-hover-primary px-2'>
            About
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact Us
          </a>
        </div>
      </div>
      {/* end::Footer */}
    </div>
  )
}

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
     <Route path='login' element={<Login />} />
      <Route path='registration' element={<Registration />} />
      <Route path='verifyemail' element={<VerifyEmail />} />
      <Route path='forgot-password' element={< ForgotPswd/>} />
      <Route index element={<Login />} /> 
    </Route>
  </Routes>
)

export {AuthPage}
