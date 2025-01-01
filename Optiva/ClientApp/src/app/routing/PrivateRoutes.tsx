import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import Dashboard from '../pages/dashboard/Dashboard'
import Reports from '../pages/reports/reports'
import TaskList from '../pages/tasks/tasklist'
import UserManagement from '../pages/userManagement/userManagement'
import UserMngPage from '../pages/userManagement/UserManagementPage'
import Taskview from '../pages/tasks/taskview';
import Task  from '../pages/tasks/tasklist';
import BusinessDashboard from '../pages/dashboard/BusinessDashboard'
import ConsoleLogs from '../pages/consoleLogs/consoleLogs'
import CannedRequest from '../pages/cannedRequest/cannedRequest'
import PersonalInfo from '../pages/profile/PersonalInfo'
import RFP from '../pages/rfp/rfp'
const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../pages/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'));
  const AccountSettings = lazy(() => import('../pages/accounts/accountsettings'));
  const UserManagement =lazy(() => import('../pages/userManagement/userManagement'));

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='/home/*' element={<Navigate to='/home/dashboard' />} />
        <Route path='/home/ConsoleLogs' element={<ConsoleLogs/>} />
        <Route path='/home/CannedRequest' element={<CannedRequest/>} />
        <Route path='/home/rfpchat' element={<RFP/>} />
        {/* Pages */}
        {/* <Route path='dashboard' element={<DashboardWrapper />} /> */}
        <Route path='/home/dashboard' element={<DashboardWrapper />} />
        <Route path='/home/business' element={<BusinessDashboard />} />
         <Route path='/home/tasks' element={<Task />} />
         <Route path='/home/taskView' element={<Taskview />}/>
        <Route path='/home/reports' element={<Reports />} />
        <Route path='pages/profile/personalInfo' element={<PersonalInfo />} />
        
        <Route
          path='builder'
          element={
            <SuspensedView>
              <BuilderPageWrapper />
            </SuspensedView>
          }
        />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='pages/profile/*'
          element={
            <SuspensedView>
             <PersonalInfo />
            </SuspensedView>
          }
        />
        <Route
          path='pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='account/*'
          element={
            <SuspensedView>
               <AccountPage />
              {/* <AccountSettings /> */}
            </SuspensedView>
          }
        />
         <Route
          path='userManagement/*'
          element={
            <SuspensedView>
             <UserMngPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
       
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
