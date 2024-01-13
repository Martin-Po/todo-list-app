import './App.css'
import { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import { useDispatch, useSelector } from 'react-redux'
import { initializeLoggedUser } from './reducers/loginuserReducer'
import { initializeLists, setLists } from './reducers/listReducer'
import listelementsService from './services/listelements'
import listsService from './services/lists'


// Access the action

import { Box, CssBaseline } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import AppBar from './components/AppBar'
import Footer from './components/Footer'
import TodoLists from './components/TodoLists'

function App() {

    const dispatch = useDispatch()

    const loggeduser = useSelector((state) => state.loggeduser)


    useEffect(() => {
        dispatch(initializeLoggedUser())
    }, [dispatch])

    const [loaded, setloaded] = useState(false)


    const lists = useSelector((state) => state.lists)

    useEffect(() => {
        if (loggeduser.user.length === 0){
            listelementsService.setToken(null);
            listsService.setToken(null);
            dispatch(setLists(null))   


        }
        else{
            console.log('seteando el token' + loggeduser.user.token);
            listelementsService.setToken(loggeduser.user.token);
            listsService.setToken(loggeduser.user.token);

            console.log('entro a la carga');
            dispatch(initializeLists()).then(() => {
                setloaded(true);
            });
            
        }
    }, [loggeduser])


    console.log(loggeduser);
    console.log(lists)
    console.log(loaded);

    if (loggeduser.user.length === 0)
        return (
            <div>
                <LoginForm />
            </div>
        )

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <CssBaseline />
            <AppBar />
            <Grid
                container
                spacing={{ xs: 0, md: 4 }}
                sx={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '1280px',
                    marginTop: '56px',
                    display: 'flex',
                    flexDirection: 'column',

                    '@media (max-width:1300px)': {
                        width: '992px',
                    },
                    '@media (max-width:1024px)': {
                        width: '100%',
                    },
                }}
            >
                <TodoLists loaded = {loaded} lists = {lists}/>
                <Box></Box>
            </Grid>
            <Footer />
        </div>
    )
}

export default App
