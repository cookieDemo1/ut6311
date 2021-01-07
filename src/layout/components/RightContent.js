import { h } from 'preact';
import { Router } from 'preact-router';
import ServerSetting from '../../routes/ServerSetting';
import SerialportSetting from '../../routes/SerialportSetting';
import OperationmodeSetting from '../../routes/OperationmodeSetting';
import SystemStatus from '../../routes/SystemStatus';
import SystemManagement from '../../routes/SystemManagement';
import SecuritySetting from '../../routes/SecuritySetting';
import UserSetting from '../../routes/UserSetting';
import SaveSetting from '../../routes/SaveSetting';
import Redirect from '../../routes/Redirect';


const RightContent = ({onRouteChange}) => {
  const routes = [
    {path: '/server_setting', component: ServerSetting},
    {path: '/port_setting', component: SerialportSetting},
    {path: '/operation_mode_setting', component: OperationmodeSetting},
    {path: '/system_status', component: SystemStatus},
    {path: '/system_management', component: SystemManagement},
    {path: '/security_setting', component: SecuritySetting},
    {path: '/user_setting', component: UserSetting},
    {path: '/save_setting', component: SaveSetting},
  ]

  return (
      <div className="right">
        <Router onChange={onRouteChange}>
          {
            routes.map((route) => {
              const {component:MyComponent, path } = route
              return (
                <MyComponent path={path}></MyComponent>
              )
            })
          }
          <Redirect path="/" to="/server_setting" />
        </Router>
      </div>
    )
}


export default RightContent;
