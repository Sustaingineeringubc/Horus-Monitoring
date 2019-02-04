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
    fromDate: "",
    toDate: "",
    //Avg
    voltageAvg: 0,
    currentAvg: 0,
    powerAvg: 0,
    opTempAvg: 0,
    suTempAvg: 0,
    //Max
    voltageMax: 0,
    currentMax: 0,
    powerMax: 0,
    opTempMax: 0,
    suTempMax: 0,
    //Min
    voltageMin: 0,
    currentMin: 0,
    powerMin: 0,
    opTempMin: 0,
    suTempMin: 0
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
    ipcRenderer.on("get-sensor-summary", (e, msg) => {
      if (msg.error) {
        alert(msg.error);
      } else {
        console.log("Back with info");
        console.log(msg);
        this.setState({
          //Avg
          voltageAvg: msg.data.average.voltageAvg,
          currentAvg: msg.data.average.currentAvg,
          powerAvg: msg.data.average.powerAvg,
          opTempAvg: msg.data.average.opTempAvg,
          suTempAvg: msg.data.average.suTempAvg,
          //Max
          voltageMax: msg.data.max.voltageMax,
          currentMax: msg.data.max.currentMax,
          powerMax: msg.data.max.powerMax,
          opTempMax: msg.data.max.opTempMax,
          suTempMax: msg.data.max.suTempMax,
          //Min
          voltageMin: msg.data.min.voltageMin,
          currentMin: msg.data.min.currentMin,
          powerMin: msg.data.min.powerMin,
          opTempMin: msg.data.min.opTempMin,
          suTempMin: msg.data.min.suTempMin
        });
      }
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleSendChange = () => {
    console.log("starting sending");

    let toDate = new Date(this.state.toDate).getTime() / 1000;
    let fromDate = new Date(this.state.fromDate).getTime() / 1000;
    let pumpId = this.props.sensorName;

    console.log(this.props.sensorName);
    console.log(toDate);
    console.log(fromDate);

    ipcRenderer.send("get-sensor-summary", {
      pumpId: pumpId,
      from: fromDate,
      to: toDate
    });
    console.log("info sent");
  };

  // handleStartSimulation = () => {
  //   temp();
  // }

  // handleStopSimulation = () => {
  //   stopSimulation();
  // }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    let id = 0;

    const rows = [
      createData(
        "Average",
        Math.round(this.state.voltageAvg),
        Math.round(this.state.currentAvg),
        Math.round(this.state.powerAvg),
        Math.round(this.state.opTempAvg),
        Math.round(this.state.suTempAvg),
        id
      ),
      createData(
        "Max",
        this.state.voltageMax,
        this.state.currentMax,
        this.state.powerMax,
        this.state.opTempMax,
        this.state.suTempMax,
        id
      ),
      createData(
        "Min",
        this.state.voltageMin,
        this.state.currentMin,
        this.state.powerMin,
        this.state.opTempMin,
        this.state.suTempMin,
        id
      )
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
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {this.props.sensorName + " Dashboard"}
                </Typography>
              </Grid>
              {/* <Grid item xs={3}>
                <Button onClick={this.handleStartSimulation()}>
                  Start Simulation
                </Button>
              </Grid> */}
              {/* <Grid item xs={3}>
                <Button onClick={this.handleStopSimulation()}>
                  Stop Simulation
                </Button>
              </Grid> */}
            </Grid>
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
                    colorPrimary
                    className={classes.textField}
                    defaultValue={this.state.fromDate}
                    onChange={e => this.setState({ fromDate: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                      color: "white"
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
                  className={classes.customButton}
                  onClick={() => {
                    this.handleSendChange();
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
