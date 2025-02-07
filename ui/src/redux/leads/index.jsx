import { call, put, takeLatest } from 'redux-saga/effects'
import { fetchAllLeads } from '../../api'
import {
  GET_ALL_LEADS_LOADING,
} from '../actionTypes'
import {
  getAllLeadsError,
  getAllLeadsSuccess,
} from './action'

function* fetchLeadsAsyn() {
  try {
    //yield put(getAllLeadsLoading())
    const leads = yield call(fetchAllLeads) //API call
    yield put(getAllLeadsSuccess(leads.data))
  } catch (error) {
    yield put(getAllLeadsError(error))
  }
}

export function* watcherLeadsApp() {
  yield takeLatest(  GET_ALL_LEADS_LOADING , fetchLeadsAsyn)
}
