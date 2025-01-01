import {Navigate, Routes, Route, Outlet, Link} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Overview} from './components/Overview'
import {Projects} from './components/Projects'
import {Campaigns} from './components/Campaigns'
import {Documents} from './components/Documents'
import {Connections} from './components/Connections'
import {ProfileHeader} from './ProfileHeader'
import PersonalInfo from './PersonalInfo'
import CredentialManager from './CredentialManager'
import {KTSVG} from '../../../_metronic/helpers'
import {Dropdown1} from '../../../_metronic/partials'
import {useLocation} from 'react-router-dom'
import {getAccountsettings} from '../../../service/utility'

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/pages/profile/overview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const ProfilePage: React.FC = () => {
  const location = useLocation()
  var settings = getAccountsettings()

  if (settings) {
    var firstName = settings.fName ? settings.fName : ''
    var lastName = settings.lName ? settings.lName : ''
    var profilePic = settings.image
      ? settings.image
      : 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
    var mail = settings.userid
    var country = settings.country
    var role = settings.role ? "Role Not Set" : settings.role
  }

  return (
    <Routes>
      <Route
        element={
          <>
            <div className='card mb-5 mb-xl-10'>
              <div className='card-body pt-4 pb-0'>
                <div className='d-flex flex-wrap flex-sm-nowrap  align-items-center'>
                  <div className='me-7'>
                    <div className='symbol symbol-100px symbol-lg-130px symbol-fixed position-relative'>
                      <img className='profile-pic' src={profilePic} />
                    </div>
                  </div>
                  <div className='flex-grow-1'>
                    <div className='d-flex justify-content-between align-items-center flex-wrap'>
                      <div className='d-flex flex-column'>
                        <div className='d-flex align-items-center mb-2'>
                          <a
                            href='#'
                            className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'
                          >
                            {firstName + ' ' + lastName}
                          </a>
                          <a href='#'>
                            <KTSVG
                              path='/media/icons/duotune/general/gen026.svg'
                              className='svg-icon-1 svg-icon-primary'
                            />
                          </a>
                        </div>

                        <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                          <a
                            href='#'
                            className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                          >
                            <KTSVG
                              path='/media/icons/duotune/communication/com006.svg'
                              className='svg-icon-4 me-1'
                            />
                            {role}
                          </a>
                          <a
                            href='#'
                            className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                          >
                            <KTSVG
                              path='/media/icons/duotune/general/gen018.svg'
                              className='svg-icon-4 me-1'
                            />
                            {country}
                          </a>
                          <a
                            href='#'
                            className='d-flex align-items-center text-gray-400 text-hover-primary mb-2'
                          >
                            <KTSVG
                              path='/media/icons/duotune/communication/com011.svg'
                              className='svg-icon-4 me-1'
                            />
                            {mail}
                          </a>
                        </div>
                      </div>

                      {/* <div className='d-flex my-4'>
                <a href='#' className='btn btn-sm btn-light me-2' id='kt_user_follow_button'>
                  <KTSVG
                    path='/media/icons/duotune/arrows/arr012.svg'
                    className='svg-icon-3 d-none'
                  />

                  <span className='indicator-label'>Follow</span>
                  <span className='indicator-progress'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                </a>
                <a
                  href='#'
                  className='btn btn-sm btn-primary me-3'
                  data-bs-toggle='modal'
                  data-bs-target='#kt_modal_offer_a_deal'
                >
                  Hire Me
                </a>
                <div className='me-0'>
                  <button
                    className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                    data-kt-menu-trigger='click'
                    data-kt-menu-placement='bottom-end'
                    data-kt-menu-flip='top-end'
                  >
                    <i className='bi bi-three-dots fs-3'></i>
                  </button>
                  <Dropdown1 />
                </div>
              </div> */}
                    </div>
                  </div>
                </div>

                <div className='d-flex overflow-auto h-55px'>
                  <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                    <li className='nav-item'>
                      <Link
                        className={
                          `nav-link text-active-primary me-6 ` +
                          (location.pathname === '/pages/profile/personalInfo' && 'active')
                        }
                        to='/pages/profile/personalInfo'
                      >
                        Personal Info
                      </Link>
                    </li>
                    {/* <li className='nav-item'>
                      <Link
                        className={
                          `nav-link text-active-primary me-6 ` +
                          (location.pathname === '/pages/profile/credentialManager' && 'active')
                        }
                        to='/pages/profile/credentialManager'
                      >
                        Credential Manager
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link
                        className={
                          `nav-link text-active-primary me-6 ` +
                          (location.pathname === '/pages/profile/overview' && 'active')
                        }
                        to='/pages/profile/overview'
                      >
                        Overview
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link
                        className={
                          `nav-link text-active-primary me-6 ` +
                          (location.pathname === '/pages/profile/projects' && 'active')
                        }
                        to='/pages/profile/projects'
                      >
                        Projects
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link
                        className={
                          `nav-link text-active-primary me-6 ` +
                          (location.pathname === '/pages/profile/campaigns' && 'active')
                        }
                        to='/pages/profile/campaigns'
                      >
                        Campaigns
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link
                        className={
                          `nav-link text-active-primary me-6 ` +
                          (location.pathname === '/pages/profile/documents' && 'active')
                        }
                        to='/pages/profile/documents'
                      >
                        Documents
                      </Link>
                    </li>
                    <li className='nav-item'>
                      <Link
                        className={
                          `nav-link text-active-primary me-6 ` +
                          (location.pathname === '/pages/profile/connections' && 'active')
                        }
                        to='/pages/profile/connections'
                      >
                        Connections
                      </Link> 
                    </li>*/}
                  </ul>
                </div>
              </div>
            </div>
            <Outlet />
          </>
        }
      >
        <Route index element={<Navigate to='/pages/profile/overview' />} />
      </Route>
    </Routes>
  )
}

export default ProfilePage
