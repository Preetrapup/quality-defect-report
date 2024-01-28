'use client'

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setDefectEditDetail, setDetail } from "@/redux/slices/defectReport";
import { useRouter } from "next/navigation";

export default function Home() {
  // use hooks
  const router = useRouter();
  const dispatch = useAppDispatch()

  // global states
  const { listHeader, list } = useAppSelector(state => state?.defectReport)

  return (

    <div className="container">
      <header>
        <h1>QUALITY DEFECT REPORT</h1>
        <input type="search" id="search" name="q" placeholder="Search – QDR / PO no / Part Number / Job ID" />
      </header>
      <table>
        {/* - - table header - - - - -  */}
        <thead>
          <tr>
            {listHeader?.map((item) => {
              return (
                <th key={item?.id}>{item?.label}</th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {
            list?.map((item, index) => {
              return (
                <tr key={item?.id}>
                  <td>{index + 1}</td>
                  <td>{item?.date}</td>
                  <td>{item?.pn}</td>
                  <td>{item?.JobID}</td>
                  <td>{item?.customerName}</td>
                  <td>{item?.problemStatement}</td>
                  <td>
                    <button type="button" style={{ margin: '2px' }}
                      onClick={() => { dispatch(setDefectEditDetail(item)); router?.push('/create-defect') }} >Edit</button>
                    <button type="button" style={{ margin: '2px' }}
                      onClick={() => { dispatch(setDetail(item)); router?.push('/detail') }}
                    >Detail</button>
                  </td>
                </tr>
              )
            })
          }

          {/* <!-- More rows can be added here --> */}
        </tbody>
      </table>
      <footer>
        <button type="button" onClick={() => { dispatch(setDefectEditDetail(null));; router?.push('/create-defect') }} className="manager-btn">Create Defect Report</button>
      </footer>
    </div>

  );
}
