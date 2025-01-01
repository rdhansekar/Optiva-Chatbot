/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import {Dropdown1} from '../../../_metronic/partials'
import {useLocation} from 'react-router'
import "./accountsettings.scss";
import { getBranding } from '../../../service/utility'
const AccountHeader: React.FC = () => {
  function init() {
    return new Promise(async (res, rej) => {
      var branding;
      do{
         branding = getBranding();
         await new Promise(r => setTimeout(r, 1000));
      }while(!branding)
      res(branding);
    })
  }
  const location = useLocation();
  const [BrandLogo, setBrandLogo] = useState(toAbsoluteUrl('/media/logos/Optiva_Logo_white.png'));
  const [BrandTitle, setBrandTitle] = useState('Optiva');
  init().then((d)=>{
    var branding = getBranding()
    if (branding) {
      setBrandLogo(branding.brandLogo ? branding.brandLogo : BrandLogo);
      setBrandTitle(branding.brandTitle ? branding.brandTitle : BrandTitle);
    }
  });

  return (
    <div className='card mb-3 mb-xl-5 account_header'>
      <div className='card-body pt-0 pb-0'>
      <div className='d-flex flex-wrap flex-sm-nowrap'>
      <div className='d-flex h-55px'>
          <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/account/branding' && 'active')
                }
                to='/account/branding'
              >
                Branding
              </Link>
            </li>
            {/* <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/account/activeDirectory' && 'active')
                }
                to='/account/activeDirectory'
              >
                Active Directory
              </Link>
            </li> */}
             <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/account/categories' && 'active')
                }
                to='/account/categories'
              >
                Categories
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/account/departments' && 'active')
                }
                to='/account/departments'
              >
                Departments
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/account/region' && 'active')
                }
                to='/account/region'
              >
                Region
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname === '/account/subscription' && 'active')
                }
                to='/account/subscription'
              >
                Subscription
              </Link>
            </li>
            
          </ul>
        </div>
      <div className='d-flex justify-content-end align-items-center flex-wrap flex-grow-1'>
         <img src={BrandLogo} alt='logo' className='logo mr-3 w-50px' />
          <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
            {BrandTitle}
          </a>
          <a href='#'>
            <KTSVG
              path='/media/icons/duotune/general/gen026.svg'
              className='svg-icon-1 svg-icon-primary'
            />
          </a>
        </div>
      </div>
      
      </div>
    </div>
  )
}

export {AccountHeader}
