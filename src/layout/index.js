import {h} from 'preact'
import Header from './components/Header'
import LeftNav from './components/LeftNav'
import RightContent from './components/RightContent'
import Login from './Login'
import {useState} from "preact/hooks";
import {local} from '../utils'


const Home = () => {
  const [isLogin, setIsLogin] = useState(!!local.get('Authorization'))


  //登录失效
  const handleRouteChange = (e) => {
    const nextIsLogin = !!local.get('Authorization')
    if (nextIsLogin !== isLogin){
      setIsLogin(nextIsLogin)
    }
  }

  //登录成功
  const handleLogin = () => {
    setIsLogin(true)
  }


  return (
    <div className="home">
      <Header></Header>
      {
        isLogin ?(
          <div className="container">
            <LeftNav></LeftNav>
            <RightContent onRouteChange={handleRouteChange}></RightContent>
          </div>
        ):(
          <Login onLogin={handleLogin}></Login>
        )
      }
    </div>
  )
}


export default Home