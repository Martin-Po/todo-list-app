import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
    name: 'theme',
    initialState: 'light',

    reducers: {
        setTheme(state) {
            return state === 'light' ? 'dark' : 'light'
        },
    },
})

const { setTheme } = themeSlice.actions

export const changeTheme = () => {

    return async (dispatch) => {
        try {
            dispatch(setTheme())
        } catch (error) {
            console.error('Error changing theme', error)
        }
    }

}

export default themeSlice.reducer
