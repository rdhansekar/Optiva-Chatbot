import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import { PageLink , PageTitle} from '../../../_metronic/layout/core'
import { UsersListWrapper } from '../../modules/apps/user-management/users-list/UsersList'
import AccessControl from './accesscontrol'
import SubUsers from './subUsers'
import { UserMngHeader } from './userMngHeader'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'User Management',
    path: '/userManagement/users',
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

const UserMngPage = () => {
  return (
    <Routes>
       <Route
        element={
          <>
            {/* <UserMngHeader /> */}
            <Outlet />
          </>
        }
      >
        <Route
          path='users'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Users</PageTitle>
              <SubUsers />
            </>
          }
        />
        <Route
          path='accessControl'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Access Control</PageTitle>
              <AccessControl />
            </>
          }
        />
       
        <Route index element={<Navigate to='/userManagement/users' />} />
      </Route>
    </Routes>
  )
}

export default UserMngPage
