import {h} from 'preact'
import { route } from 'preact-router'
import {local, request} from '../utils'
import Title1 from "../components/Title1";
import Title2 from "../components/Title2";

const SaveSetting = () => {



  const handleRestart = () => {
    request({
      method: 'POST',
      path: '/api/system_restart',
    }).then((res) => {
      const { code, message} = res
      if (code === '0'){
        alert("System restart successfully")
      }else {
        alert("System restart failed")
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
      <>
        <Title1>Save Setting</Title1>
        <div class="card">
          <Title2>Save And Restart</Title2>
          <div class="content">
            <div className="setting">
              Please check all Settings and press the <span style={{color:'red',margin:'0 10px',fontWeight:'bold'}}> restart</span> button to take effect <button className="button primary" onClick={handleRestart}  style={{marginLeft: 20}}>Restart</button>
            </div>
          </div>
        </div>
      </>
  )
}


export default  SaveSetting