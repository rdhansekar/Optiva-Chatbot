/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {Dropdown1} from '../../../_metronic/partials'
import {useLocation} from 'react-router'
import "./userManagement.css";
const UserMngHeader: React.FC = () => {
  const location = useLocation()

  return (
    <div className='card mb-5 mb-xl-10 account_header'>
      <div className='card-body pt-4 pb-0'>
        {/* <div className='d-flex flex-column'>
          <div className='d-flex align-items-center mb-2'>
            <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
             Manage Users
            </a>
          </div>
          <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
          <span  className='d-flex align-items-center text-gray-400 me-5 mb-2' >
            Add, Edit and Delete Users and Access Control</span>
          </div>
        </div> */}

        <div className='d-flex overflow-auto h-55px'>
          <ul className='nav nav-stretch nav-line-tabs_custom nav-line-tabs-2x border-transparent fs-5 fw-boldep'>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6` +
                  (location.pathname === '/userManagement/Users' && 'active')
                }
                to='/userManagement/users'
              >
                Users
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6` +
                  (location.pathname === '/userManagement/accessControl' && 'active')
                }
                to='/userManagement/accessControl'
              >
                Access Control
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export {UserMngHeader}
