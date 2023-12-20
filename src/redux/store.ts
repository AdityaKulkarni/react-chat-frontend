import storage from 'redux-persist/lib/storage'
import rootReducer from './root_reducer'
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
} from 'redux-persist'
import {configureStore} from '@reduxjs/toolkit'

export type RootState = {
	rootReducer: ReturnType<typeof rootReducer>
}

const persistConfig = {
	key: 'root',
	storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
	reducer: {
		rootReducer: persistedReducer,
	},
})
