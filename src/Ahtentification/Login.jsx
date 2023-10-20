import React from "react";
import '../register.css';
import register from './register.png';
import axios from "axios";
import Swal from "sweetalert2";
import {useState} from "react";
import {userStateContext} from "../auth";
import {useNavigate} from 'react-router-dom';
export default function  Login(){
    const{setCurrentUser,setUserToken}=userStateContext();
    const [email,setEmail]=useState('')
    const [user, setUser] = useState(null);
    const [password,setPassword]=useState('')
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password
        };
        console.log(userData);
        try {
            const response = await axios.post("http://localhost:8083/users/login", userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Après la connexion réussie, mettez à jour l'utilisateur dans l'état
                setUser(response.data);
                try {
                    const response = await axios.get(`http://localhost:8083/users/mail/${email}`);
                    setUser(response.data);
                    console.log(response.data);
                    setCurrentUser(response.data.id)
                    localStorage.setItem('id', response.data.id);
                    console.log('user_id:', response.data.id);
                } catch (error) {
                    // Gérez les erreurs en conséquence
                };
                // Autres actions après la connexion réussie
                Swal.fire({
                    text: response.data,
                    icon: "success"
                });
                navigate('/questionnaire');

            } else {
                Swal.fire({
                    text: "Connexion échouée.",
                    icon: "error"
                });
            }
        } catch (error) {
            if (error.response) {
                Swal.fire({
                    text: error.response.data,
                    icon: "error"
                });
            } else {
                Swal.fire({
                    text: "Une erreur inattendue s'est produite.",
                    icon: "error"
                });
            }
        }
    }



    return (
        <div className="register-container">
            <div className="image-container">
                <div className="overlay"></div>
                <img src={register} alt="Image"/>
            </div>
            <div className="form-container-login">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-wrapper">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email"
                                   value={email}
                                   onChange={(event) => {
                                       setEmail(event.target.value);
                                   }}/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-wrapper">
                            <label htmlFor="password">Mot de passe:</label>
                            <input type="password" id="password" name="password"
                                   value={password}
                                   onChange={(event) => {
                                       setPassword(event.target.value);
                                   }}/>
                        </div>
                    </div>
                    <button type="submit" ><b>Se connecter</b></button>
                </form>
            </div>
        </div>
    );
}