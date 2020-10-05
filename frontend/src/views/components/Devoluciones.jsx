import React, { useState , useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import MaterialDatatable from "material-datatable"
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
    datatable: {
      marginTop: theme.spacing(6),
    },
  
  }));


export default function Devoluciones(){
    const [itemDevolucion, setDevolucion] = useState([])
    const classes = useStyles();
    const columnsDevoluciones = [
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
          
          },
          {
            name: "Registrar Devolucion",
            options: {
              headerNoWrap: true,
              customBodyRender: (item, tablemeta, update) => {
                return (
                  <Button
                    variant="contained"
                    onClick={() => handleSeleccionPrestamo(item)}
                    color="primary"
                  >
                    Devolver libro       
                  </Button>
                );
              },
            },
          },
    ]

    useEffect(() => {
        cargarPrestamosDevo();
    }, []);


    const cargarPrestamosDevo = async () =>{
        const { data } = await axios.get("/api/prestamosDevo");
        setDevolucion(data);
        return null;
    }


    function handleSeleccionPrestamo(item) {
        
        swal({
            title: "Registrar devolucion",
            text: "Estas apunto de devolver el libro \""+ item.nombreLibro+"\". ¿Quieres continuar?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
            .then((willAdd) => {
              if (willAdd) {
                axios
                  .put("/api/updatePrestamo/" + item._id, {
                    "fechaEntregaReal": new Date(),
                  })
                  .then(
                    (Response) => {
                      if (Response.status === 200) {
                        swal({
                          title: "Registrado satisfactoriamente",
                          text: "El libro fue devuelto a la biblioteca",
                          icon: "success",
                          button: "Continuar",
                        });
                        cargarPrestamosDevo()
                      }
                    }
                  ).catch((error) => {
                    if (error.response.status === 401) {
                      console.log(error)
                      swal({
                        title: "Error al registrar",
                        text: "No se pudo devolver el libro ya se ha devuelto con anterioridad",
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
                
              }
            });

        
    }

    return(<Grid> { itemDevolucion.length === 0 ? <CircularProgress /> :
        <MaterialDatatable
          className={classes.datatable}
          title={"Prestamos de libros que deben ser devueltos"}
          data={itemDevolucion}
          columns={columnsDevoluciones}
          options={{
            selectableRows: false,
            print: false,
            

            textLabels: {
              body: {
                noMatch: "No existen libros que se deban devolver",

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

        />} </Grid>
    )


}