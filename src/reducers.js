import { combineReducers } from 'redux'
import {
  REQUEST_STATUS,
  RECEIVE_STATUS,
  EXPIRE_STATUS
} from './actions'

function status(
  state = {
    isFetching: false,
    didExpire: false,
    items: []
  },
  action
) {
  switch (action.type) {
    case EXPIRE_STATUS:
      return Object.assign({}, state, {
        didExpire: true
      })
    case REQUEST_STATUS:
      return Object.assign({}, state, {
        isFetching: true,
        didExpire: false
      })
    case RECEIVE_STATUS:
      return Object.assign({}, state, {
        isFetching: false,
        didExpire: false,
        items: action.status,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function statusesByServiceProvider(state = {}, action) {
  switch (action.type) {
    case EXPIRE_STATUS:
    case RECEIVE_STATUS:
    case REQUEST_STATUS:
      return Object.assign({}, state, {
        [action.serviceProvider]: status(state[action.serviceProvider], action)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  statusesByServiceProvider
})

export default rootReducer