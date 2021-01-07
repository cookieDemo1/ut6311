import {request,validate,isRequired,isIP,isScope} from '../utils'
import Title1 from '../components/Title1'
import Title2 from '../components/Title2'
import Setting from '../components/Setting'
import Buttons from '../components/Buttons'
import {useEffect, useState} from "preact/hooks";

const ServerSetting = () => {
  const [items, setItems] = useState([
    {name: 'Server Name', formKey: 'name', disable: true },
    {name: 'IP Address', formKey: 'ip', disable: false, rules:[isRequired('Please enter the IP Address'),isIP()]},
    {name: 'Subnet Mask', formKey: 'masknet', disable: false, rules:[isRequired('Please enter the Subnet Mask'),isIP()]},
    {name: 'Gateway', formKey: 'gateway', disable: false, rules:[isRequired('Please enter the Gateway'),isIP()]},
    {name: 'DNS Server1', formKey: 'dns1', disable: false, rules:[isRequired('Please enter the DNS Server1'),isIP()]},
    {name: 'DNS Server2', formKey: 'dns2', disable: false, rules:[isRequired('Please enter the DNS Server2'),isIP()]},
    {name: 'DHCP', formKey: 'dhcp', type: 'select', options: [{name: 'Disabled', value: 0},{name: 'Enabled', value: 1}]},
  ])
  const [form, setForm] = useState({
    name: "",
    ip: "",
    masknet: "",
    gateway: "",
    dns1: "",
    dns2: "",
    dhcp: "",
  })
  const [error, setError] = useState({})
  const [info, setInfo] = useState(false)
  useEffect(() => {
    setError({})
    setInfo(false)
  },[form])

  useEffect(() => {
    getSeverInfo()
  },[])

  const handleChange = (key,value) => {
    setForm({...form,[key]:value})
  }

  const handleCancel = () => {
    getSeverInfo()
  }

  const handleSetting = () => {
    validate(items,form).then(({isOK,nextError}) => {
      if (isOK) {
        const data = { ...form }
        request({
          method: 'POST',
          path: '/api/server',
          data: data
        }).then((res) => {
          const { code, message} = res
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
        setError({...error, ...nextError})
      }
    })
  }

  const getSeverInfo = () => {
    request({
      method: 'GET',
      path: '/api/server',
    }).then((res) => {
      const {dhcp} = res.data
      const lastIndex = items.length - 1
      //dhcp enable, other disable
      const disable = dhcp === 1
      const nextItems = items.map((item,index) => {
        if (index === 0 || index === lastIndex){
          return {...item}
        }
        return {...item, disable}
      })
      setItems(nextItems)
      setForm({...form, ...res.data})
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
      <>                                {/* 空标签是用来当做根标签的 */}
        <Title1>Server Settings</Title1>
        <div class="card">
          <Title2>Server Parameters</Title2>
          <div class="content">
            {
              items.map((item,index) => {
                return (
                  <Setting key={index} item={item} value={form[item.formKey]} error={error[item.formKey]} onChange={handleChange}></Setting>
                )
              })
            }
            {error.message && <div className="error-line">{error.message}</div>}
            {info && <div className="info-line">The setup is successful. Please check all Settings and <span style={{color:'red',margin:'0 10px',fontWeight:'bold'}}> restart</span> the device to take effect.</div>}
          </div>
          <Buttons onCancel={handleCancel} onSetting={handleSetting}></Buttons>
      </div>
    </>
  )
}

export default  ServerSetting