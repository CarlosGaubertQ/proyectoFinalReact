import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import axios from 'axios'
import MaterialDatatable from "material-datatable"
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
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
  },
  paper: {
    margin: theme.spacing(1, 1, 3 ),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputs: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(4),
    marginTop: theme.spacing(5),
    with: '100%'
  },
  espaciado: {
    margin: theme.spacing(2)
  },
  inputSelect: {
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(4)
  },
  cardContent: {
    width: '100%',
  },
  topSpace: {
    marginTop: theme.spacing(4),
  },
  main: {
    align: "center"
  },
}));

export default function Libros() {
  const { register, handleSubmit, errors } = useForm();
  const [item, setItem] = useState([])
  const [idioma, setIdioma] = React.useState('');
  const [selectedLibro, setSelectedLibro] = useState(null)
  const [nombreBoton, setNombreBoton] = useState('Guardar libro')
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
              color={selectedLibro === item._id ? "secondary" : ""}
            >
              <div className={classes.root}>
                {selectedLibro === item._id ? <Icon className="fa fa-check-circle" /> : <Icon className="far fa-circle" />}


              </div>
            </IconButton>
          );
        },
      },
    },
    {
      name: "Titulo del libro",
      field: "nombreLibro",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "Codigo",
      field: "_id",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "Autor",
      field: "autor",
      options: {
        filter: true,
        sort: false,
      }
    },

    {
      name: "idioma",
      field: "idioma",
      options: {
        filter: true,
        sort: false,
      }
    },
    {

      options: {
        headerNoWrap: true,
        customBodyRender: (item, tablemeta, update) => {
          return (
            <IconButton aria-label="delete"
              onClick={() => handleEliminar(item._id)}>
              <Icon className="far fa-trash-alt" />
            </IconButton>
          );
        },
      },
    },

  ]


  const handleSeleccion = (item) => {
    if (selectedLibro === item._id) {
      setSelectedLibro(null)
      document.getElementById('autor').value = ""
      document.getElementById('nombreLibro').value = ""
      setIdioma('')
      setIdUpdate(null)
      setNombreBoton('Guardar libro')
    } else {
      setSelectedLibro(item._id);
      document.getElementById('autor').value = item.autor
      document.getElementById('nombreLibro').value = item.nombreLibro
      setIdioma(item.idioma)
      setIdUpdate(item._id)
      setNombreBoton('Modificar libro')
    }
  }


  React.useEffect(() => {
    const node = loadCSS(
      'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
      document.querySelector('#font-awesome-css'),
    );
    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  const onSubmit = (data, e) => {
    if (nombreBoton === 'Guardar libro') {
      if (data.nombreLibro === '' || data.autor === '' || idioma === '') {
        swal({
          title: "Datos vacios",
          text: "Falta completar alguno de los datos",
          icon: "warning",
          button: "Continuar",
        });
      } else {
        axios
          .post('http://localhost:5000/api/librosave', {
            nombreLibro: data.nombreLibro,
            autor: data.autor,
            idioma: idioma
          })
          .then(
            (Response) => {
              console.log(Response)
              if (Response.status === 200) {
                swal({
                  title: "Libro guardado satisfactoriamente",
                  text: "Registrado en la base de datos",
                  icon: "success",
                  button: "Continuar",
                });
                cargar()
                e.target.reset()
              }

            }
          )
          .catch((error) => {
            console.log(error)
            if (error.response.status === 401) {
              swal({
                title: "Error al registrar",
                text: "Este libro ya se encuentra en la base de la datos",
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
      .put("http://localhost:5000/api/libroUpdate/" + idUpdate, {
        nombreLibro: document.getElementById('nombreLibro').value,
        autor: document.getElementById('autor').value,
        idioma: idioma,
      })
      .then((response) => {
        console.log(response)
        swal({
          title: "Libro modificado satisfactoriamente",
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

  const cargar = async () => {
    const { data } = await axios.get("http://localhost:5000/api/libros");
    setItem(data);
    return null;
  }



  const handleChange = (event) => {
    setIdioma(event.target.value);
  };


  const handleEliminar = (event) => {
    

    axios
      .delete("http://localhost:5000/api/librodelete/" + event)
      .then((response) => {
        console.log(response)
        swal({
          title: "Libro eliminado satisfactoriamente",
          text: "Eliminado de la base de datos",
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

  console.log(errors);
  return (
    <Grid className={classes.fondo}>
      <Card className={classes.paper}>
        <CardContent >
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
                  name="nombreLibro"
                  label="Nombre del libro"
                  inputRef={register}
                  id="nombreLibro"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />


                <TextField

                  required
                  id="autor"
                  className={classes.espaciado}
                  fullWidth
                  label="autor del libro"
                  name="autor"
                  inputRef={register}
                  autoComplete="autor"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Idioma</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={idioma}
                    onChange={handleChange}
                    label="idioma"
                  >
                    <MenuItem value={"ingles"}>Ingles</MenuItem>
                    <MenuItem value={"español"}>Español</MenuItem>
                  </Select>
                </FormControl>
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
      {item.length === 0 ? <CircularProgress /> :
        <MaterialDatatable
          fullWidth
          className={classes.datatable}
          title={"Libros"}
          data={item}
          columns={columns}
          options={{
            selectableRows: false,
            print: false,
            onlyOneRowCanBeSelected: false,

            textLabels: {
              body: {
                noMatch: "No se encontraron libros registrados",

              },
              pagination: {
                next: "Siguiente",
                previous: "Página Anterior",
                rowsPerPage: "Filas por página:",
                displayRows: "de",

              },
              toolbar: {
                search: "Buscar por titulo o codigo",

              },
              selectedRows: {
                text: "Columna(s) seleccionada",
                delete: "Eliminar",
                deleteAria: "Delete Selected Rows",
                icon: Card,
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
  );
}