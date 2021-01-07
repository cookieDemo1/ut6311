import {h} from 'preact'
import { getKey } from '../utils'


const RemoteSetting = ({item, value, error=[], onChange}) => {

  const handleKeyPress = (e) => {
    if (e.target.type === 'number'){
      if (!/\d/.test(getKey(e))) {
        e.preventDefault()
      }
    }
  }

  const handleInput = (index, subkey, e) => {
    if (e.target.type === 'number'){
      onChange(item.formKey, index, subkey, Number(e.target.value))
    }
    onChange(item.formKey, index, subkey, e.target.value)
  }

  return (
      <>
        <div className="remote-setting">
          <div  className="remote-ip">Remote IP</div>
          <div  className="remote-port">Remote Port</div>
        </div>
        {
          item.options.map((option,index) => {
            const {ip, port}  = value[index]
            const {ipError, portError}  = error[index] || {}
            return (
                <>
                  <div className="setting">
                    <div className="key">{option.name}:</div>
                    <input className="value" type='text' value={ip} onInput={handleInput.bind(undefined,index,'ip')} />
                    <input className="value" type='text' value={port} onInput={handleInput.bind(undefined,index,'port')} onKeyPress={handleKeyPress} /><span style={{marginLeft: 5}}>(0-65534)</span>
                  </div>
                  <div className="error-line">
                    <div  className="error-remote-ip">{ipError}</div>
                    <div  className="error-remote-port">{portError}</div>
                  </div>
                </>
            )
          })
        }
      </>

  )
}

export default RemoteSetting