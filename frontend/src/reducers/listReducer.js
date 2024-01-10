import { createSlice } from '@reduxjs/toolkit'
import listService from '../services/lists'
import listelementService from '../services/listelements'

const listSlice = createSlice({
    name: 'lists',
    initialState: [],
    reducers: {
        eraseList(state, action) {
            const { id } = action.payload
            return state.filter((list) => list.id !== id)
        },
        appendList(state, action) {
            state.push(action.payload)
        },
        setLists(state, action) {
            return action.payload
        },
        addElement(state, action) {
            const { listId, listElement } = action.payload

            return state.map((list) => {
                if (list.id === listId) {
                    return {
                        ...list,
                        listelements: [...list.listelements, listElement],
                    }
                }
                return list
            })
        },
        eraseElement(state, action) {
            const { listId, listElementId } = action.payload

            return state.map((list) => {
                if (list.id === listId) {
                    return {
                        ...list,
                        listelements: list.listelements.filter((element) => {
                            return element.id !== listElementId
                        }),
                    }
                }
                return list
            })
        },
        checkElement(state, action) {
            const { listId, listElementId, Newchecked } = action.payload

            return state.map((list) => {
                if (list.id === listId) {
                    return {
                        ...list,
                        listelements: list.listelements.map((element) => {
                            if (element.id === listElementId) {
                                return { ...element, checked: Newchecked }
                            } else {
                                return element
                            }
                        }),
                    }
                }
                return list
            })
        },
        changeElement(state, action) {
            const { listId, listElementId, description } = action.payload

            return state.map((list) => {
                if (list.id === listId) {
                    return {
                        ...list,
                        listelements: list.listelements.map((element) => {
                            if (element.id === listElementId) {
                                return { ...element, description: description }
                            } else {
                                return element
                            }
                        }),
                    }
                }
                return list
            })
        },
    },
})

export const {
    appendList,
    setLists,
    eraseList,
    addElement,
    eraseElement,
    checkElement,
    changeElement,
} = listSlice.actions

export const initializeLists = () => {
    return async (dispatch) => {
        const lists = await listService.getAll()
        dispatch(setLists(lists))
        return Promise.resolve()
    }
}

export const createList = (listObject) => {
    return async (dispatch) => {
        try {
            const newList = await listService.create(listObject)
            dispatch(appendList(newList))
        } catch (error) {
            console.error('Error creatin list:', error)
        }
    }
}

export const deleteListById = (id) => {
    return async (dispatch) => {
        try {
            await listService.remove(id)
            dispatch(eraseList({ id }))
        } catch (error) {
            // Handle error
            console.error('Error deleting list:', error)
        }
    }
}

export const createListElement = (listId, description) => {
    return async (dispatch) => {
        try {
            const newListElement = await listelementService.create({
                listId,
                description,
            })
            dispatch(addElement({ newListElement, listId }))
        } catch (error) {
            // Handle error
            console.error('Error updating list element:', error)
        }
    }
}

export const deleteListElement = (listId, listElementId) => {
    return async (dispatch) => {
        try {
            await listelementService.remove({ listelement: listElementId })
            dispatch(eraseElement({ listId, listElementId }))
        } catch (error) {
            // Handle error
            console.error('Error deleting list element:', error)
        }
    }
}

export const checkListElement = (listId, listElementId, Newchecked) => {
    return async (dispatch) => {
        try {
            console.log('en el reducer');
            console.log(listId);
            await listelementService.update(listElementId, {checked: Newchecked});
            dispatch(checkElement({ listId, listElementId, Newchecked }))
        } catch (error) {
            // Handle error
            console.error('Error deleting list element:', error)
        }
    }
}

export const updateElement = (listId, listElementId, Newdescription) => {
    return async (dispatch) => {
        try {
            await listelementService.update({ description: Newdescription })
            dispatch(changeElement({ listId, listElementId, Newdescription }))
        } catch (error) {
            // Handle error
            console.error('Error deleting list element:', error)
        }
    }
}

export default listSlice.reducer
