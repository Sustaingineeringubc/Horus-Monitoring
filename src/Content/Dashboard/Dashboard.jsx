import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// Material UI Components
import {
  Button,
  Grid,
  withStyles,
  Tabs,
  Tab,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Typography,
  MuiThemeProvider
} from "@material-ui/core";
// Components
import MonitoringData from "./MonitoringData";
import Chart from "./Chart";
import HistoryChart from "./historyChart";
//Style
import dashboardStyle from "./dashboardStyle";
import { mainTheme } from "../../assets/jss/mainStyle";
// Electron
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "rgb(40,42,60)",
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14,
    background: "lightGray"
  }
}))(TableCell);

class Dashboard extends Component {
  state = {
    value: 0,
    voltageData: [],
    currentData: [],
    powerData: [],
    tempData: [],
    fromDate: "2019-01-01",
    toDate: "2019-01-02"
  };

  tick = () => {
    ipcRenderer.send("get-sensor-data", { sensorId: this.props.sensorName });
  };

  componentWillMount = () => {
    this.interval = setInterval(this.tick.bind(this), 1000);
    ipcRenderer.on("get-sensor-data", (e, msg) => {
      if (msg.error) {
        // return alert(msg.error);
      } else {
        const voltageDummyData = msg.data[0];
        const currentDummyData = msg.data[1];
        const powerDummyData = msg.data[2];
        const tempDummyData = msg.data[3];
        this.setState({
          voltageData: voltageDummyData,
          currentData: currentDummyData,
          powerData: powerDummyData,
          tempData: tempDummyData
        });
      }
    });
    // ipcRenderer.on("get-sensor-summary", (e, msg) => {
    //   if (msg.error) {
    //     alert(msg.error);
    //   } else {
    //     console.log("Back with info");
    //     console.log(msg);
    //   }
    // });
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleSendChange = () => {
    console.log("starting sending");
    console.log(this.props.sensorName);
    console.log(this.state.fromDate);
    console.log(this.state.toDate);
    ipcRenderer.send("get-sensor-summary", {
      pumpId: this.props.sensorName,
      from: this.state.fromDate,
      to: this.state.toDate
    });
    console.log("info sent");
  };

  // handleToTextFieldChange = (e) => {
  //   this.setState({
  //       toDate: e.target.value,
  //   });
  // }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    let id = 0;
    const rows = [
      createData("Average", 159, 6.0, 24, 4.0, 9.0, id),
      createData("Max", 237, 9.0, 37, 4.3, 4.3, id),
      createData("Min", 262, 16.0, 24, 6.0, 4.3, id)
    ];

    function createData(
      name,
      voltage,
      current,
      power,
      atmosphericTemperature,
      solarPanelTemperature
    ) {
      id += 1;
      return {
        name,
        voltage,
        current,
        power,
        atmosphericTemperature,
        solarPanelTemperature,
        id
      };
    }

    return (
      <Fragment>
        <MuiThemeProvider theme={mainTheme}>
          <div className={classes.root}>
            <Typography variant="h4" color="primary" gutterBottom>
              {this.props.sensorName + " Dashboard"}
            </Typography>
            <MonitoringData />
            <br />
            <Tabs
              value={value}
              className={classes.tabs}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
              // scrollable
              // scrollButtons="auto"
            >
              <Tab className={classes.tab} label="Current" />
              <Tab className={classes.tab} label="History" />
              <Tab className={classes.tab} label="Summary" />
            </Tabs>
            {value === 0 && (
              <Fragment>
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Chart
                      data={this.state.voltageData}
                      type="Voltage"
                      title={"Voltage"}
                      dataKey1="voltage"
                      dataKey2=""
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Chart
                      data={this.state.currentData}
                      type="Current"
                      title={"Current"}
                      dataKey1="current"
                      dataKey2=""
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Chart
                      data={this.state.powerData}
                      type="Power"
                      title={"Power"}
                      dataKey1="power"
                      dataKey2=""
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Chart
                      data={this.state.tempData}
                      type="Temperature"
                      title={"Temperature"}
                      dataKey1="opTemp"
                      dataKey2="suTemp"
                    />
                  </Grid>
                </Grid>
              </Fragment>
            )}
            {value === 1 && (
              <Fragment>
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12} md={6}>
                    <HistoryChart
                      data={this.state.voltageData}
                      type="Voltage"
                      title={"Voltage"}
                      dataKey1="voltage"
                      dataKey2=""
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <HistoryChart
                      data={this.state.currentData}
                      type="Current"
                      title={"Current"}
                      dataKey1="current"
                      dataKey2=""
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <HistoryChart
                      data={this.state.powerData}
                      type="Power"
                      title={"Power"}
                      dataKey1="power"
                      dataKey2=""
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <HistoryChart
                      data={this.state.tempData}
                      type="Temperature"
                      title={"Temperature"}
                      dataKey1="opTemp"
                      dataKey2="suTemp"
                    />
                  </Grid>
                </Grid>
              </Fragment>
            )}
            {value === 2 && (
              <Fragment>
                <form className={classes.container} noValidate>
                  <TextField
                    id="fromDate"
                    label="From"
                    type="date"
                    className={classes.textField}
                    defaultValue={this.state.fromDate}
                    onChange={e => this.setState({ fromDate: e.target.value })}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </form>
                <form className={classes.container} noValidate>
                  <TextField
                    id="toDate"
                    label="To"
                    type="date"
                    className={classes.textField}
                    defaultValue={this.state.toDate}
                    onChange={e => this.setState({ toDate: e.target.value })}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </form>
                <Button
                  variant="outlined"
                  className={classes.textField}
                  onClick={() => {
                    console.log("starting sending");
                    console.log(this.props.sensorName);
                    console.log(this.state.fromDate);
                    console.log(this.state.toDate);
                    ipcRenderer.send("get-sensor-summary", {
                      pumpId: this.props.sensorName,
                      from: this.state.fromDate,
                      to: this.state.toDate
                    });
                    console.log("Info sent");
                  }}
                >
                  Send
                </Button>

                <Paper className={classes.tableRoot}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <CustomTableCell>Values</CustomTableCell>
                        <CustomTableCell align="right">Voltage</CustomTableCell>
                        <CustomTableCell align="right">Current</CustomTableCell>
                        <CustomTableCell align="right">Power</CustomTableCell>
                        <CustomTableCell align="right">
                          Atmospheric Temperature
                        </CustomTableCell>
                        <CustomTableCell align="right">
                          Solar Panel Temperature
                        </CustomTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map(row => {
                        return (
                          <TableRow className={classes.row} key={row.id}>
                            <CustomTableCell component="th" scope="row">
                              {row.name}
                            </CustomTableCell>
                            <CustomTableCell align="center">
                              {row.voltage}
                            </CustomTableCell>
                            <CustomTableCell align="center">
                              {row.current}
                            </CustomTableCell>
                            <CustomTableCell align="center">
                              {row.power}
                            </CustomTableCell>
                            <CustomTableCell align="center">
                              {row.atmosphericTemperature}
                            </CustomTableCell>
                            <CustomTableCell align="center">
                              {row.solarPanelTemperature}
                            </CustomTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              </Fragment>
            )}
          </div>
        </MuiThemeProvider>
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
