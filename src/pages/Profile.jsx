import React from 'react'
import {getAuth} from 'firebase/auth'
import {Link} from 'react-router-dom'
import {useEffect, useState}  from 'react'

function Profile() {

    const [user, setUser] = useState(null)
    const auth = getAuth()

    useEffect(() => {
        setUser(auth.currentUser)
    }, [])


  return user ? <p>{user.email}</p> : 'Nothing found'

  
}

export default Profile