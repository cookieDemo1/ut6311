import {h} from 'preact'

const Table = ({children}) => {



  return (
      <table cellSpacing="0" cellPadding="6">
        <tr className="td_title">
          <td width="8%" className="td_title" name="sort" id="sort">Sort</td>
          <td width="15%" className="td_title" name="ipAddress" id="ipAddress">IP Address</td>
          <td width="15%" className="td_title" name="subnetMask" id="subnetMask">Subnet Mask</td>
          <td width="15%" className="td_title" name="filesRule" id="filesRule">Files Rule</td>
          <td width="15%" className="td_title" name="operation" id="operation">Operation</td>
          <td width="15%" className="td_title" name="serailPort" id="serailPort">Serail Port</td>
          <td width="15%" className="td_title" name="status" id="status">Status</td>
        </tr>
        <tr>
          <td className="td_content">1</td>
          <td className="td_content">2</td>
          <td className="td_content">3</td>
          <td>
            <select className="td_content">
              <option>Allow</option>
              <option></option>
            </select>
          </td>
          <td>
            <select className="td_content">
              <option>all</option>
              <option>read</option>
              <option>write</option>
            </select>
          </td>
          <td>
            <select className="td_content">
              <option>9001</option>
              <option>9001</option>
            </select>

          </td>
          <td>
            <select className="td_content">
              <option>Disabled</option>
              <option>Enabled</option>
            </select>
          </td>
        </tr>
      </table>
  )
}

export default Table