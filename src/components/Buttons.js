import {h} from 'preact'
const Buttons = (props) => {
  return (
      <div className="buttons">
        <button className="button" onClick={props.onCancel}>Cancel</button>
        <button className="button primary" onClick={props.onSetting}>Setting</button>
      </div>
  )
}

export default Buttons