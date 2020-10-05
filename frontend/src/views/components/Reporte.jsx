import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from "react";
import axios from 'axios'
import MaterialDatatable from "material-datatable"
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import { loadCSS } from 'fg-loadcss';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import { IconButton } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
    topSpace: {
        marginTop: theme.spacing(5)
    }

}));


export default function Reporte() {
    const classes = useStyles();
    const [itemLibro, setItemLibro] = useState([])
    const [selectedLibro, setSelectedLibro] = useState(null)
    const [prestamoLibro, setPrestamoLibro] = React.useState(null)
    const [paramsLibro, setParamsLibro] = useState({
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
        }
    ]


    useEffect(() => {
        cargarLibros();
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
        const { data } = await axios.get("/api/libros");
        setItemLibro(data);

        return null;
    }

    const handleSeleccion = (item) => {
        if (selectedLibro === item._id) {
            setSelectedLibro(null)
            setPrestamoLibro(null)
        } else {
            setSelectedLibro(item._id);

            let id = item._id
            axios
                .post("/api/cantidadPrestamos", { id: id })
                .then((Response) => {
                    if (Response.status === 200) {
                        console.log(Response.data.prestamos)
                        setPrestamoLibro(Response.data.prestamos)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    setPrestamoLibro(null)
                })

        }
    }


    return (
        <Grid>
            {itemLibro.length === 0 ? <CircularProgress/> :
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

            /> }

            {!prestamoLibro === null ? "" :
            <Card className={classes.paper}>
                <CardContent className={classes.cardContent}>
                    <Typography component="h1" variant="h4" align="center">
                        Reporte del libro
                    </Typography> 
                    <Typography component="h4" variant="h5" className={classes.topSpace} align="left">
                        Cantidad de libros prestados = {prestamoLibro === null ? "Selecciona un libro" : prestamoLibro}
                    </Typography>
                </CardContent>

            </Card>}
        </Grid>
    );
}