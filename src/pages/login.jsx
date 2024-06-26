import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth , db} from '../firebase';
import '../style.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setErr] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userRole = await getUserRole(userCredential.user.uid);
            if (userRole === 'admin') {
                navigate('/adminDashboard');
            } else if (userRole === 'patient') {
                navigate('/patientDashboard');
            } else if (userRole === 'nurse') {
                navigate('/nurseDashboard');
            }else if (userRole === 'doctor') {
                navigate('/doctorDashboard');
            }else {
                navigate('/');
            }

        } catch (e) {
            console.error(e);
            setErr(e.message);
        }
    };

    const getUserRole = async (userId) => {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return docSnap.data().role;
        } else {
            return null;
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Med Tracker</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input required type="email" name="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                    <input required type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />


                    <button type="submit">Login</button>
                    {error && <span>Something went wrong</span>}
                </form>
                <p>
                    Don't have an account?
                    <button onClick={() => navigate('/signup')}>Sign Up</button>
                </p>
            </div>
        </div>
    );
};

export default Login;
