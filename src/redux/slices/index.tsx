import { combineReducers } from "@reduxjs/toolkit";

import DefectReport from './defectReport'

const rootReducer = combineReducers({
  defectReport: DefectReport
})
export default rootReducer