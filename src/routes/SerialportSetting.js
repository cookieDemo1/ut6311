import {request,validate,isRequired,isIP,isScope} from '../utils'
import Title1 from '../components/Title1'
import Title2 from '../components/Title2'
import Setting from '../components/Setting'
import Buttons from '../components/Buttons'
import {useEffect, useState} from "preact/hooks";

const SerialportSetting = () => {
  const serialPort = {name: 'Serial Port', formKey: 'port', type: 'radio', options:[{id:'port1', value: 0, name: '1'}]}
  const RS232 = {
    name: 'Interface', formKey: 'interface', type: 'select', options: [{name: 'RS232', value: 0}]
  }
  const RS485 = {
    name: 'Interface', formKey: 'interface', type: 'select', options: [{name: 'RS485/422', value: 1}]
  }
  const others = [
    {name: 'Baud Rate', formKey: 'baudrate', type: 'select', options: [
      {name: '300', value: 300},{name: '600', value: 600},{name: '1200', value: 1200},
      {name: '2400', value: 2400},{name: '4800', value: 4800},{name: '9600', value: 9600},
      {name: '19200', value: 19200},{name: '38400', value: 38400},{name: '57600', value: 57600},{name: '115200', value: 115200},
      {name: '230400', value: 230400},{name: '460800', value: 460800},{name: '921600', value: 921600},
    ]},
    {name: 'Data Bits', formKey: 'databits', type: 'select', options: [
      {name: '5', value: 5},{name: '6', value: 6},{name: '7', value: 7},{name: '8', value: 8}
    ]},
    {name: 'Stop Bits', formKey: 'stopbits', type: 'select', options: [
      {name: '1', value: 0},{name: '1.5', value: 1},{name: '2', value: 2}
    ]},
    {name: 'Parity', formKey: 'parity', type: 'select', options: [
      {name: 'None', value: 0},{name: 'Odd', value: 1},{name: 'Even', value: 2}
    ]},
    {name: 'Flow Control', formKey: 'flow', type: 'select', options: [
      {name: 'None', value: 0},{name: 'CTS/RTS', value: 1}
    ]},
    {name: 'Interval Time', formKey: 'interval_time', type: 'number',  note: '(0-5000ms)', rules:[isScope(0,5000)]},
    {name: 'Frame Length', formKey: 'frame_length', type: 'number', note: '(0-1024Byte)', rules:[isScope(0,1024)]},
    {name: 'Transmit Delay', formKey: 'transmit_delay', type: 'number', note: '(0-5000ms)', rules:[isScope(0,5000)]},
  ]

  const modes = {
    0: [RS232,...others],
    1: [RS485,...others]
  }
  const [items, setItems] = useState([])

  const [form, setForm] = useState({
    port: 0,
    interface: 0,
    baudrate: 115200 ,
    databits: 8,
    stopbits: 0,
    parity: 0,
    flow: 0,
    interval_time: "",  // "0" disable, "1" enable
    frame_length: "",
    transmit_delay: "",  // "0" disable, "1" enable
  })

  const [error, setError] = useState({})
  const [info, setInfo] = useState(false)
  useEffect(() => {
    setError({})
    setInfo(false)
  },[form])

  useEffect(() => {
    getPortInfo()
  },[form.port])

  const handleChange = (key,value) => {
    setForm({...form,[key]:value})
  }

  const handleCancel = () => {
    getPortInfo()
  }

  const handleSetting = () => {
    const { port, ...rest } = form
    validate(items,rest).then(({isOK,nextError}) => {
      if (isOK) {
        const data = { ...rest }
        request({
          method: 'POST',
          path: `/api/port?port=${port}`,
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

  const getPortInfo = () => {
    const {port} = form
    request({
      method: 'GET',
      path: `/api/port?port=${port}`,
    }).then((res) => {
      const { interface: type = 0 } = res.data
      setItems(modes[type])
      setForm({...form, ...res.data})
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
      <>
        <Title1>Serial Port Settings</Title1>
        <div class="card">
          <Title2>Serial Port</Title2>
          <Setting item={serialPort} value={form[serialPort.formKey]} onChange={handleChange}></Setting>
          <Title2>Serial Port Parameters</Title2>
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

export default SerialportSetting
