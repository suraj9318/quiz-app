import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const url = ''
const tempurl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple';

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [waiting,setWating] = useState(true);
  const [loading,setLoading] = useState(false);
  const [questions, setQuestions] = useState([])
  const [index,setIndex] = useState(0);
  const [correct,setCorrect] = useState(0);
  const [error,setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz,setQuiz] = useState(
    {
      amount : 10,
      category : 'sports',
      dificulty : 'easy'
    }
  )


  const fetchQuestion = async (url) => {
    debugger
    setLoading(true);
    setWating(false);
    const response  = await axios(url).catch(err => console.log(err));
    if(response){
      const data =response.data.results;
      if(data.length > 0){
        setQuestions(data);
        setLoading(false)
        setWating(false)
        setError(false)
      }
      else {
        setWating(true)
        setError(true)
      }
    }
    else{
      setWating(true)
    }

  }

  const nextQuestion = () =>{
    setIndex((oldIndex)=>{
      const index = oldIndex +1;
      if(index > questions.length - 1){
        openModal();
        return 0;
      }
      else{
        return index
      }
    })

  }

  const checkAnwer = (value)=>{
    if(value){
      setCorrect((oldState)=>oldState+1)

    }
    nextQuestion();
  }

  const openModal = () =>{
    setIsModalOpen(true);
  }
  const closeModal = () =>{
    setWating(true)
    setCorrect(0);
    setIsModalOpen(false);
  }

  const handleChange = (e) =>{
    const name = e.target.name;
    const value = e.target.value;
    
    setQuiz({...quiz,[name] :value })
  }
  const handleSubmit = (e) =>{
    e.preventDefault();
    const {amount,category,dificulty} = quiz;
    const url =   `${API_ENDPOINT}amount=${amount}&diffulty=${dificulty}&category=${table[category]}&type=multiple`
    fetchQuestion(url);
  }


  return <AppContext.Provider value={{
    waiting,loading,questions,index,correct,error,isModalOpen,nextQuestion,checkAnwer,closeModal,quiz,handleChange,handleSubmit
  }}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
