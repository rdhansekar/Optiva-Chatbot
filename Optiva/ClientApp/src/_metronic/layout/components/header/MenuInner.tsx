import React from 'react'
import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {MegaMenu} from './MegaMenu'
import {useIntl} from 'react-intl'

export function MenuInner() {
  const intl = useIntl()
  return (
    <>
      <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
      <MenuItem title='Layout Builder' to='/builder' />
      <MenuInnerWithSub
        title='Crafted'
        to=''
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        {/* PAGES */}
        <MenuInnerWithSub
          title='Pages'
          to='/pages'
          fontIcon='bi-archive'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuInnerWithSub
            title='Profile'
            to='/pages/profile'
            hasArrow={true}
            hasBullet={true}
            menuPlacement='right-start'
            menuTrigger={`{default:'click', lg: 'hover'}`}
          >
            <MenuItem to='/pages/profile/overview' title='Overview' hasBullet={true} />
            <MenuItem to='/pages/profile/projects' title='Projects' hasBullet={true} />
            <MenuItem to='/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
            <MenuItem to='/pages/profile/documents' title='Documents' hasBullet={true} />
            <MenuItem
              to='/pages/profile/connections'
              title='Connections'
              hasBullet={true}
            />
          </MenuInnerWithSub>
          <MenuInnerWithSub
            title='Wizards'
            to='/pages/wizards'
            hasArrow={true}
            hasBullet={true}
            menuPlacement='right-start'
            menuTrigger={`{default:'click', lg: 'hover'}`}
          >
            <MenuItem to='/pages/wizards/horizontal' title='Horizontal' hasBullet={true} />
            <MenuItem to='/pages/wizards/vertical' title='Vertical' hasBullet={true} />
          </MenuInnerWithSub>
        </MenuInnerWithSub>

        {/* ACCOUNT */}
        <MenuInnerWithSub
          title='Accounts'
          to='/accounts'
          fontIcon='bi-person'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/account/overview' title='Overview' hasBullet={true} />
          <MenuItem to='/account/settings' title='Settings' hasBullet={true} />
        </MenuInnerWithSub>

        {/* ERRORS */}
        <MenuInnerWithSub
          title='Errors'
          to='/error'
          fontIcon='bi-sticky'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/error/404' title='Error 404' hasBullet={true} />
          <MenuItem to='/error/500' title='Error 500' hasBullet={true} />
        </MenuInnerWithSub>

        {/* Widgets */}
        <MenuInnerWithSub
          title='Widgets'
          to='/widgets'
          fontIcon='bi-layers'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/widgets/lists' title='Lists' hasBullet={true} />
          <MenuItem to='/widgets/statistics' title='Statistics' hasBullet={true} />
          <MenuItem to='/widgets/charts' title='Charts' hasBullet={true} />
          <MenuItem to='/widgets/mixed' title='Mixed' hasBullet={true} />
          <MenuItem to='/widgets/tables' title='Tables' hasBullet={true} />
          <MenuItem to='/widgets/feeds' title='Feeds' hasBullet={true} />
        </MenuInnerWithSub>
      </MenuInnerWithSub>

      <MenuInnerWithSub title='Apps' to='/apps' menuPlacement='bottom-start' menuTrigger='click'>
        {/* PAGES */}
        <MenuInnerWithSub
          title='Chat'
          to='/apps/chat'
          icon='/media/icons/duotune/communication/com012.svg'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
          <MenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
          <MenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
        </MenuInnerWithSub>
        <MenuItem
          icon='/media/icons/duotune/general/gen051.svg'
          to='/apps/user-management/users'
          title='User management'
        />
      </MenuInnerWithSub>

      <MenuInnerWithSub
        isMega={true}
        title='Mega menu'
        to='/mega-menu'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MegaMenu />
      </MenuInnerWithSub>
    </>
  )
}
