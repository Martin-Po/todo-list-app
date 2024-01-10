import { Box, Checkbox, Skeleton, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { CardActionArea } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { checkListElement } from '../reducers/listReducer'



function TodoLists({ loaded, lists }) {

    const dispatch = useDispatch()

    const handleChange = (listId, elementId) => (event) => {
        const newCheckedState = event.target.checked;
        dispatch(checkListElement( listId.toString(), elementId, newCheckedState ));
    }


    const languaje = useSelector((state) => state.languaje)
    if (loaded && lists && lists.length > 0) {
        return (
            <Grid
                container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '5rem',
                }}
            >
                {lists.map((list) => {
                    return (
                        <Grid
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            spacing="4"
                            sx={{ padding: '1rem' }}
                            key={list.id}
                        >
                            <Box>
                                {list.name}
                            </Box>
                            <Box>
                                {list.listelements.map(element => {return (<Checkbox
  checked={element.checked}
  onChange={handleChange(list.id, element.id)}
  inputProps={{ 'aria-label': 'controlled' }}
/>)})}
                            </Box>
                            
                        </Grid>
                    )
                })}
            </Grid>
        )
    } else {
        const skeletonItems = []

        for (let x = 0; x < 6; x++) {
            skeletonItems.push(
                <Grid
                    key={x} // Make sure to add a unique key for each element when rendering arrays in React
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    spacing="4"
                    sx={{ padding: '1rem' }}
                >
                    <Skeleton variant="rectangular" width={210} height={118} />
                    <Box sx={{ pt: 0.5 }}>
                        <Skeleton />
                        <Skeleton width="60%" />
                    </Box>
                </Grid>
            )
        }

        return (
            <Grid
                container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '5rem',
                }}
            >
                {skeletonItems}
            </Grid>
        )
    }
}

export default TodoLists
