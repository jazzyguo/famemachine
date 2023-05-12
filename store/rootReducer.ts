import { combineReducers } from '@reduxjs/toolkit'

import {
    clipsSliceInitialState,
    clipsSliceReducer,
} from '../features/clips/slice'


export const initialAppState = {
    ...clipsSliceInitialState,
}

const rootReducer = combineReducers({
    ...clipsSliceReducer,
})

export default rootReducer
