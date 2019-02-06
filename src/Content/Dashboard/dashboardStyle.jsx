// Dashboard Styles
import { primaryColor } from '../../assets/jss/mainStyle';
import { blue } from '@material-ui/core/colors';

const dashboardStyle = theme => ({
  root: {
    flexGrow: 1,
    // marginLeft: '100px',
    // marginRight: '30px',
    paddingTop: 15,
    height: '100%',
    color: 'white'
  },
  title: {
    color: 'white',
    fontSize: 20
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: primaryColor
  },
  tabs: {
    borderBottom: '1px solid #e8e8e8'
  },
  tab: {
    color: 'white',
    '&:hover': {
      color: 'white',
      opacity: 1
    }
  },
  container: {
    display: 'inline',
    flexWrap: 'wrap',
    color: 'white',
  },
  MuiInputBaseInput769Plus: {
    backgroundColor: 'red'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 20,    
    width: 200,
    color: 'white',
    backgroundColor: 'rgba(200,200,200,0.7)',
    borderRadius: '5px 5px 0px 0px',
    "&:hover": {
    },

  },
  customButton: {
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit*4,    
    width: 200,
    color: 'white',
    "&:hover": {
      backgroundColor: 'rgba(88,204,202,0.7)'
    }
  },
  tableRoot: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
  },
  
})

export default dashboardStyle
