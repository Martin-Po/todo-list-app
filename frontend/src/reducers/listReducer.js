import { createSlice } from '@reduxjs/toolkit'
import listService from '../services/lists'
import listelementService from '../services/listelements'
import NewElement from '../components/NewElement'

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

        changeList(state, action) {
            const { listId, NewName } = action.payload

            return state.map((list) => {
                if (list.id === listId) {
                    return {
                        ...list,
                        name: NewName,
                    }
                }
                return list
            })
        },
        addElement(state, action) {
            const { newListElement } = action.payload

            return state.map((list) => {
                if (list.id === newListElement.list) {
                    return {
                        ...list,
                        listelements: [...list.listelements, newListElement],
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
    changeList,
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
            console.log('en la carga');
            console.log(listObject);
           const  newList = {name:listObject}
            const newListPopulated = await listService.create(newList)
            dispatch(appendList(newListPopulated))
        } catch (error) {
            console.error('Error creatin list:', error)
        }
    }
}

export const updateList = (listId, NewName) => {
    return async (dispatch) => {
        try {
            await listService.update(listId, {name: NewName})
            dispatch(changeList({ listId, NewName }))
        } catch (error) {
            // Handle error
            console.error('Error deleting list element:', error)
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

export const createListElement = (list, description) => {
    return async (dispatch) => {
        try {
            const newListElement = await listelementService.create({
                list,
                description,
            })
            dispatch(addElement({ newListElement }))
        } catch (error) {
            // Handle error
            console.error('Error updating list element:', error)
        }
    }
}

export const deleteListElement = (listId, listElementId) => {
    return async (dispatch) => {
        try {
            await listelementService.remove( listElementId )
            
            
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
            dispatch(checkElement({ listId, listElementId, Newchecked }))
            await listelementService.update(listElementId, {checked: Newchecked});
        } catch (error) {
            // Handle error
            dispatch(checkElement({ listId, listElementId, Newchecked: !Newchecked }))
            console.error('Error deleting list element:', error)
        }
    }
}

export const updateElement = (listId, listElementId, Newdescription) => {
    return async (dispatch) => {
        try {
            await listelementService.update(listElementId, {description: Newdescription})
            dispatch(changeElement({ listId, listElementId, Newdescription }))
        } catch (error) {
            // Handle error
            console.error('Error deleting list element:', error)
        }
    }
}

export default listSlice.reducer
