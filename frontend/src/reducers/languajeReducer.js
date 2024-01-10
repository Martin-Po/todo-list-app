import { createSlice } from '@reduxjs/toolkit'

const languajeSlice = createSlice({
    name: 'languaje',
    initialState: 'ESP',

    reducers: {
        setLanguaje(state) {
            return state === 'ESP' ? 'ENG' : 'ESP'
        },
    },
})

const { setLanguaje } = languajeSlice.actions

export const changeLanguaje = () => {

    return async (dispatch) => {
        try {
            dispatch(setLanguaje())
        } catch (error) {
            console.error('Error changing languaje', error)
        }
    }

}

export default languajeSlice.reducer
