'use client'

export default function Home() {
  return (
    <>
      <div className="header" suppressHydrationWarning>
        <h1>QUALITY DEFECT REPORT</h1>
      </div>
      <div className="search">
        Search - QDR / P.No / Part Number / Job ID
      </div>
      <table>
        <tr>
          <th>QDR No.</th>
          <th>Date</th>
          <th>P/N</th>
          <th>Job ID</th>
          <th>Customer Name</th>
          <th>Problem Statement</th>
          <th className="edit"></th>
        </tr>
        <tr>
          <td>1</td>
          <td>20/01/2024</td>
          <td>127689</td>
          <td>AM13495820</td>
          <td>ABC</td>
          <td>The corner of the part is dented</td>
          <td className="edit">
            {/* <img src="pencil_icon.png" alt="Edit" /> */}
            </td>
        </tr>
      </table>
      <button className="button">For Manager</button>
    </>
  );
}
