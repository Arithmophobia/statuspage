import fetch from 'cross-fetch'
import {
  determineAddress,
  parseStatus
} from './helpers/helpers'

// available actions
export const REQUEST_STATUS = 'REQUEST_STATUS'
export const RECEIVE_STATUS = 'RECEIVE_STATUS'
export const EXPIRE_STATUS = 'EXPIRE_STATUS'

// User can refresh 
export function expireStatus(serviceProvider) {
  return {
    type: EXPIRE_STATUS,
    serviceProvider
  }
}

function requestStatus(serviceProvider) {
  return {
    type: REQUEST_STATUS,
    serviceProvider
  }
}

function receiveStatus(serviceProvider, response) {
  var status = parseStatus(response, serviceProvider)
  return {
    type: RECEIVE_STATUS,
    serviceProvider,
    status: status, 
    receivedAt: Date.now()
  }
}

function fetchStatus(serviceProvider) {
  var address = determineAddress(serviceProvider)
  return dispatch => {
    dispatch(requestStatus(serviceProvider))
    return fetch(address)
      .then(response => response.text())
      .then(text => dispatch(receiveStatus(serviceProvider, text)))
  }
}

function shouldFetchStatus(state, serviceProvider) {
  const status = state.statusesByServiceProvider[serviceProvider]
  if (!status) {
    return true
  } else if (status.isFetching) {
    return false
  } else {
    return status.didExpire
  }
}

export function fetchStatusIfNeeded(serviceProvider) {
  return (dispatch, getState) => {
    if (shouldFetchStatus(getState(), serviceProvider)) {
      return dispatch(fetchStatus(serviceProvider))
    }
  }
}
