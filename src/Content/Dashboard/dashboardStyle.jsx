// Dashboard Styles
import { primaryColor } from '../../assets/jss/mainStyle';

const dashboardStyle = theme => ({
  root: {
    flexGrow: 1,
    // marginLeft: '100px',
    // marginRight: '30px',
    paddingTop: 15,
    height: '100%',
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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 20,    
    width: 200,
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
