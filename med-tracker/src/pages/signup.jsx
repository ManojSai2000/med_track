import React, {useState} from "react";
import { useNavigate } from "react-router-dom"
import '../style.css';
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
    const [error, setErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                email
            })
        } catch (e) {
            setErr(true);
        }




    }
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Med Tracker</span>
                <span className="title">Sign Up</span>
                <form onSubmit={handleSubmit}>
                    <input required type="email" placeholder="email" />
                    <input required type="password" placeholder="password" />

                    <button>Sign up</button>
                    {error && <span>Something went wrong</span>}
                </form>
                <p>
                    You do have an account?
                    <button onClick={() => navigate('/login')}>Login</button>
                </p>
            </div>
        </div>
    );
}

export default Signup;