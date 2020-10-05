import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import axios from 'axios'
import MaterialDatatable from "material-datatable"
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import swal from 'sweetalert';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { IconButton } from '@material-ui/core';
import { loadCSS } from 'fg-loadcss';



const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  card: {
    marginTop: theme.spacing(5),
    alignItems: 'center',

  },
  gridGuardarLibro: {
    alignItems: 'center'

  },
  datatable: {
    marginTop: theme.spacing(6),
    alignItems: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputs: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(4),
    with: '100%'
  },
  espaciado: {
    margin: theme.spacing(2)
  },
  root: {
    display: 'flex',
  },
}));

export default function Libros() {
  const { register, handleSubmit, errors } = useForm();
  const [item, setItem] = useState([])
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [nombreBoton, setNombreBoton] = useState('Registrar alumno')
  const [idUpdate, setIdUpdate] = useState(null)
  const classes = useStyles();
  const columns = [
    {
      name: "Seleccionar",
      options: {
        headerNoWrap: true,
        customBodyRender: (item, tablemeta, update) => {
          return (
            <IconButton
              variant='outlined'

              className="btnblock"
              onClick={() => handleSeleccion(item)}
              color={selectedAlumno === item._id ? "secondary" : ""}
            >
              <div className={classes.root}>
                {selectedAlumno === item._id ? <Icon className="fa fa-check-circle" /> : <Icon className="far fa-circle" />}


              </div>
            </IconButton>
          );
        },
      },
    },
    {
      name: "Rut del Alumno",
      field: "rut",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "Nombre del alumno",
      field: "nombre",
      options: {
        filter: true,
        sort: true,
      }
    },
    {

      options: {
        headerNoWrap: true,
        customBodyRender: (item, tablemeta, update) => {
          return (
            <IconButton aria-label="delete"
              onClick={() => handleEliminar(item.rut)}>
              <Icon className="far fa-trash-alt" />
            </IconButton>
          );
        },
      },
    },
  ]


  const onSubmit = (data, e) => {
    if (nombreBoton === 'Registrar alumno') {
      if (data.nombre === '' || data.rut === '') {
        swal({
          title: "Datos vacios",
          text: "Falta completar alguno de los datos",
          icon: "warning",
          button: "Continuar",
        });
      } else {
        axios
          .post('/api/alumnoSave', {
            nombre: data.nombre,
            rut: data.rut,
          })
          .then(
            (Response) => {

              if (Response.status === 200) {
                swal({
                  title: "Alumno registrado satisfactoriamente",
                  text: "Registrado en la base de datos",
                  icon: "success",
                  button: "Continuar",
                });
                cargar()
                e.target.reset()
              }
              console.log(Response)
            }
          )
          .catch((error) => {
            if (error.response.status === 401) {
              swal({
                title: "Error al registrar",
                text: "Este alumno ya se encuentra en la base de la datos",
                icon: "error",
                button: "Continuar",
              });
            } else {
              swal({
                title: "Error al registrar",
                text: "Hubo un problema con la conexion a la base de datos",
                icon: "error",
                button: "Continuar",
              });
            }
          })
      }
    } else {
        /// MODIFICAR
      axios
      .put("/api/alumnoUpdate/" + idUpdate, {
        nombre: document.getElementById('nombre').value,
        
      })
      .then((response) => {
        console.log(response)
        swal({
          title: "Alumno modificado satisfactoriamente",
          text: "datos guardados",
          icon: "success",
          button: "Continuar",
        });
        cargar()
      })
      .catch((error) => {
        console.log(error)
        swal({
          title: "Error",
          text: "Error: No se pudo modificar",
          icon: "error",
          button: "Continuar",
        });
        cargar()
      })
    }
  }

  useEffect(() => {
    cargar();
  }, []);


  React.useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );
    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  const cargar = async () => {
    const { data } = await axios.get("/api/alumnos");
    setItem(data);
    return null;
  }

  const handleEliminar = (id) => {
    axios
      .delete("/api/alumnoEliminar/" + id)
      .then((response) => {
        console.log(response)
        swal({
          title: "Eliminado",
          text: "Alumno eliminado satisfactoriamente",
          icon: "success",
          button: "Continuar",
        });
        cargar()
      })
      .catch((error) => {
        console.log(error)
        swal({
          title: "Error",
          text: "Error: No se pudo borrar",
          icon: "error",
          button: "Continuar",
        });
        cargar()
      })

  }


  const handleSeleccion = (item) => {
    if (selectedAlumno === item._id) {
      setSelectedAlumno(null)
      document.getElementById('rut').value = ""
      document.getElementById('rut').disabled = false
      document.getElementById('nombre').value = ""
      setIdUpdate(null)
      setNombreBoton('Registrar alumno')
    } else {
      setSelectedAlumno(item._id);
      document.getElementById('rut').value = item.rut
      document.getElementById('rut').disabled = true
      document.getElementById('nombre').value = item.nombre
      setIdUpdate(item._id)
      setNombreBoton('Modificar alumno')
    }
  }

  console.log(errors);
  return (
    <Grid>
      <Card className={classes.paper}>
        <CardContent className={classes.nose}>
          <Typography component="h1" variant="h4" align="center">
            {nombreBoton}.
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} name="libros" noValidate>
            <Grid >
              <Grid className={classes.inputs}>
                <TextField
                  required
                  fullWidth
                  className={classes.espaciado}
                  name="rut"
                  label="Rut del alumno"
                  inputRef={register}
                  id="rut"
                  autoComplete="rut por defecto"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />


                <TextField
                  required
                  id="nombre"
                  className={classes.espaciado}
                  fullWidth
                  label="Nombre del alumno"
                  name="nombre"
                  inputRef={register}
                  autoComplete="Nombre por defecto"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >{nombreBoton}</Button>
            </Grid>

          </form>
        </CardContent>
      </Card>


      <Grid className={classes.datatable}>
        {item.length === 0 ? <Grid className={classes.root}><CircularProgress /> </Grid> :
          <MaterialDatatable
            title={"Alumnos"}
            data={item}
            columns={columns}
            options={{
              selectableRows: false,
              print: false,

              textLabels: {
                body: {
                  noMatch: "No se encontro ningun alumno registrado",

                },
                pagination: {
                  next: "Siguiente",
                  previous: "Página Anterior",
                  rowsPerPage: "Filas por página:",
                  displayRows: "de",

                },
                toolbar: {
                  search: "Buscar por Rut o nombre del alumno",

                },
                selectedRows: {
                  text: "Columna(s) seleccionada",
                  delete: "Eliminar",
                  deleteAria: "Delete Selected Rows",
                },
              },
              download: false,
              pagination: true,
              rowsPerPage: 5,
              usePaperPlaceholder: true,
              rowsPerPageOptions: [5, 10, 25],
              sortColumnDirection: "desc",
              filter: false,
              responsive: 'stacked',

            }}

          />}
      </Grid>
    </Grid>
  );

}