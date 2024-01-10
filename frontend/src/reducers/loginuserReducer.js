import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'

const loggedUserSlice = createSlice({
    name: 'loggeduser',
    initialState: { user: [], error: null },
    reducers: {
        eraseUser(state, action) {
            state.user = [];
            state.error = null; // clear any previous error

        },
        setUser(state, action) {
            state.user = action.payload;
            state.error = null; // clear any previous error
        },
        setError(state, action) {
            state.error = action.payload; // set the error message
        },
    },
})

export const { setUser, eraseUser, setError } = loggedUserSlice.actions

export const initializeLoggedUser = () => {
    return async (dispatch) => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(setUser(user))
        }
        return Promise.resolve()
    }
}

export const logIn = (credentials) => {
    return async (dispatch) => {
        try {
            const user = await loginService.login({
                username: credentials.username,
                password: credentials.password,
            })
            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            dispatch(setUser(user))
        } catch (error) {
            dispatch(setError({Type: 'login', ErrorMessage: 'Invalid username or password'})) // dispatch the error action
        }
    }
}

export const logOut = () => {
    return async (dispatch) => {
        try {
            window.localStorage.removeItem('loggedUser')
            dispatch(eraseUser())
        } catch (error) {
            dispatch(setError({type: 'logout', ErrorMessage: 'Error deleting user'})) // dispatch the error action
        }
    }
}

export default loggedUserSlice.reducer