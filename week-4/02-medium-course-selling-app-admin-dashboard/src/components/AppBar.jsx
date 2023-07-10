import { Button, Typography } from '@mui/material'
import React from 'react'

const AppBar = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between',padding:'10px' }}>
            <div><Typography variant='h5'>Courses</Typography></div>
            <div style={{ display: 'flex' }}>
                <div style={{marginRight:'10px'}}><Button variant='contained'>Sign Up</Button></div>

                <div><Button variant='contained'>Sign In</Button></div>
            </div>
        </div>
    )
}

export default AppBar