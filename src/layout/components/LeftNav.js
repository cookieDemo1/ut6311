import { h } from 'preact';
import { Link } from 'preact-router/match';

const LeftNav = () => {
  const links = [
    {path: '/server_setting', name: 'Server Setting'},
    {path: '/port_setting', name: 'Serial Port Settings'},
    {path: '/operation_mode_setting', name: 'Operation Mode Settings'},
    {path: '/system_status', name: 'System Status'},
    {path: '/system_management', name: 'System Management'},
    {path: '/security_setting', name: 'Security Settings'},
    {path: '/user_setting', name: 'User Settings'},
    {path: '/save_setting', name: 'Save Settings'},
  ]
  return (
      <div className="left">
        <nav className="nav">
          {
            links.map((link) => (<Link className="nav-item" activeClassName={'active'} href={link.path}>{link.name}</Link>))
          }
        </nav>
      </div>
  )
};



export default LeftNav;
