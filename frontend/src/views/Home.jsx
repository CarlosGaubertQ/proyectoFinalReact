import React, { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      
    },
}));

export default function Home() {
    const classes = useStyles();
    const [autorizado, setAutorizado] = useState(false)

    useEffect(() => {
        renderizadoCondicional()
    }, [])


    function renderizadoCondicional() {
        
        axios
            .post("http://localhost:5000/api/vigencia")
            .then(
                (response) => {
                    if (response.status === 200) {
                        setAutorizado(true)

                    }

                }
            )
            .catch((err) => {
                if (err.response) {
                    if (err.response.status === 401) {
                        setAutorizado(false)
                        console.log(err.response.data)
                    }

                } else if (err.request) {

                } else {

                }
            })
    }

    if (autorizado) {
        return (
            <NavBar />
        )
    } else {
        return (
        <div className={classes.root}>
        <CircularProgress alignContent='center' size='13rem'  />
        </div>
        )
    }


}