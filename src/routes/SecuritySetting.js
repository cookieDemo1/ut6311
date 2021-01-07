import {h} from 'preact'
import {request,getQuery} from '../utils'
import Title1 from '../components/Title1'
import Title2 from '../components/Title2'
import Setting from '../components/Setting'
import RemoteSetting from '../components/RemoteSetting'
import Buttons from '../components/Buttons'
import {useEffect, useState} from "preact/hooks";

const SecuritySetting = () => {
  const address = {name: 'Address', formKey: 'address', type: 'select', options: [{name: 'IP Address Filter', value: 0},{name: 'MAC Address Filter', value: 1}]}
  const [form, setForm] = useState({
    address: 0,
  })

  const tableType = {
    0: [
      {name: "Sort", tableKey: 'sort'},
      {name: "IP Address", tableKey: 'ip_address'},
      {name: "Subnet Mask", tableKey: 'subnet_mask'},
      {name: "Files Rule", tableKey: 'files_rule'},
      {name: "Operation", tableKey: 'operation'},
      {name: "Serail Port", tableKey: 'serial_port'},
      {name: "Status", tableKey: 'status'},
    ],
    1: [
      {name: "sort", tableKey: 'sort'},
      {name: "MacIpaddress", tableKey: 'mac_ip_address'},
      {name: "Status", tableKey: 'status'},
    ],
  }
  const [items, setItems] = useState(tableType[form.address])
  const [table, setTable] = useState( [])
      // [{sort:11,ip_address:1,subnet_mask:1,files_rule:1,operation:1,serial_port: 1,status:1}]

  useEffect(() => {
    getSecuritySetting()
  },[form.address])

  const handleChange = (key,value) => {
    const nextForm = {...form,[key]:value}
    setForm(nextForm)
    setItems(tableType[nextForm.address])
  }

  const getSecuritySetting = () => {
    const {address} = form
    request({
      method: 'GET',
      path: `/api/security_setting?address=${address}`,
    }).then((res) => {
      let table = res.data.list
      setTable(table)
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
      <>
        <Title1>Security Settings</Title1>
        <div class="card">
          <Title2>Security Filter Settings</Title2>
          <div class="content">
            <Setting item={address} value={form[address]} autoWidth={true} onChange={handleChange}></Setting>
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

export default SecuritySetting