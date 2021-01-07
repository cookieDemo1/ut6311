import {h} from 'preact'
import {request,getQuery} from '../utils'
import Title1 from '../components/Title1'
import Title2 from '../components/Title2'
import {useEffect, useState} from "preact/hooks";


const SystemManagement = () => {

  const [systemInfo, setSystemInfo] = useState({
    firmware_version:'--',
    hardware_version:'--',
  })

  useEffect(() => {
    getSystemInfo()
  },[])

  const handleFactoryDefault = () => {
    request({
      method: 'POST',
      path: '/api/system_resetting',
    }).then((res) => {
      const { code, message} = res
      if (code === '0'){
        alert("Factory Default loaded successfully")
      }else {
        alert("Factory Default failed to load")
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const getSystemInfo = () => {
    request({
      method: 'GET',
      path: '/api/system_info',
    }).then((res) => {
      setSystemInfo({...systemInfo,...res.data})
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
      <>
        <Title1>System management</Title1>
        <div class="card">
          <Title2>System Information</Title2>
          <div class="content">
            <div className="setting">
              <div className="key">Firmware Version:</div>
              <div className="value">{systemInfo.firmware_version}</div>
            </div>
            <div className="setting">
              <div className="key">Hardware Version:</div>
              <div className="value">{systemInfo.hardware_version}</div>
            </div>
          </div>
          <Title2>Load Factory Default</Title2>
          <div class="content">
            <div className="setting">
              Load Factory Default settings: <button className="button primary" onClick={handleFactoryDefault} style={{marginLeft: 20}}>Load Factory Default</button>
            </div>
          </div>
        </div>
      </>
  )
}

export default SystemManagement