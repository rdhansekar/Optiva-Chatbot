/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link } from 'react-router-dom'
import {KTSVG} from '../../../helpers'

type Props = {
  className: string
  color: string
  svgIcon?: string
  iconColor: string
  title: string
  titleColor?: string
  description: string
  descriptionColor?: string
  value?:any
  iconCls?:string,
  link:string
}

const StatisticsWidget5: React.FC<Props> = ({
  className,
  color,
  svgIcon,
  iconColor,
  title,
  titleColor,
  description,
  descriptionColor,
  value,
  iconCls,
  link
}) => {
  return (
    <Link to={link} className={`card bg-${color} hoverable ${className}`}>
      {/*<div className='card-body'>
      {svgIcon ? (
        <KTSVG path={svgIcon} className={`svg-icon-${iconColor} svg-icon-2x ms-n1`} />
      ) : (
        <i  className={`svg-icon-${iconColor} svg-icon-2x ms-n1 ${iconCls}` }></i>
      )}
       
       <div className={`text-${titleColor} fw-bold fs-3 mb-2 mt-5 d-flex align-items-center`} > <div>{title} &nbsp;&nbsp; <span className='fs-2'>{value}</span></div></div> 
       
        <div className={`fw-semibold text-${descriptionColor}`}>{description}</div>
       
      </div> */}
      <div className='card-body'>
      {svgIcon ? (
        <KTSVG path={svgIcon} className={`svg-icon-${iconColor} svg-icon-3x ms-n1`} />
      ) : (
        <i  className={`svg-icon-${iconColor} svg-icon-2x ms-n1 ${iconCls}` }></i>
      )}
       <div className={`text-${titleColor} fw-bold fs-2qx mt-5 pt-4 d-flex align-items-center`} >{value}</div>
       <div className={`text-${titleColor} fw-bold fs-3 mb-2 mt-2 d-flex align-items-center`} > <div className='text_extract'>{title}</div> 
       </div>
       {/* <div className={`fw-semibold text-${descriptionColor}`}>{description}</div> */}
      </div>
    </Link>
  )
}

export {StatisticsWidget5}
