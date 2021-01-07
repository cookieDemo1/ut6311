import {h} from 'preact'
import {request, getQuery, isScope, isRequired, isIP, local, validate, isCharacters, isLength} from '../utils'
import Title1 from '../components/Title1'
import Title2 from '../components/Title2'
import Setting from '../components/Setting'
import {useEffect, useState} from "preact/hooks";
import Buttons from "../components/Buttons";
import {route} from "preact-router";

const UserSetting = () => {

  const items = [
    {name: 'Original Password', formKey: 'old_password', type: 'password', rules:[isRequired('Please enter the Original Password')] },
    {name: 'New Password', formKey: 'new_password', type: 'password', rules:[isRequired('Please enter the New Password'), isCharacters(), isLength()] },
    {name: 'Confirm Password', formKey: 'confirm_new_password', type: 'password', rules:[isRequired('Please enter the Confirm Password'),  isCharacters(), isLength()] },
  ]
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: ""
  })

  const [error, setError] = useState({})
  const [info, setInfo] = useState(false)
  useEffect(() => {
    setError({})
    setInfo(false)
  },[form])

  const handleLogout = () => {
    local.remove('Authorization')
    route('/')
  }

  const handleChange = (key,value) => {
    setForm({...form,[key]:value})
  }

  const handleCancel = () => {
    setForm({
      old_password: "",
      new_password: "",
      confirm_new_password: ""
    })
  }

  const handleSetting = () => {
    validate(items,form).then(({isOK,nextError}) => {
      if (isOK) {
        const {old_password, new_password, confirm_new_password} = form
        if (new_password === confirm_new_password){
          const data = {old_password, new_password}
          request({
            method: 'POST',
            path: `/api/login_modify`,
            data: data
          }).then((res) => {
            const { code, message } = res
            if (code === '0'){
              // location.reload()
              setInfo(true)
            }else {
              setError({...error,message})
            }
          }).catch((err) => {
            console.log(err)
          })
        }else {
          setError({...error,message: 'The new password and confirm password are not the same.'})
        }
      }else {
        setError({...error, ...nextError})
      }
    })
  }

  return (
      <>
        <Title1>User Settings</Title1>
        <div class="card">
          <Title2>Logout</Title2>
          <div class="content">
            <div className="setting">
              Log out of current login: <button className="button primary" onClick={handleLogout} style={{marginLeft: 20}}>Logout</button>
            </div>
          </div>
          <Title2>Change Password</Title2>
          <div class="content">
            {
              items.map((item,index) => {
                return (
                    <Setting key={index} item={item} value={form[item.formKey]} error={error[item.formKey]} onChange={handleChange}></Setting>
                )
              })
            }
            {error.message && <div className="error-line">{error.message}</div>}
            {info && <div className="info-line">Password changed successfully.</div>}
          </div>
          <Buttons onCancel={handleCancel} onSetting={handleSetting}></Buttons>
        </div>
      </>
  )

}

export default UserSetting