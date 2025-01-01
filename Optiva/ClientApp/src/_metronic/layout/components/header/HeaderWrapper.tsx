/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {useLayout} from '../../core'
import {HeaderToolbar} from './HeaderToolbar'
import {getAccountsettings, getBranding} from '../../../../service/utility'
import { useState } from 'react'
import Branding from '../../../../app/pages/accounts/branding'

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

export function HeaderWrapper() {
  const {config, classes, attributes} = useLayout()
  const {aside} = config;
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
    <div
      id='kt_header'
      className={clsx('header', classes.header.join(' '), 'align-items-stretch')}
      {...attributes.headerMenu}
    >
      {/* begin::Brand */}
      <div className='header-brand'>
        {/* begin::Logo */}
        <Link to='/' className='w-50'>
          <img alt='Logo' src={BrandLogo} className='w-125px' />
        </Link>
        {/* <h2 className='text-white mb-0 w-75'>{BrandTitle}</h2> */}
        {/* end::Logo */}

        {aside.minimize && (
          <div
            id='kt_aside_toggle'
            className='btn btn-icon w-auto px-0 btn-active-color-primary aside-minimize'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='aside-minimize'
          >
            <KTSVG
              path='/media/icons/duotune/arrows/arr092.svg'
              className='svg-icon-1 me-n1 minimize-default'
            />
            <KTSVG
              path='/media/icons/duotune/arrows/arr076.svg'
              className='svg-icon-1 minimize-active'
            />
          </div>
        )}

        {/* begin::Aside toggle */}
        <div className='d-flex align-items-center d-lg-none ms-n3 me-1' title='Show aside menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-30px h-30px'
            id='kt_aside_mobile_toggle'
          >
            <KTSVG path='/media/icons/duotune/abstract/abs015.svg' className='svg-icon-1' />
          </div>
        </div>
        {/* end::Aside toggle */}
      </div>
      {/* end::Brand */}
      <HeaderToolbar />
    </div>
  )
}
