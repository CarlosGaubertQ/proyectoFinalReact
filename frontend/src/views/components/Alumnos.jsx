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

}));

export default function Libros() {
  const { register, handleSubmit, errors } = useForm();
  const [item, setItem] = useState([])
  const classes = useStyles();
  const columns = [
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


  const onSubmit = (data,e) => {

    if (data.nombre === '' || data.rut === '') {
      swal({
        title: "Datos vacios",
        text: "Falta completar alguno de los datos",
        icon: "warning",
        button: "Continuar",
      });
    } else {
      axios
        .post('http://localhost:5000/api/alumnoSave', {
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

  }

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const { data } = await axios.get("http://localhost:5000/api/alumnos");
    setItem(data);
    return null;
  }

  const handleEliminar = (event) => {
    let id = item[event.data[0].dataIndex].rut
    axios
      .delete("http://localhost:5000/api/alumnoEliminar/" + id)
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

  console.log(errors);
  return (
    <Grid>
      <Card className={classes.paper}>
        <CardContent className={classes.nose}>
          <Typography component="h1" variant="h4" align="center">
            Guardar Alumnos.
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} name="libros" noValidate>
            <Grid >
              <Grid className={classes.inputs}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  className={classes.espaciado}
                  name="rut"
                  label="Rut del alumno"
                  inputRef={register}
                  id="rut"
                  autoComplete="rut por defecto"
                />


                <TextField
                  variant="outlined"
                  required
                  id="nombre"
                  className={classes.espaciado}
                  fullWidth
                  label="Nombre del alumno"
                  name="nombre"
                  inputRef={register}
                  autoComplete="Nombre por defecto"
                />

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >Registrar alumno</Button>
            </Grid>

          </form>
        </CardContent>
      </Card>


      <Grid className={classes.datatable}>
        {item.length === 0 ? <CircularProgress/> :
        <MaterialDatatable
          title={"Alumnos"}
          data={item}
          columns={columns}
          options={{
            selectableRows: true,
            print: false,
            onlyOneRowCanBeSelected: true,

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
            onRowsDelete: handleEliminar,
          }}

        />}
      </Grid>
    </Grid>
  );

}