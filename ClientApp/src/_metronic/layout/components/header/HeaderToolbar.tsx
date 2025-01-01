/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useEffect} from 'react'
import noUiSlider from 'nouislider'
import {useLayout} from '../../core'
import {KTSVG} from '../../../helpers'
import {DefaultTitle} from './page-title/DefaultTitle'
import {HeaderUserMenu, ThemeModeSwitcher} from '../../../partials'

const HeaderToolbar = () => {
  const {classes} = useLayout()
  const [status, setStatus] = useState<string>('1')

  useEffect(() => {
    const rangeSlider = document.querySelector('#kt_toolbar_slider')
    const rangeSliderValueElement = document.querySelector('#kt_toolbar_slider_value')

    if (!rangeSlider || !rangeSliderValueElement) {
      return
    }

    // @ts-ignore
    noUiSlider.create(rangeSlider, {
      start: [5],
      connect: [true, false],
      step: 1,
      format: {
        to: function (value) {
          const val = +value
          return Math.round(val).toString()
        },
        from: function (value) {
          return value
        },
      },
      range: {
        min: [1],
        max: [10],
      },
    })

    // @ts-ignore
    rangeSlider.noUiSlider.on('update', function (values, handle) {
      rangeSliderValueElement.innerHTML = values[handle]
    })

    const handle = rangeSlider.querySelector('.noUi-handle')
    if (handle) {
      handle.setAttribute('tabindex', '0')
    }

    // @ts-ignore
    handle.addEventListener('click', function () {
      // @ts-ignore
      this.focus()
    })

    // @ts-ignore
    handle.addEventListener('keydown', function (event) {
      // @ts-ignore
      const value = Number(rangeSlider.noUiSlider.get())
      // @ts-ignore
      switch (event.which) {
        case 37:
          // @ts-ignore
          rangeSlider.noUiSlider.set(value - 1)
          break
        case 39:
          // @ts-ignore
          rangeSlider.noUiSlider.set(value + 1)
          break
      }
    })
    return () => {
      // @ts-ignore
      rangeSlider.noUiSlider.destroy()
    }
  }, [])

  return (
    <div className='toolbar d-flex align-items-stretch'>
      {/* begin::Toolbar container */}
      <div
        className={`py-6 py-lg-0 m-0 d-flex flex-column flex-lg-row align-items-lg-stretch justify-content-lg-between w-100`}
      >
        <DefaultTitle />
        <div className='d-flex align-items-center w-25'>
          <input type="search" className="search-input form-control form-control-solid ps-13" name="search" value="" placeholder="Search..." />
        </div>
         <div className='d-flex align-items-stretch overflow-auto pt-3 pt-lg-0'>
        
          
          <div className='d-flex align-items-center'>
            <div className='d-flex'>
              <div className='d-flex align-items-center'>
                <ThemeModeSwitcher toggleBtnClass='btn btn-sm btn-icon btn-icon-light btn-active-icon-primary' />
              </div>
              {/* <div className='d-flex align-items-center'>
              <a href="#" className="btn btn-sm btn-bg-primary btn-color-white e   me-2" id="kt_dashboard_daterangepicker" data-bs-toggle="tooltip" data-bs-dismiss="click" data-bs-trigger="hover" title="Select dashboard daterange">
                <span className="fw-bolder" id="kt_dashboard_daterangepicker_date">Today: 17 January</span></a>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {HeaderToolbar}
