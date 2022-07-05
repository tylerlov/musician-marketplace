import React from 'react'
import { toast  } from 'react-toastify'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { db } from '../firebase.config'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    
   const {name, email, password} = formData
   const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            //Allows us to dynamically change the name of the input - e.g. email, password
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const auth = getAuth()
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            updateProfile(auth.user, {
                displayName: name
                })

            const formDataCopy = {...formData}
            delete formDataCopy.password
            formDataCopy.timestamp = serverTimestamp()

            await setDoc(doc(db, 'users', user.uid), formDataCopy)

            navigate('/')

        } catch (error) {
            toast.error('Issue with registration credentials')
        }
    }


  return (
   <>
   <div className='pageContainer'>
    <header>
        <p className='pageHeader'>Sign Up</p>
    </header>

    <form onSubmit={onSubmit}>
        <input type='text' placeholder='Name' className='nameInput' id="name" value={name} onChange={onChange}/>
        <input type='email' placeholder='Email' className='emailInput' id="email" value={email} onChange={onChange}/>
        <div className='passwordInputDiv'>
            <input type={showPassword ? 'text' : 'password'} placeholder='Password' className='passwordInput' 
            id="password" value={password} onChange={onChange}/>
            <img src={visibilityIcon} className='showPassword' onClick={() => setShowPassword((prevState) => !prevState)}/>
        </div>
        <div className='signUpBar'>
            <p className='signUpText'>Register</p>
            <button className='signUpButton' type='submit'>
                <ArrowRightIcon fill='#2c2c2c' width='24px' height='24px'/>
            </button>
        </div>
    </form>

    {/* Google oAuth will go here afterwards */}

    <Link to='/signin' className='registerLink'>Sign In Instead</Link>
    
    </div>

   </>
  )
}

export default SignUp