import React, { useState, useEffect} from 'react'
import {Switch, Route, Redirect } from 'react-router-dom'
import Login from './views/Login'
import Home from './views/Home'
import axios from 'axios'
import { BrowserRouter as Router} from 'react-router-dom'
function App() {

  const [autorizado, setAutorizado] = useState(false)
  const [remember, setRemember] = useState(false)

  useEffect(() =>{
      renderizadoCondicional()
  }, [])


  function renderizadoCondicional() {
      
      axios
          .post("http://localhost:5000/api/vigencia")
          .then(
              (response) =>{
                  console.log(response.data)
                  if(response.status === 200){
                    setAutorizado(true)    
                    
                    let recordar = localStorage.getItem('RECORDAR_APP_TALLER_UBB')
                    if(recordar === 'remember'){
                        setRemember(true);
                    }
                    
                  }
                  
              }
          )
          .catch((err) =>{
              if(err.response){
                  if(err.response.status === 401){
                      setAutorizado(false)
                      console.log(err.response.data)
                  }
                  
              }else if(err.request){
                
              }else{
                
              }
          })
  }

    return (
      <Router>
          {remember ? <Redirect to="/Home"/> :""}
        <Switch>
            <Route path='/Home' >
                {autorizado ? <Home/> : <Login />}
            </Route>
            <Route path='/'>
                <Login/>
            </Route>
            
        </Switch>
      </Router>
    )
}

export default App;
