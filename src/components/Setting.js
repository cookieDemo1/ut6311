import {h} from 'preact'
import { getKey } from '../utils'


const Setting = ({item, value, error, onChange, autoWidth}) => {

  const handleKeyPress = (e) => {
    if (item.type === 'number'){
      if (!/\d/.test(getKey(e))) {
        e.preventDefault()
      }
    }
  }
  const handleInput = (e) => {
    if (item.type === 'number' ){
      onChange(item.formKey,Number(e.target.value))
      return
    }
    onChange(item.formKey,e.target.value)
  }
  const handleChange = (e) => {
    onChange(item.formKey,Number(e.target.value))
  }
  //default input
  if (item.type === 'select'){
    return (
        <div className="setting">
          <div className={autoWidth?'key key-width': 'key'}>{item.name}:</div>
          <select className="value" value={value} onChange={handleChange}>
            {
              item.options.map((option,index) => {
                return (
                    <option key={index} value={option.value}>{option.name}</option>
                )
              })
            }
          </select>
        </div>
    )
  }else if(item.type === 'radio'){
    return (
        <div className="setting">
          <div className="key">{item.name}:</div>
          <div className="value">
            {
              item.options.map((option,index) => {
                return (
                  <>
                    <input id={option.id} type="radio" value={option.value}  checked={value === option.value} onChange={handleChange}/>
                    <label htmlFor={option.id} style={{marginLeft: 10, marginRight:20}}>{option.name}</label>
                  </>
                )
              })
            }
          </div>
        </div>
    )
  }else if(item.type === 'checkbox'){
    return (
        <div className="setting">
          <div className="key">{item.name}:</div>
          <div className="value">
            {value === 0 ? <input type="checkbox" value={1} checked={false} onChange={handleChange}/>: <input type="checkbox" value={0} checked={true} onChange={handleChange}/>}
          </div>
        </div>
    )
  }
  return (
      <div className="setting">
        <div className="key">{item.name}:</div>
        <input className="value" disabled={item.disable} value={value} type={(item.type === 'text' || item.type === 'number')?'text':item.type}  onInput={handleInput} onKeyPress={handleKeyPress}/><span style={{marginLeft: 5}} >{item.note}</span><div className="error">{error}</div>
      </div>
  )
}

export default Setting