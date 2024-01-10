import { configureStore } from '@reduxjs/toolkit'

import loginuserReducer from './reducers/loginuserReducer'
import languajeReducer from './reducers/languajeReducer'
import themeReducer from './reducers/themeReducer'
import listReducer from './reducers/listReducer'



const store = configureStore({
    reducer: {
        loggeduser: loginuserReducer,
        languaje: languajeReducer,
        activeTheme: themeReducer,
        lists: listReducer


    },
})

export default store
