import {useAuth} from '../../../../app/modules/auth'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu, Search} from '../../../partials'

/* eslint-disable jsx-a11y/anchor-is-valid */
const AsideToolbar = () => {
  const {currentUser} = useAuth()

  return (
    <>
      {/*begin::User*/}
       {/* <div className='aside-user d-flex align-items-sm-center justify-content-center py-5'>
       
        <div className='symbol symbol-50px'>
          <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='' />
        </div>
       
        <div className='aside-user-info flex-row-fluid flex-wrap ms-5'>
          <div className='d-flex'>
            <div className='flex-grow-1 me-2'>
              <a href='#' className='text-white text-hover-primary fs-6 fw-bold'>
                {currentUser?.first_name} {currentUser?.last_name}
              </a>
              <span className='text-gray-600 fw-bold d-block fs-8 mb-1'>Python dev</span>
              <div className='d-flex align-items-center text-success fs-9'>
                <span className='bullet bullet-dot bg-success me-1'></span>online
              </div>
            </div>
            <div className='me-n2'>
              <a
                href='#'
                className='btn btn-icon btn-sm btn-active-color-primary mt-n2'
                data-kt-menu-trigger='click'
                data-kt-menu-placement='bottom-start'
                data-kt-menu-overflow='false'
              >
                <KTSVG
                  path='/media/icons/duotune/coding/cod001.svg'
                  className='svg-icon-muted svg-icon-1'
                />
              </a>

              <HeaderUserMenu />
            </div>
          </div>
        </div>
      </div> */}
      {/*end::User*/}

      {/*begin::Aside search*/}
      <div className='aside-search'>
        {/* <?php Theme::getView('partials/search/_inline', array(
        'class' => 'w-100',
        'menu-placement' => 'bottom-start',
        'responsive' => 'false'
    ))?> 
        <Search />*/}
      </div>
      {/*end::Aside search*/}
    </>
  )
}

export {AsideToolbar}
