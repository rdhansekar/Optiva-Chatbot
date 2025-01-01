import React from 'react'
import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Overview} from './components/Overview'
import {Settings} from './components/settings/Settings'
import {AccountHeader} from './AccountHeader'
import Branding from './branding'
import SSO from './sso'
import Categories from './categories'
import Department from './department'
import Region from './region'
import Subscription from './subscription'

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: 'Account',
    path: '/account/overview',
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

const AccountPage: React.FC = () => {
  return (
    <Routes>
      <Route
        element={
          <>
            <AccountHeader />
            <Outlet />
          </>
        }
      >
        <Route
          path='branding'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Branding</PageTitle>
              <Branding />
            </>
          }
        />
        <Route
          path='activeDirectory'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Active Directory</PageTitle>
              <SSO />
            </>
          }
        />
        <Route
          path='categories'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Categories</PageTitle>
              <Categories />
            </>
          }
        />
        <Route
          path='departments'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Departments</PageTitle>
              <Department />
            </>
          }
        />
         <Route
          path='region'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Region</PageTitle>
              <Region />
            </>
          }
        />
        <Route
          path='subscription'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Subscription</PageTitle>
              <Subscription />
            </>
          }
        />
        <Route index element={<Navigate to='/account/branding' />} />
      </Route>
    </Routes>
  )
}

export default AccountPage
