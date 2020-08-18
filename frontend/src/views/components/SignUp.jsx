import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


import { useForm } from 'react-hook-form';
import axios from 'axios'
import swal from 'sweetalert';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  card: {
    marginTop: theme.spacing(5),
    backgroundColor: green

  },
}));

export default function SignUp() {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();

  const onSubmitSignUp = (data, e) => {
    if (data.firstName === '' || data.lastName === '' || data.emailSign === '' || data.passwordSign === '' || data.confirmPassword === '') {
      swal({
        title: "Cuidado !",
        text: "Debes llenar los espacios vacios",
        icon: "warning",
        button: "Continuar",
      });
    } else {
      if (data.passwordSign === data.confirmPassword) {

        axios
          .post('http://localhost:5000/api/guardarUsuario', {
            firstName: data.firstName,
            lasttName: data.lastName,
            email: data.emailSign,
            password: data.passwordSign
          })
          .then(
            (Response) => {
              console.log(Response)
              
              swal({
                title: "Dato guardado satisfactoriamente",
                text: "Registrado en la base de datos",
                icon: "success",
                button: "Continuar",
              });
              //enviar correo
              enviarCorreo(data.emailSign,data.firstName)
              //resetear valores en form
              e.target.reset()
            }
          )
          .catch((error) => {
            console.log(error)
            swal({
              title: "No se pudo guardar el archivo",
              text: "Este correo ya se encuentra en la base de datos",
              icon: "error",
              button: "Continuar",
            });
          })


      } else {
        swal({
          title: "Datos no guardados",
          text: "Las contraseñas no coinciden",
          icon: "error",
          button: "Continuar",
        });
      }
    }
  }

  function enviarCorreo(email,name,) {
      axios
      .post('http://localhost:5000/api/emailEnviar',{
        "emailEnviar": email,
        "name": name,
        "asunto": "Resgistro Kendo App",
        "cuerpo": "Bienvenido a nuestra app gracias por registrarte"
      })
      .then(
        (Response) =>{
          if(Response.data.mensaje === 'correcto'){
            console.log("Esto esta correcto")
          }
        }
      )
      .catch(
        (err) =>{
          if (err.response) {
            if (err.response.status === 401) {
              console.log(err.response.data.mensaje)
            }
              
            } else if (err.request) {
                // client never received a response, or request never left
                swal({
                  title: "Algo fallo",
                  text: "No existe conexion con la base de datos",
                  icon: "error",
                  button: "Continuar",
              });
            } else {
                // anything else
            }
        }
      )
  }
  console.log(errors)

  return (
    <Container maxWidth="xs">

      <CssBaseline />
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Registro nuevo
            </Typography>
            <form onSubmit={handleSubmit(onSubmitSignUp)} name="signUp" className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} >
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    inputRef={register}
                    label="Nombre"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Apellido"
                    name="lastName"
                    inputRef={register}
                    autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Correo electronico"
                    name="emailSign"
                    inputRef={register}
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="passwordSign"
                    label="Contraseña"
                    inputRef={register}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirmar contraseña"
                    inputRef={register}
                    type="password"
                    id="confirmPassword"
                    autoComplete="current-password"
                  />
                </Grid>

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Registrarse
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>


    </Container>
  );
}