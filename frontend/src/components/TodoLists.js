import {
    Box,
    Checkbox,
    Skeleton,
    Button,
    Card,
    CardActions,
    Chip,
    Divider,
    List,
    ListItem,
    Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import * as React from 'react'
import Grid from '@mui/material/Grid'
import { checkListElement } from '../reducers/listReducer'
import Check from '@mui/icons-material/Check'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'

function TodoLists({ loaded, lists }) {
    const dispatch = useDispatch()

    const handleChange = (listId, elementId) => (event) => {
        const newCheckedState = event.target.checked
        dispatch(
            checkListElement(listId.toString(), elementId, newCheckedState)
        )
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
                            <Card size="lg" variant="outlined">
                                <Typography
                                    paddingLeft="1.5rem"
                                    level="h2"
                                    fontWeight={600}
                                    fontSize={'1.5rem'}
                                >
                                    {list.name}
                                </Typography>
                                <Divider inset="none" />
                                <List
                                    size="sm"
                                    sx={{
                                        mx: 'calc(-1 * var(--ListItem-paddingX))',
                                    }}
                                >
                                    {list.listelements.filter(element => element.checked).map((element) => {
                                        return (
                                            <Box>
                                                <ListItem>
                                                    <Checkbox
                                                        checked={
                                                            element.checked
                                                        }
                                                        onChange={handleChange(
                                                            list.id,
                                                            element.id
                                                        )}
                                                        inputProps={{
                                                            'aria-label':
                                                                'controlled',
                                                        }}
                                                    />
                                                    <Typography>
                                                        {element.description}
                                                    </Typography>
                                                </ListItem>
                                            </Box>
                                        )
                                    })}
                                <Divider variant="middle" />

                                    {list.listelements.filter(element => !element.checked).map((element) => {
                                        return (
                                            <Box>
                                                <ListItem>
                                                    <Checkbox
                                                        checked={
                                                            element.checked
                                                        }
                                                        onChange={handleChange(
                                                            list.id,
                                                            element.id
                                                        )}
                                                        inputProps={{
                                                            'aria-label':
                                                                'controlled',
                                                        }}
                                                    />
                                                    <Typography>
                                                        {element.description}
                                                    </Typography>
                                                </ListItem>
                                            </Box>
                                        )
                                    })}
                                </List>
                            </Card>
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
