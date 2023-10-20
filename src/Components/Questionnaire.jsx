import React from 'react'
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css'
import {userStateContext} from "../auth";
export default function Questionnaire  ()  {
    const [envoyerClicked, setEnvoyerClicked] = useState(false);
    const [user, setUser] = useState(localStorage.getItem('id'));
    const{currentUser,setCurrentUser}=userStateContext();
    const [isSendClicked, setIsSendClicked] = useState(false);
    const[hide,setHide]=useState(false);
    const [categories, setCategories] = useState([]);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const[questions,setQuestions]=useState([]);
    const[choices,setChoices]=useState([]);
    const [selectedChoices, setSelectedChoices] = useState({});
    const [persistedChoices, setPersistedChoices] = useState({});
    const [allResponses, setAllResponses] = useState([]);
    const [categoryScores, setCategoryScores] = useState({});
    const [categorySubmissionStatus, setCategorySubmissionStatus] = useState({});




//----------GetCategories----------------------------------
    //useEffect pour effectuer un appel à l'API lorsque le composant est monté
    useEffect(() => {
        // Appel à l'API pour récupérer les catégories
        fetch('http://localhost:8083/categories/get')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
    }, []);
    //mettre a jour l'index
    const handleNextClick = () => {
        setHide(false);
        setIsSendClicked(false);
        if (currentCategoryIndex < categories.length) {
            setCurrentCategoryIndex(prevIndex => prevIndex + 1);
            setSelectedChoices({});
        }
        setPersistedChoices(prevPersistedChoices => ({
            ...prevPersistedChoices,
            [currentCategoryIndex]: selectedChoices
        }));
    };

    const handlePrevClick = () => {
        if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex(prevIndex => prevIndex - 1);
            setSelectedChoices({});
        }
        const persistedChoicesForCategory = persistedChoices[currentCategoryIndex - 1];
        if (persistedChoicesForCategory) {
            setSelectedChoices(persistedChoicesForCategory);
        }
    };
//---------------------GetQuestions----------------------------------
    // en spécifiant [categories, currentCategoryIndex] comme dépendances, vous dites à React d'exécuter le useEffect lorsque categories ou currentCategoryIndex changent. Si l'un de ces états change, le useEffect sera réexécuté.
    useEffect(() => {
        // Vérifier s'il y a des catégories avant d'effectuer l'appel à l'API des questions
        if (categories.length > 0) {
            const categoryId = categories[currentCategoryIndex].id;
            // Appel à l'API pour récupérer les questions de la catégorie actuelle
            fetch(`http://localhost:8083/questions/getQuestionByCategory/${categoryId}`)
                .then(response => response.json())
                .then(data => setQuestions(data))
                .catch(error => console.error('Erreur lors de la récupération des questions:', error));
        }
        const persistedChoicesForCategory = persistedChoices[currentCategoryIndex];
        if (persistedChoicesForCategory) {
            setSelectedChoices(persistedChoicesForCategory);
        }
    }, [categories, currentCategoryIndex]);
//---------------------GetChoices----------------------------------
    useEffect(() => {
        // Appel à l'API pour récupérer les catégories
        fetch('http://localhost:8083/choix/get')
            .then(response => response.json())
            .then(data => setChoices(data))
            .catch(error => console.error('Erreur lors de la récupération des catégories:', error));
    }, []);

//---------------------GetResponses----------------------------------
    const handleSubmitResponse = (questionId, choixId) => {
        const newResponse = {
            questionId,
            choixId
        };

        setAllResponses(prevResponses => [...prevResponses, newResponse]);
    };
    //-----------------------------
    const areAllQuestionsAnswered = () => {
        // Vérifier si toutes les questions ont au moins une réponse
        return questions.every((_, index) => {
            return (
                selectedChoices[`${Math.floor(index / 2)}-${index % 2}`] !== undefined
            );
        });
    };
    //---------------------------------

    //-----------------------
    const handleChoiceChange = (index, qIndex, choiceId) => {
        const questionId = questions[index * 2 + qIndex].id;

        setSelectedChoices(prevSelectedChoices => ({
            ...prevSelectedChoices,
            [`${index}-${qIndex}`]: choiceId
        }));

        // Accumulate the responses in allResponses
        setAllResponses(prevResponses => {
            // Remove previous responses for this question
            const updatedResponses = prevResponses.filter(response => response.questionId !== questionId);

            // Add the current response if a choice is selected
            if (choiceId !== undefined) {
                updatedResponses.push({
                    questionId,
                    choixId: choiceId
                });
            }

            return updatedResponses;
        });
    };


    const handleSendClick = () => {
        setIsSendClicked(true);
        setHide(true);
        const userId = user // Replace with the actual user ID

        const responsePayload = {
            userId,
            responses: allResponses
        };

        fetch('http://localhost:8083/reponces/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responsePayload)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Réponses stockées avec succès :', data);
                // Clear allResponses after successful submission
                setAllResponses([]);
                //setSelectedChoices({}); // Clear selected choices as well
            fetchScoresForAllCategories(userId);
            })
            .catch((error) =>
                console.error('Erreur lors de la soumission des réponses:', error)
            )
            .finally(() => {

            });
        setCategorySubmissionStatus(prevStatus => ({
            ...prevStatus,
            [currentCategoryIndex]: true
        }));
        const fetchScoresForAllCategories = () => {
            const scores = {};
            const fetchScorePromises = categories.map(category => {
                const categoryId = category.id;

                return fetch(`http://localhost:8083/reponces/getScore?id_user=${userId}&id_category=${categoryId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(`Score pour la catégorie ${categoryId}:`, data);
                        scores[categoryId] = data;
                    })
                    .catch(error => {
                        console.error(`Erreur lors de la récupération du score pour la catégorie ${categoryId}:`, error);
                        scores[categoryId] = null;
                    });
            });

            Promise.all(fetchScorePromises).then(() => {
                setCategoryScores(scores);
            });
        }
        fetchScoresForAllCategories();

    };


    return (
        <>

            {categories.length > 0 && (
                <table >
                    <thead>
                    <tr>
                        <th className='titre'>
                            Catégorie : {categories[currentCategoryIndex].libelle}
                        </th>
                        {hide && (
                            <th className="scoreg">
                                Votre score de cette categorie est:{categoryScores[categories[currentCategoryIndex].id]}
                            </th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {questions.reduce((pairs, question, index) => {
                        if (index % 2 === 0) {
                            pairs.push([questions[index], questions[index + 1]]);
                        }
                        return pairs;
                    }, []).map((pair, index) => (
                        <tr key={index}>
                            {pair.map((question, qIndex) => (
                                <td key={qIndex}>
                                    <p className='question'>{`${index * 2 + qIndex + 1} - ${question.ennonce}`}</p>
                                    <ul>
                                        {choices.map((choice) => (
                                            <li key={choice.id}>
                                                <input
                                                    name={`choice-${index}-${qIndex}`}
                                                    type="radio"
                                                    className='check'
                                                    checked={selectedChoices[`${index}-${qIndex}`] === choice.id}
                                                    onChange={() => handleChoiceChange(index, qIndex, choice.id)}
                                                />
                                                <label className="label">{choice.description}</label><br />
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <br />
            <br />

            <div className='button'>

                <button className={isSendClicked ? 'Suivant' : 'Envoyer'} onClick={handleSendClick} disabled={!areAllQuestionsAnswered()}>
                    <span className='textButton'>Envoyer</span>
                </button>

                {currentCategoryIndex === categories.length - 1 ? (
                    <Link to="/result">
                        <button className={isSendClicked ? 'Envoyer' : 'Suivant'} disabled={!categorySubmissionStatus[currentCategoryIndex]}>
                            <span className='textButton'>Résultats</span>
                        </button>
                    </Link>
                ) : (
                    <button className={isSendClicked ? 'Envoyer' : 'Suivant'} onClick={handleNextClick} disabled={!categorySubmissionStatus[currentCategoryIndex] || currentCategoryIndex === categories.length - 1}>
                        <span className='textButton'>Suivant</span>
                    </button>
                )}

            </div>

        </>
    )
}
