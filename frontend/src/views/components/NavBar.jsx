import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AccountCircle from '@material-ui/icons/AccountCircle'
import IconButton from '@material-ui/core/IconButton'
import Libros from './Libros'
import Alumnos from './Alumnos'
import Prestamos from './Prestamos'
import Devoluciones from './Devoluciones'
import Reporte from './Reporte'


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  toolbarButtons: {
    marginLeft: 'auto',
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);




  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const cerrar = () => {
    localStorage.removeItem('TOKEN_APP_TALLER');
    localStorage.removeItem('RECORDAR_APP_TALLER_UBB');

    window.location = '/login'

}

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Libros" {...a11yProps(0)} />
          <Tab label="Alumnos" {...a11yProps(1)} />
          <Tab label="Prestamos" {...a11yProps(2)} />
          <Tab label="Devoluciones" {...a11yProps(3)} />
          <Tab label="Reporte" {...a11yProps(4)} />
          <div className={classes.toolbarButtons}>
              <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={cerrar}
              >
                  <AccountCircle />
                  <p style={{ fontSize: '12px' }}>Cerrar Sesion</p>
              </IconButton>
          </div>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Libros />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Alumnos />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Prestamos/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Devoluciones />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Reporte/>
      </TabPanel>
    </div>
  );
}