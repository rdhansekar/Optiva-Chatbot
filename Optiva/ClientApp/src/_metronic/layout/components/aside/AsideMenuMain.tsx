/* eslint-disable react/jsx-no-target-blank */
import { useIntl } from 'react-intl'
import { KTSVG } from '../../../helpers'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'
import { AsideMenuItem } from './AsideMenuItem'
import { IsFeatureAllowed, subscribeToEvent } from '../../../../service/taskservice'
import { useState } from 'react'

export function AsideMenuMain() {
  const intl = useIntl()
  const [data, setDate] = useState('0')
  subscribeToEvent('USER_DATA_UPDATE', (d: any) => {
    setDate('1')
  })
  return (
    <>
      {/* <AsideMenuItem
        to='home/dashboard'
        icon='/media/icons/fontIcon/house-tsunami-solid.svg'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
      /> */}
       <AsideMenuItem
        to='home/dashboard'
        icon='/media/icons/fontIcon/chart-line-solid.svg'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
      />
       <AsideMenuItem
        to='home/consoleLogs'
        icon='/media/icons/fontIcon/file-lines-regular.svg'
        title='View Console Logs'
      />
         <AsideMenuItem
        to='home/cannedRequest'
        icon='/media/icons/fontIcon/rocketchat.svg'
        title='Canned Requests'
      />
        <AsideMenuItem
        to='home/rfpchat'
        icon='/media/icons/fontIcon/keycdn.svg'
        title='RFP'
      />
      {/* <AsideMenuItemWithSub to='/okr' title='Products and Offers' icon='/media/icons/fontIcon/mars-and-venus-solid.svg'>
        <AsideMenuItem to='/okr/IndividualOkr' title='Products' hasBullet={true} />
        <AsideMenuItem to='/okr/corporateOkr' title='Offers' hasBullet={true} />
      </AsideMenuItemWithSub> 
      <AsideMenuItem
        to='home/tasks'
        icon='/media/icons/fontIcon/list-check-solid.svg'
        title='Compaigns'
      />*/}
      <AsideMenuItem
        to='home/reports'
        icon='/media/icons/fontIcon/chart-bar-regular.svg'
        title='Reports'
      />

     
      <AsideMenuItemWithSub
        to='/pages/profile'
        title='Profile Settings'
        icon='/media/icons/fontIcon/id-badge-regular.svg'
      >
        <AsideMenuItem to='/pages/profile/personalInfo' title='Personal Info' hasBullet={true} />
      </AsideMenuItemWithSub>
    </>
  )
}
