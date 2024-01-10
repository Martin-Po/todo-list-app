import { Box, Typography } from '@mui/material'
import { useSelector } from 'react-redux'

function Footer() {
    const languaje = useSelector((state) => state.languaje)

    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
                margin: 'auto',
                position: 'absolute',//Container must have POSITION: RELATIVE
                bottom: '0',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '1.5rem',
                    paddingBottom: '1.5rem',
                }}
            >
                <Typography
                    variant="h2"
                    fontSize="1rem"
                    fontWeight="500"
                    opacity="0.85"
                >
                    {languaje === 'ESP'
                        ? 'Hecho por Martin Ponce'
                        : 'Coded by Martin Ponce'}
                </Typography>
            </Box>
        </Box>
    )
}

export default Footer
