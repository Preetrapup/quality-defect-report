'use client'

import { useAppSelector } from '@/hooks/redux';
import './detail.css'

function Detail() {
  // global states
  const { detail }: any = useAppSelector(state => state.defectReport);
  console.log(detail, "detail")

  return (
    <div className="container">
      <header className="header">
        <h1>Quality Defect Report</h1>
        <button onClick={() => window.print()}>Export to PDF</button>
      </header>
      <section className="info-section">
        <div className="info">
          <p className="label">Job ID</p>
          <p className="value">{detail?.JobID}</p>
        </div>
        <div className="info">
          <p className="label">Part Number (P/N)</p>
          <p className="value">{detail?.pn}</p>
        </div>
        <div className="info">
          <p className="label">Customer Name</p>
          <p className="value">{detail?.customerName}</p>
        </div>
        <div className="info">
          <p className="label">Part Description</p>
          <p className="value">{detail?.partDescription}</p>
        </div>
        <div className="info">
          <p className="label">Customer PO No</p>
          <p className="value">{detail?.cpo}</p>
        </div>
        <div className="info">
          <p className="label">Serial No. (S/N)</p>
          <p className="value">{detail.sn}</p>
        </div>
        <div className="info">
          <p className="label">Date</p>
          <p className="value">{detail?.date}</p>
        </div>
      </section>
      <section className="report-section">
        <div className="report-item">
          <p className="label">Problem Statement</p>
          <p className="value">The widget does not rotate properly.</p>
        </div>
        <div className="report-item">
          <p className="label">Problem Description</p>
          <p className="value">Upon inspection, the gear teeth are worn out.</p>
        </div>
      </section>
      <section className="image-section">
        <p className="label">Images</p>
        <div className="image-container">
          {/* <!-- Example of how images will be rendered --> */}
          {detail?.partImages?.map((item: any, ind: any) => {
            return (
              <img src={item} key={ind} alt={`Snapshot`} height='100%' width="100%" />
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Detail