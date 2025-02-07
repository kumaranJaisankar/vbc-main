import { call, put, takeLatest } from 'redux-saga/effects'
import { getDashboardNetwork, getDashboardLead,
  getDashboardCustomer,
  getDashboardCustomerByDate,
  getDashboardTicket,
  getDashboardPaymentByDate
} from '../../api';

import {
  GET_DASHBOARD_NETWORK_INFO,
  GET_DASHBOARD_LEAD_INFO,
  GET_DASHBOARD_CUSTOMER_INFO,
  GET_DASHBOARD_CUSTOMER_INFO_BY_DATE,
  GET_DASHBOARD_TICKET_INFO,
  GET_DASHBOARD_PAYMENT_INFO_BY_DATE
} from '../actionTypes'

import {
  getDashboardNetworkInfoLoading,
  getDashboardNetworkInfoSuccess,
  getDashboardNetworkInfoError,

  getDashboardLeadInfoLoading,
  getDashboardLeadInfoSuccess,
  getDashboardLeadInfoError,

  getDashboardCustomerInfo,
  getDashboardCustomerInfoLoading,
  getDashboardCustomerInfoSuccess,
  getDashboardCustomerInfoError,

  getDashboardCustomerInfoByDate,
  getDashboardCustomerInfoByDateLoading,
  getDashboardCustomerInfoByDateSuccess,
  getDashboardCustomerInfoByDateError,

  getDashboardTicketInfoLoading,
  getDashboardTicketInfoSuccess,
  getDashboardTicketInfoError,

  getDashboardPaymentInfoLoading,
  getDashboardPaymentInfoSuccess,
  getDashboardPaymentInfoError,

} from './action'

//network
function* fetchDashboardNetworkAsyn() {
  try {
    yield put(getDashboardNetworkInfoLoading())
    const info = yield call(getDashboardNetwork) //API call
    yield put(getDashboardNetworkInfoSuccess(info.data))
  } catch (error) {
    yield put(getDashboardNetworkInfoError(error))
  }
}
//lead
function* fetchDashboardLeadAsyn() {
  try {
    yield put(getDashboardLeadInfoLoading())
    const info = yield call(getDashboardLead) //API call
    yield put(getDashboardLeadInfoSuccess(info.data))
  } catch (error) {
    yield put(getDashboardLeadInfoError(error))
}
}

//customer info
function* fetchDashboardCustomerAsyn() {
  try {
    yield put(getDashboardCustomerInfoLoading())
    const info = yield call(getDashboardCustomer) //API call
    yield put(getDashboardCustomerInfoSuccess(info.data))
  } catch (error) {
    yield put(getDashboardCustomerInfoError(error))
}
}

//customer info by date
function* fetchDashboardCustomerByDateAsyn(action) {
  try {
    yield put(getDashboardCustomerInfoByDateLoading())
    const info = yield call(getDashboardCustomerByDate, action.payload.start,action.payload.end) //API call
    yield put(getDashboardCustomerInfoByDateSuccess({data: info.data, category: action.payload.category}))
 
  } catch (error) {
    yield put(getDashboardCustomerInfoByDateError(error))
}
}
//ticket info
function* fetchDashboardTicketAsyn() {
  try {
    yield put(getDashboardTicketInfoLoading())
    const info = yield call(getDashboardTicket) //API call
    yield put(getDashboardTicketInfoSuccess(info.data))
  } catch (error) {
    yield put(getDashboardTicketInfoError(error))
}
}

//payment info
function* fetchDashboardPaymentAsyn(action) {
  try {
    yield put(getDashboardPaymentInfoLoading())
    const info = yield call(getDashboardPaymentByDate, action.payload.start, action.payload.end) //API call
    yield put(getDashboardPaymentInfoSuccess({data2: info.data, category2: action.payload.category}))
  } catch (error) {
    yield put(getDashboardPaymentInfoError(error))
}
}

export function* watcherDashboardAsynApp() {
  yield takeLatest(  GET_DASHBOARD_NETWORK_INFO , fetchDashboardNetworkAsyn)
  yield takeLatest(  GET_DASHBOARD_LEAD_INFO , fetchDashboardLeadAsyn)
  yield takeLatest(  GET_DASHBOARD_CUSTOMER_INFO , fetchDashboardCustomerAsyn)
  yield takeLatest(  GET_DASHBOARD_CUSTOMER_INFO_BY_DATE , fetchDashboardCustomerByDateAsyn)
  yield takeLatest(  GET_DASHBOARD_TICKET_INFO , fetchDashboardTicketAsyn)
  yield takeLatest(  GET_DASHBOARD_PAYMENT_INFO_BY_DATE , fetchDashboardPaymentAsyn)
}
