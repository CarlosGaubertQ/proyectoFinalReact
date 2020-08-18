import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from "react";
import axios from 'axios'
import MaterialDatatable from "material-datatable"
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import { loadCSS } from 'fg-loadcss';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import { IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import swal from 'sweetalert';
import Card from '@material-ui/core/Card';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  datatable: {
    marginTop: theme.spacing(6),
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: "100%",
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  inputsDisabled: {
    marginTop: theme.spacing(3),

  },
  root: {
    '& > span': {
      margin: theme.spacing(0),
    },
  },

}));


const steps = ['Ingresar Libro', 'Ingresar Alumno', 'Ingresar fechas', 'Orden de prestamo.'];



export default function Checkout() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [itemLibro, setItemLibro] = useState([])
  const [itemAlumno, setItemAlumno] = useState([])
  const [itemPrestamo, setItemPrestamo] = useState([])
  const [botonLibro, setBotonLibro] = useState(true)

  const [selectedLibro, setSelectedLibro] = useState(null)
  const [libroDePedido, setLibroDePedido] = useState(null)
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [alumnoDePedido, setAlumnoDePedido] = useState(null)
  const [selectedDateInicio, setSelectedDateInicio] = React.useState(new Date())
  const [selectedDateEntrega, setSelectedDateEntrega] = React.useState(new Date())
  const [paramsLibro, setParamsLibro] = useState({
    page: 1,
    per_page: 20,
  });
  const [paramsAlumno, setParamsAlumno] = useState({
    page: 1,
    per_page: 20,
  });

  const columnsLibros = [
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
                {selectedLibro === item._id ? <Icon className="fa fa-check-circle" /> : <Icon className="fa fa-circle" />}


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
    }
  ]
  const columnsAlumnos = [
    {
      name: "Seleccionar",
      options: {
        headerNoWrap: true,
        customBodyRender: (item, tablemeta, update) => {
          return (
            <IconButton

              className="btnblock"
              onClick={() => handleSeleccionAlumno(item)}
              color={selectedAlumno === item._id ? "secondary" : ""}
            >
              <div className={classes.root}>

                {selectedAlumno === item._id ? <Icon className="fa fa-check-circle" /> : <Icon className="fa fa-circle" />}

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
    }
  ]

  const columnsPrestamos = [

    
    {
      name: "Rut del Alumno",
      field: "rut",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "Nombre del alumno",
      field: "nombre",
      options: {
        filter: false,
        sort: true,
      }
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
      name: "Fecha de inicio",
      field: "fechaInicio",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "Fecha de entrega",
      field: "fechaEntrega",
      options: {
        filter: true,
        sort: false,
      }
    }
  ]

  useEffect(() => {
    cargarLibros();
    cargarAlumnos();
    cargarPrestamos();
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

  const cargarLibros = async () => {
    const { data } = await axios.get("http://localhost:5000/api/libros");
    setItemLibro(data);
    return null;
  }

  const cargarAlumnos = async () => {
    const { data } = await axios.get("http://localhost:5000/api/alumnos");
    setItemAlumno(data);
    return null;
  }

  const cargarPrestamos = async () =>{
    const { data } = await axios.get("http://localhost:5000/api/prestamos");
    setItemPrestamo(data);
    return null;
  }

  const handleNext = () => {

    if ((selectedAlumno !== null && activeStep === 0) || (activeStep === 1 )|| (activeStep === 2) || (activeStep === 3)) setBotonLibro(false)
    else setBotonLibro(true)


    if (activeStep === 3) registrarPedido(selectedLibro, selectedAlumno, selectedDateInicio, selectedDateEntrega)

    if(activeStep !== 3) setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    if ((selectedLibro !== null && activeStep === 1) || (selectedAlumno !== null && activeStep === 2) || (activeStep === 3)) setBotonLibro(false)
    else setBotonLibro(true)
    setActiveStep(activeStep - 1);
  };

  const handleSeleccion = (item) => {

    if (selectedLibro === item._id) {
      setLibroDePedido(null)
      setBotonLibro(true)
      setSelectedLibro(null)
    } else {
      setLibroDePedido(item.nombreLibro)
      setBotonLibro(false)
      setSelectedLibro(item._id);
    }

  }

  const handleSeleccionAlumno = (item) => {
    if (selectedAlumno === item._id) {
      setAlumnoDePedido(null)
      setBotonLibro(true)
      setSelectedAlumno(null)
    } else {
      setAlumnoDePedido(item.nombre)
      setBotonLibro(false)
      setSelectedAlumno(item._id);
    }
  }

  const handleDateChangeInicio = (date) => {
    if (date > selectedDateEntrega) setBotonLibro(true)
    else setBotonLibro(false)
    setSelectedDateInicio(date);
  };

  const handleDateChangeEntrega = (date) => {
    console.log(date, selectedDateInicio)
    if (selectedDateInicio >= date) setBotonLibro(true)
    else setBotonLibro(false)
    setSelectedDateEntrega(date);
  };


  const registrarPedido = (codigo, rut, dateInicio, dateEntrega) => {
    swal({
      title: "Registrar pedido",
      text: "¿Seguro que deseas registrar este pedido?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willAdd) => {
        if (willAdd) {
          axios
            .post("http://localhost:5000/api/prestamoSave", {
              "fechaInicio": dateInicio,
              "fechaEntrega": dateEntrega,
              "libro": codigo,
              "alumno": rut,
            })
            .then(
              (Response) => {
                if (Response.status === 200) {
                  swal({
                    title: "Registrado satisfactoriamente",
                    text: "La prestacion del libro fue hecho satisfactoriamente",
                    icon: "success",
                    button: "Continuar",
                  });

                  setBotonLibro(true)
                  setSelectedLibro(null)
                  setLibroDePedido(null)
                  setSelectedAlumno(null)
                  setAlumnoDePedido(null)
                  setSelectedDateInicio(new Date())
                  setSelectedDateEntrega(new Date())
                  setActiveStep(0)
                  cargarPrestamos();
                }
              }
            ).catch((error) => {
              if (error.response.status === 401) {
                console.log(error)
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
        } else {
          swal("Aun puedes revisar denuevo los datos");
        }
      });



  }


  const handleEliminar = (event) =>{
    let id = itemPrestamo[event.data[0].dataIndex]._id
    console.log(id)
    
    
    axios
    .delete("http://localhost:5000/api/eliminarPrestamo/" + id)
    .then((response) =>{
       console.log(response)
       swal({
          title: "Libro eliminado satisfactoriamente",
          text: "Eliminado de la base de datos",
          icon: "success",
          button: "Continuar",
        });
        cargarPrestamos()
    })
    .catch((error) => {
      console.log(error)
      swal({
        title: "Error",
        text: "Error: No se pudo borrar",
        icon: "error",
        button: "Continuar",
      });
      cargarPrestamos()
    })

    
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (<Grid> { itemLibro.length === 0 ? <CircularProgress /> :
        <MaterialDatatable
          className={classes.datatable}
          title={"Agregar libros"}
          data={itemLibro}
          columns={columnsLibros}
          options={{
            componentWillReceiveProps: true,
            print: false,
            selectableRows: false,
            textLabels: {
              body: {
                noMatch: <CircularProgress />,

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

            },
            download: false,
            rowsPerPage: 5,
            usePaperPlaceholder: true,
            rowsPerPageOptions: [5, 10, 25],
            sortColumnDirection: "desc",
            filter: false,
            responsive: 'stacked',
            page: paramsLibro.page - 1,

            onChangePage: (currentPage) => {
              setParamsLibro({ ...paramsLibro, page: currentPage + 1 });
            },
            onChangeRowsPerPage: (numberOfRows) => {
              setParamsLibro({ ...paramsLibro, page: 1, per_page: numberOfRows });
            },
          }}

        />}</Grid>)
      case 1:
        return (<Grid> {itemAlumno.length === 0 ? <CircularProgress /> :
        <MaterialDatatable
          title={"Alumnos"}
          data={itemAlumno}
          columns={columnsAlumnos}
          options={{
            selectableRows: false,
            print: false,
            componentWillReceiveProps: true,
            textLabels: {
              body: {
                noMatch: <CircularProgress />,

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
            page: paramsAlumno.page - 1,

            onChangePage: (currentPage) => {
              setParamsAlumno({ ...paramsAlumno, page: currentPage + 1 });
            },
            onChangeRowsPerPage: (numberOfRows) => {
              setParamsAlumno({ ...paramsAlumno, page: 1, per_page: numberOfRows });
            },
          }}

        />}</Grid>)
      case 2:
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <Grid container justify="space-around">
              <KeyboardDatePicker
                margin="normal"
                label="Fecha de inicio del prestamo"
                format="MM/dd/yyyy"
                value={selectedDateInicio}
                onChange={handleDateChangeInicio}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                margin="normal"
                label="Fecha de entrega del prestamo"
                format="MM/dd/yyyy"
                value={selectedDateEntrega}
                onChange={handleDateChangeEntrega}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        )
      case 3:
        return (
          <Grid>
            <TextField
              variant="outlined"
              className={classes.inputsDisabled}
              required
              disabled="true"
              fullWidth
              label="Libro a prestacion"
              value={libroDePedido}
            />
            <TextField
              variant="outlined"
              className={classes.inputsDisabled}
              required
              disabled="true"
              fullWidth
              label="Alumno involucrado"
              value={alumnoDePedido}
            />
            <TextField
              variant="outlined"
              className={classes.inputsDisabled}
              required
              disabled="true"
              fullWidth
              label="Fecha de inicio"
              value={selectedDateInicio}
            />
            <TextField
              variant="outlined"
              className={classes.inputsDisabled}
              required
              disabled="true"
              fullWidth
              label="Fecha de entrega"
              value={selectedDateEntrega}
            />
          </Grid>
        )
      default:
        throw new Error('Paso erroneo');
    }
  }

  

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Prestamo de libros.
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              console.log("hola 2 veces")
            ) : (
                <React.Fragment>
                  {getStepContent(activeStep)}
                  <div className={classes.buttons}>
                    {activeStep !== 0 && (
                      <Button onClick={handleBack} className={classes.button}>
                        Atras
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={botonLibro}
                      className={classes.button}
                      name='boton'
                      id='boton'
                    >
                      {activeStep === steps.length - 1 ? 'Generar orden de prestamo' : 'Siguiente'}
                    </Button>
                  </div>
                </React.Fragment>
              )}
          </React.Fragment>
        </Paper>
        { itemPrestamo.length === 0  ? <CircularProgress /> :
        <MaterialDatatable
          className={classes.datatable}
          title={"Historial de prestamos"}
          data={itemPrestamo}
          columns={columnsPrestamos}
          options={{
            selectableRows: true,
            print: false,
            onlyOneRowCanBeSelected: true,

            textLabels: {
              body: {
                noMatch: "No existe ningun prestamos registrado.",

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
            onRowsDelete: handleEliminar,
            

          }}

        />   }
      </main>
    </React.Fragment>
  );
}