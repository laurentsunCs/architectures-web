import React, { use, useState, useEffect } from "react";
import "./Login.css";
import { useAuth } from "../../Common/AuthProvider/AuthProvider";
import Logout from "../Logout/Logout";

function Login() {
    const { authToken, login_ } = useAuth(); // Use Auth Context
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [successLogin, setSuccessLogin] = useState(true);
    const [myInfos, setMyInfos] = useState(null);

    async function submitlogin() {
        const url = "https://gourmet.cours.quimerch.com/login";
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json", // Use correct content-type
                },
                body: JSON.stringify({ "password": password, "username": user }),
            });

            const data = await response.json();

            if (response.status === 401) {
                setSuccessLogin(false);
                throw new Error("Nom d'utilisateur ou mot de passe incorrect.");
            } 
            else if(response.status === 200) {  
                setSuccessLogin(true);
            }

            if (!response.ok) {
                throw new Error(`Erreur API : ${response.status} - ${data.message || 'Erreur inconnue'}`);
            }

            console.log("Données reçues :", data);
            login_(data.token); // Store token in localStorage using AuthContext
            setSuccessLogin(true); // Hide error message
        } catch (error) {
            setError(error.message);
            setSuccessLogin(false); // Show error message
        } finally {
            setLoading(false);
            setUser('');
            setPassword('');
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!user || !password) {
            setError("Veuillez entrer un nom d'utilisateur et un mot de passe.");
            return;
        }
        submitlogin();
    };

    async function getMyInfos() {
        const url = "https://gourmet.cours.quimerch.com/me";
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                setError(`Erreur API : ${response.status} - ${data.message || 'Erreur inconnue'}`);
                throw new Error(`Erreur API : ${response.status} - ${data.message || 'Erreur inconnue'}`);
            }

            setMyInfos(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
        setUser('');
        setPassword('');
    }
       
    useEffect(() => {
        if(authToken) {
            getMyInfos();
        }
    }, [authToken]);

    console.log("authToken", authToken);
    return (
        <div className="LoginPage">
            <section className="container">
                <div className="login-container">
                    <div className="circle circle-one"></div>
                    <div className="form-container">
                        
                        
                        {authToken ? (
                            <div>
                            <h1>Mon compte</h1>
                                <label >Email :</label>
                                <div>{myInfos && myInfos.email}</div>
                                <label >Nom :</label>
                                <div>{myInfos && myInfos.full_name}</div>
                                <label> Username : </label>
                                <div>{myInfos && myInfos.username}</div>
                                <label> Password : </label>
                                <div> {myInfos && myInfos.encrypted_password}</div>

                            <Logout />
                            
                            </div>
                        ) : (
                            
                            <div>
                            <h1>Connexion</h1>
                            <div>
                                <img src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png" alt="illustration" className="illustration" />
                                
                                <form onSubmit={handleSubmit}>
                                    <label htmlFor="user">Email</label>
                                    <input placeholder="USERNAME" type="text" id="user" value={user} onChange={(e) => setUser(e.target.value)} required />
                                    <label htmlFor="password">Mot de passe</label>
                                    <input placeholder="PASSWORD" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <button className="opacity" type="submit" disabled={loading}>Connexion</button>
                                </form>

                                {/* Show error message only when login fails */}
                                {!successLogin && <div className="password-error">Mot de passe incorrect ! Réessayez</div>}
                            </div>
                            </div>
                        )}
                    </div>
                    <div className="circle circle-two"></div>
                </div>
                <div className="theme-btn-container"></div>
            </section>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default Login;
