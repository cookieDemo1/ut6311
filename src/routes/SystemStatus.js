import {h} from 'preact'
import {request,getQuery} from '../utils'
import Title1 from '../components/Title1'
import Title2 from '../components/Title2'
import Setting from '../components/Setting'
import {useEffect, useState} from "preact/hooks";

const SystemStatus = () => {
  const status = {name: 'Status', formKey: 'status', type: 'select', options: [{name: 'TCP Status', value: 0},{name: 'UDP Status', value: 1},{name: 'Serial Port Status', value: 2}]}
  const [form, setForm] = useState({
    status: 0,
  })

  const tableType = {
    0: [
      {name: "Type", tableKey: 'type'},
      {name: "Local IP", tableKey: 'local_ip'},
      {name: "Remote IP", tableKey: 'remote_ip'},
      {name: "Local Port", tableKey: 'local_port'},
      {name: "Remote Port", tableKey: 'remote_port'},
      {name: "Snd_nxt", tableKey: 'snd_nxt'},
      {name: "Rcv_nxt", tableKey: 'rcv_nxt'},
      {name: "Status", tableKey: 'status'},
    ],
    1: [
      {name: "Local IP", tableKey: 'local_ip'},
      {name: "Remote IP", tableKey: 'remote_ip'},
      {name: "Local Port", tableKey: 'local_port'},
      {name: "Remote Port", tableKey: 'remote_port'},
    ],
    2: [
      {name: "Ser", tableKey: 'ser'},
      {name: "Total RX", tableKey: 'total_rx'},
      {name: "Total Tx", tableKey: 'total_tx'},
      {name: "RTS", tableKey: 'rts'},
      {name: "CTS", tableKey: 'cts'},
      {name: "DTR", tableKey: 'dtr'},
      {name: "DSR", tableKey: 'dsr'},
      {name: "CD", tableKey: 'cd'},
      {name: "RI", tableKey: 'ri'},
    ],
  }
  const [items, setItems] = useState(tableType[form.status])
  const [table, setTable] = useState(
  []
  // [{type:11,local_ip:1,remote_ip:1,local_port:1,remote_port:1,snd_nxt: 1,rcv_nxt:1,status:1}]
  )


  useEffect(() => {
    getSeverStatus()
  },[form.status])

  const handleChange = (key,value) => {
    const nextForm = {...form,[key]:value}
    setForm(nextForm)
    setItems(tableType[nextForm.status])
  }

  const getSeverStatus = () => {
    const {status} = form
    request({
      method: 'GET',
      path: `/api/system_status?status=${status}`,
    }).then((res) => {
       let table = res.data.list || []
       setTable(table)
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
      <>
        <Title1>System Status</Title1>
        <div class="card">
          <Title2>Device Status Display</Title2>
          <div class="content">
            <Setting item={status} value={form[status]} autoWidth={true} onChange={handleChange}></Setting>
            <table className='table' border="0"  cellSpacing="0" cellPadding="8">
              <tr className="table-title">
                {
                  items.map((item,index) => {
                    return (
                        <th key={index} width={100/items.length + '%'} name={item.tableKey}>{item.name}</th>
                    )
                  })
                }
              </tr>
              {
                !!table.length && table.map((row,index) => {
                  return (
                      <tr className="table-content">
                        {
                          items.map((item,index) => {
                            const tableKey = item.tableKey
                            return (
                                <td key={index}>{row[tableKey]}</td>
                            )
                          })
                        }
                      </tr>
                  )
                })
              }
            </table>
            {!table.length && (<div className="table-empty">No Data</div>)}
          </div>
        </div>
      </>
  )

}
export default SystemStatus