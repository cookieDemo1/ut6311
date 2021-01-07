import {h} from 'preact'
import {request,getQuery,validate,isRequired,isIP,isScope, isRemoteIP} from '../utils'
import Title1 from '../components/Title1'
import Title2 from '../components/Title2'
import Setting from '../components/Setting'
import RemoteSetting from '../components/RemoteSetting'
import Buttons from '../components/Buttons'
import {useEffect, useState} from "preact/hooks";


const OperationModeSetting = () => {
  const serialPort = {name: 'Serial Port', formKey: 'port', type: 'radio', options:[{id:'port1', value: 0, name: '1'}]}
  const connectMode = {name: 'Connect Mode', formKey: 'conn_mode', type: 'select', options: [{name: 'VCOM', value: 0},{name: 'DataSocket', value: 1},{name: 'Modbus', value: 2},{name: 'MQTT', value: 3},{name: 'MCP', value: 4}] }
  const tcpType = {name: 'Tcp Type', formKey: 'tcp_type', type: 'select', options: [{name: 'TCP Server Mode', value: 0},{name: 'TCP Client Mode', value: 1},{name: 'UDP Client Mode', value: 2}]}
  const modbusTcpType = {name: 'Tcp Type', formKey: 'tcp_type', type: 'select', options: [{name: 'TCP Server Mode', value: 0},{name: 'TCP Client Mode', value: 1}]}
  const keepAlive = {name: 'Keep Alive', formKey: 'keep_alive', type: 'number', note: '(s)',}
  const connectNum = {name: 'Connect Num', formKey: 'conn_num', type: 'number', note: '(1-6)', rules:[isScope(1,6)]}
  const localPort = {name: 'Local Port', formKey: 'local_port', type: 'number', note: '(0-65534)', rules:[isScope(0,65534)]}
  const remoteIP = {name: 'Remote IP', formKey: 'remote_ip', options: [{name: 'Remote IP1'},{name: 'Remote IP2'},{name: 'Remote IP3'},{name: 'Remote IP4'},{name: 'Remote IP5'},{name: 'Remote IP6'}],rules:[isRemoteIP()]}
  const mqttEnable = {name: 'MQTT Enable', formKey: 'mqtt_enable', type: 'checkbox'}
  const serverAddress = {name: 'Server Address', formKey: 'server_address'}
  const serverPort = {name: 'Server Port', formKey: 'server_port', type: 'number' }
  const mqttUsername = {name: 'MQTT Username', formKey: 'mqtt_username'}
  const mqttPassword = {name: 'MQTT Password', formKey: 'mqtt_password'}
  const upClientID = {name: 'Up Client ID', formKey: 'up_clientid'}
  const upTopic = {name: 'Up Topic', formKey: 'up_topic'}
  const downClientID = {name: 'Down Client ID', formKey: 'down_clientid'}
  const downTopic = {name: 'Down Topic', formKey: 'down_topic'}
  const dataPort = {name: 'Data Port', formKey: 'data_port', type: 'number', disable: true }
  const commandPort = {name: 'Command Port', formKey: 'command_port', type: 'number', disable: true}
  const modes = {
    0: { 0: [connectMode,keepAlive,dataPort,commandPort],},
    1: { 0: [connectMode,tcpType,connectNum,localPort,keepAlive], 1: [connectMode,tcpType,connectNum,remoteIP], 2: [connectMode,tcpType,connectNum,remoteIP],},
    2: { 0: [connectMode,modbusTcpType,connectNum,localPort,keepAlive], 1: [connectMode,modbusTcpType,connectNum,remoteIP]},
    3: { 0: [connectMode,mqttEnable,serverAddress,serverPort,mqttUsername,mqttPassword,upClientID,upTopic,downClientID,downTopic],},
    4: { 0: [connectMode,keepAlive,dataPort,commandPort],},
  }

  const [form, setForm] = useState({
    port: 0,
    conn_mode: 0,
    keep_alive: "",
    conn_num: "",
    // port: 0,
    // conn_mode: 1,
    // conn_num: 4,
    // remote_ip: [{ip: "172.16.14.54", port: 10010},{ip: "172.16.14.54", port: 10010},{ip: "172.16.14.54", port: 10010},{ip: "172.16.14.54", port: 10010},{ip: "172.16.14.54", port: 10010},{ip: "172.16.14.54", port: 10010},],
    // tcp_life_time: 100,
    // tcp_type: 1,
  })
  const [query, setQuery] = useState({port: form.port})
  const [items, setItems] = useState(modes[0][0])

  const [error, setError] = useState({})
  const [info, setInfo] = useState(false)
  useEffect(() => {
    setError({})
    setInfo(false)
  },[form])

  useEffect(() => {
    getModeInfo()
  },[query])


  const handleRemoteChange = (key, index, subkey, value)  => {
    const remote_ip = form[key] || []
    remote_ip[index][subkey] = value
    const nextForm = {...form, remote_ip}
    setForm(nextForm)
  }

  const handleChange = (key,value) => {
    const nextForm = {...form,[key]:value}
    const { port, conn_mode = 0, tcp_type = 0 } = nextForm
    if (key === 'port'){
      setQuery({port})
    }else if (key === 'conn_mode'){
      setQuery({port, conn_mode})
    }else if (key === 'tcp_type'){
      setQuery({port, conn_mode, tcp_type })
    }
    setForm(nextForm)
  }

  const handleCancel = () => {
    getModeInfo()
  }

  const handleSetting = () => {
    const { port, ...rest } = form
    validate(items,rest).then(({isOK,nextError}) => {
      if (isOK) {
        const data = { ...rest }
        request({
          method: 'POST',
          path: `/api/mode?port=${port}`,
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

  const getModeInfo = () => {
    const {port} = query
    request({
      method: 'GET',
      path: `/api/mode?${getQuery(query)}`,
    }).then((res) => {
      const { conn_mode = 0, tcp_type = 0 } = res.data
      setItems(modes[conn_mode][tcp_type])
      setForm({...res.data,port})
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <>
      <Title1>Operation Mode Settings</Title1>
      <div class="card">
        <Title2>Serial Port</Title2>
        <Setting item={serialPort} value={form[serialPort.formKey]} onChange={handleChange}></Setting>
        <Title2>Operation mode Parameters</Title2>
        <div class="content">
          {
            items.map((item,index) => {
              if (item.name === 'Remote IP'){
                return <RemoteSetting key={index} item={item} value={form[item.formKey]} error={error[item.formKey]} onChange={handleRemoteChange}></RemoteSetting>
              }
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


export default OperationModeSetting