import React from "react";
import '../register.css';
import register from './register.png';
import axios from "axios";
import Swal from "sweetalert2";
import {useState} from "react";
import {Link} from "react-router-dom";
export default function  Register(){
    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [adresse,setAdresse]=useState('');
    const [phone,setPhone]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            nom: name,
            email: email,
            adresse: adresse,
            phone: phone,
            password: password,
        };
        console.log(userData);
        try {
            const response = await axios.post("http://localhost:8083/users/register", userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            Swal.fire({
                text: response.data, // Utilisez response.data pour obtenir la réponse du serveur
                icon: "success"
            });
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
            <div className="form-container">
                <h2><center><b>Créer un compte pour passer<br/> votre diagnostique</b></center> </h2>
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
                        <div className="input-wrapper">
                            <label htmlFor="nom">Nom:</label>
                            <input type="text" id="nom" name="nom"
                                   value={name}
                                   onChange={(event) => {
                                       setName(event.target.value);
                                   }} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-wrapper telephone">
                            <label htmlFor="telephone">Téléphone:</label>
                            <input  type="tel" id="telephone" name="telephone"
                                    value={phone}
                                    onChange={(event) => {
                                        setPhone(event.target.value);
                                    }}/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-wrapper">
                            <label htmlFor="adresse">Adresse:</label>
                            <input type="text" id="adresse" name="adresse"
                                   value={adresse}
                                   onChange={(event) => {
                                       setAdresse(event.target.value);
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
                        <div className="input-wrapper">
                            <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
                            <input type="password" id="confirmPassword" name="confirmPassword"
                                   value={confirmPassword}
                                   onChange={(event) => {
                                       setConfirmPassword(event.target.value);
                                   }}/>
                        </div>
                    </div>
                    <p>Vous avez déjà créé un compte? <Link to="/login" style={{ textDecoration: "none", color:'blue'}}>Se connecter</Link></p>
                    <button type="submit" ><b>Créer un compte</b></button>
                </form>
            </div>
        </div>
    );
}