import {h} from 'preact'
import {useEffect, useState} from "preact/hooks";
import {getQuery, isIP, isRequired, local, request, validate} from "../utils";

const Login = ({onLogin}) => {

  const items = [
    {name: 'User', formKey: 'user', rules:[isRequired('Please enter the User Name')] },
    {name: 'Password', formKey: 'password', rules:[isRequired('Please enter the Password')]},
  ]
  const [form, setForm] = useState({
    user: '',
    password: '',
  })
  const [error, setError] = useState('')
  useEffect(() => {
    setError('')
  },[form])


  const handleUser = (e) => {
    const nextForm = {...form,user: e.target.value}
    setForm(nextForm)
  }
  const handlePassword = (e) => {
    const nextForm = {...form,password: e.target.value}
    setForm(nextForm)
  }

  const handleLogin = () => {
    validate(items,form).then(({isOK,nextError}) => {
      if (isOK) {
        const data = {...form}
        request({
          method: 'POST',
          path: `/api/login`,
          data: data
        }).then((res) => {
          const { code, message } = res
          if (code === '0'){
            local.set('Authorization', res.data.token || '')
            onLogin()
          }else {
            setError('Incorrect user name or password')
          }
        }).catch((err) => {
          console.log(err)
        })
      }else {
        setError(Object.values(nextError)[0])
      }
    })
  }

  return (
      <div className="login">
        <div className="login-area">
          <div className="login-content">
            <div className="login-item">
              <div className="user"></div>
              <input placeholder="user" className="login-input" type='text' onInput={handleUser}  value={form.user} />
            </div>
            <div className="login-item">
              <div className="password"></div>
              <input placeholder="password" className="login-input" type='password' onInput={handlePassword}  value={form.password} />
            </div>
            <button className="button primary login-button" onClick={handleLogin}>Login</button>
            <div className="login-error">{error}</div>
          </div>
        </div>
        <div className="login-footer">
          ©{new Date().getFullYear()} UTEK Technology Co., Ltd All rights reserved.
        </div>

    </div>
  )
}


export default Login