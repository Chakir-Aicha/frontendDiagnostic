import React, { useState, useEffect } from 'react';
import {userStateContext} from "../auth";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp, faUser} from "@fortawesome/free-solid-svg-icons";

export default function Result() {
    const [user, setUser] = useState(localStorage.getItem('id'));
    const{currentUser,setCurrentUser}=userStateContext();
    const [categories, setCategories] = useState([]);
    const [scores, setScores] = useState({});
    const[ScoreGlobale,setScoreGlobal]=useState(0);

    const USER_ID = user;

    useEffect(() => {
        fetch('http://localhost:8083/categories/get')
            .then(response => response.json())
            .then(data => {
                setCategories(data);

                // Fetch scores for each category
                const fetchScoresForAllCategories = () => {
                    const categoryScores = {};

                    const scorePromises = data.map(category => {
                        const categoryId = category.id;

                        return fetch(`http://localhost:8083/reponces/getScore?id_user=${USER_ID}&id_category=${categoryId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({}),
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(`Réponse pour la catégorie ${categoryId}:`, data);

                                categoryScores[categoryId] = data;


                            })

                            .catch(error => {
                                console.error(`Erreur lors de la récupération du score pour la catégorie ${categoryId}:`, error);
                                categoryScores[categoryId] = null;
                            });
                    });

                    Promise.all(scorePromises).then(() => {
                        console.log('Category Scores:', categoryScores);
                        setScores({ ...categoryScores }); // Update the scores state after fetching all scores
                    });
                };

                fetchScoresForAllCategories();
            })
            .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
    }, []);

    //-------------------ScoreGlobale----------------------------
    useEffect(() => {
        fetch(`http://localhost:8083/reponces/getScoreGlobale?id_user=${USER_ID}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => response.json())
            .then(data => setScoreGlobal(data.globalScore))
            .catch(error => console.error('Erreur lors de la récupération du score global:', error));
    }, []);


    return (
        <>
            <div style={{background:'#3C1BC2', height:'25px'}}><FontAwesomeIcon icon={faUser} style={{height:'25px'}}/><span style={{fontSize:'20px'}}>MediaTechSolutions</span>
            </div>
            <p className='TitreR'><center>Félicitations d'avoir terminé votre<br/> diagnostique, voici vos résultats...</center></p>

            <table style={{width:'100%'}}>
                <tbody>
                <tr>
                    {categories.map(category => (
                        <td key={category.id}>
                            <div className='Rect'>
                                <span className='Center'>{`${category.libelle}`}</span>
                            </div>
                        </td>
                    ))}
                </tr>
                <tr>
                    {categories.map(category => (
                        <td key={`score-${category.id}`}>
                            <div className='T'>
                                <span className='Center'>{` ${scores[category.id] !== undefined ? scores[category.id] : 'N/A'}`}</span>
                            </div>
                        </td>
                    ))}
                </tr>
                </tbody>
            </table>
            <p className='Fin'><center>Votre score global est : {ScoreGlobale}</center></p>
        </>
    );

}
