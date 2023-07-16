import { Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

const AppBar = () => {
    let token = null
    const [userEmail, setUserEmail] = useState(null)
    function getToken() {
        token = localStorage.getItem('token')
    }
    getToken()

    useEffect(() => {
        fetch(`http://localhost:3000/users/me`, {
            method: "GET",
            headers: {
                'authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.json()).then(res => {
            if (res.user.username) {
                setUserEmail(res.user.username)
            }
        }
        )

    }, [userEmail,token])

    const navigate = useNavigate()
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <div><Typography onClick={() => navigate('/course')} variant='h5'>Courses</Typography></div>
            <div style={{ display: 'flex' }}>
                {
                    userEmail !== null ? (
                        <div style={{
                            display: 'flex',
                            justifyContent:'space-around',
                            alignItems:'center',
                        }}>
                            <div style={{
                                marginRight:20
                            }}>{userEmail}</div>
                            <div>
                                <Button variant='contained' onClick={() => (
                                    localStorage.setItem('token', null),
                                    window.location = ''
                                )}>Log Out</Button>
                            </div>
                        </div>
                    ) : (
                        <> <div style={{ marginRight: '10px' }}><Button variant='contained' onClick={() => navigate('/signup')}>Sign Up</Button></div>

                            <div><Button variant='contained' onClick={() => navigate('/login')}>Sign In</Button></div></>
                    )
                }
            </div>
        </div>
    )
}

export default AppBar