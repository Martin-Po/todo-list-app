import { Box, Skeleton, TextField, Typography } from '@mui/material'
import * as React from 'react'
import Grid from '@mui/material/Grid'
import TodoListCard from './TodoListCard'
import NewList from './NewList'

function TodoLists({ loaded, lists }) {
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
              <NewList/>

                {lists.map((list) => {
                    return <TodoListCard key={list.id} list={list} />
                })}
            </Grid>
        )
    } else if (loaded && lists) {
        return (
              <NewList/>
        )
    } else {
        const skeletonItems = []

        for (let x = 0; x < 6; x++) {
            skeletonItems.push(
                <Grid
                    item
                    key={x} // Make sure to add a unique key for each element when rendering arrays in React
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
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
