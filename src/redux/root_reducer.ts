import {combineReducers} from 'redux'
import messageReducer from './chat_slice'

export default combineReducers({
	message: messageReducer,
})
