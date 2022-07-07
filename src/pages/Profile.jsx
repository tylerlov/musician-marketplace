import React from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useNavigate} from 'react-router-dom'
import { useState}  from 'react'
import { db }  from '../firebase.config'
import { doc, setDoc } from 'firebase/firestore'
import {updateDoc} from 'firebase/firestore'
import { toast } from 'react-toastify'

function Profile() {

    const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)

    const navigate = useNavigate()

    const [formData, setFormData] = useState(
        {
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
        }
    )

    const { name, email } = formData

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async() => {
        try{
            if (auth.currentUser.displayName !== name) {
                //Update name in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                //Update name in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name,
                })
            }
        } catch (error) {
            toast('Error updating profile')
        }
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            //Allows us to dynamically change the name of the input - e.g. email, password
            [e.target.id]: e.target.value
        }))
    }


  return (<>
  <div className='profile'>
    <header className='profileHeader'>
        <p className='prageHeaderText'>Profile - { email }</p>
        
        <button type='button' className='logOut' onClick={onLogout}>
            Log Out
        </button>
    </header>
    <main>
        <div className='profileDetailsHeader'>
            <p className='profileDetailsText'>Profile Details</p>
            <p className="changePersonalDetails" onClick={() => { 
                // Clever way to toggle onSubmit function - doesnt happen every click
                changeDetails && onSubmit() 
                setChangeDetails((prevState) => !prevState)
                }}>
                { changeDetails ? 'done' : 'change' }
            </p>
        </div>

        <div className="profileCard">
            <form>
                <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} 
                disabled={!changeDetails} value={name} onChange={onChange}/>
                <input type="text" id="name" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} 
                disabled={!changeDetails} value={email} onChange={onChange}/>
            </form>
        </div>
    </main>
  </div>
  </>)
  
}

export default Profile