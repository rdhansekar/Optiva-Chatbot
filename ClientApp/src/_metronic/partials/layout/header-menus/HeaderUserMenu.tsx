/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {Link} from 'react-router-dom'
import {useAuth} from '../../../../app/modules/auth'
import {Languages} from './Languages'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import { deleteData } from '../../../../service/httputlity'
import { clearSessionstorage, getAccountsettings } from '../../../../service/utility'

const HeaderUserMenu: FC = () => {
  const {currentUser, logout} = useAuth()
  const logoutUser = ()=> {
    deleteData( "logout").then((d) => {
      clearSessionstorage();
      window.location.href = "/auth/login";
    });
  }
  var settings = getAccountsettings()
  if(settings){
    var firstName = settings.fName ? settings.fName : ''
    var lastName = settings.lName ? settings.lName : ''
    var profilePic = settings.image
      ? settings.image
      : 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
  
  }
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu="true"
      data-popper-placement="bottom-start"
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src={toAbsoluteUrl(profilePic)} />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {firstName + " " + lastName}
              {/* <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>{firstName + " " + lastName}</span> */}
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {settings?.email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>
      {/* <div className='menu-item px-5'>
        <a href='#' className='menu-link px-5'>
          <span className='menu-text'>My Projects</span>
          <span className='menu-badge'>
            <span className='badge badge-light-danger badge-circle fw-bolder fs-7'>3</span>
          </span>
        </a>
      </div>

      <div
        className='menu-item px-5'
        data-kt-menu-trigger='hover'
        data-kt-menu-placement='left-start'
        data-kt-menu-flip='bottom'
      >
        <a href='#' className='menu-link px-5'>
          <span className='menu-title'>My Subscription</span>
          <span className='menu-arrow'></span>
        </a>

        <div className='menu-sub menu-sub-dropdown w-175px py-4'>
          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-5'>
              Referrals
            </a>
          </div>

          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-5'>
              Billing
            </a>
          </div>

          <div className='menu-item px-3'>
            <a href='#' className='menu-link px-5'>
              Payments
            </a>
          </div>

          <div className='menu-item px-3'>
            <a href='#' className='menu-link d-flex flex-stack px-5'>
              Statements
              <i
                className='fas fa-exclamation-circle ms-2 fs-7'
                data-bs-toggle='tooltip'
                title='View your statements'
              ></i>
            </a>
          </div>

          <div className='separator my-2'></div>

          <div className='menu-item px-3'>
            <div className='menu-content px-3'>
              <label className='form-check form-switch form-check-custom form-check-solid'>
                <input
                  className='form-check-input w-30px h-20px'
                  type='checkbox'
                  value='1'
                  defaultChecked={true}
                  name='notifications'
                />
                <span className='form-check-label text-muted fs-7'>Notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className='menu-item px-5'>
        <a href='#' className='menu-link px-5'>
          My Statements
        </a>
      </div>

      <div className='separator my-2'></div>

      <Languages /> */}
      <div className='menu-item px-5'>
        <Link to={'/pages/profile/personalInfo'} className='menu-link px-5'>
        <KTSVG path='/media/icons/fontIcon/user-gear-solid.svg' className='svg-icon-3 svg-icon-primary me-2'/>{' '}
          My Profile
        </Link>
      </div>

      {/* <div className='menu-item px-5 my-1'>
        <Link to='/account/branding' className='menu-link px-5'>
        <KTSVG path='/media/icons/fontIcon/gear-solid.svg' className='svg-icon-3 svg-icon-success me-2'/>{' '}
          Account Settings
        </Link>
      </div> */}

      <div className='menu-item px-5'>
        <a onClick={logoutUser} className='menu-link px-5'>
        <i className="fa-solid fa-arrow-right-from-bracket text-danger fs-3 me-2"></i>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
