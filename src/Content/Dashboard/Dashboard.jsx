import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// Material UI Components
import {
  Grid,
  withStyles,
  Tabs,
  Tab,
  Typography,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core";
// Components
import MonitoringData from "./MonitoringData";
import Chart from "./Chart";
import HistoryChart from "./historyChart";
//Style
import dashboardStyle from "./dashboardStyle";
import { mainTheme } from "../../assets/jss/mainStyle";
import { DatePicker } from "material-ui-pickers";
// Electron
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;
const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "#27293d"
      }
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: lightBlue.A200,
        // color: 'white',
      }
    },
    MuiPickersDay: {
      day: {
        color: "#27293d"
      },
      selected: {
        backgroundColor: "#27293d"
      },
      current: {
        color: "#1e1e2d"
      }
    },
    MuiPickersModal: {
      dialogAction: {
        color: "#27293d"
      }
    }
  }
});
class Dashboard extends Component {
  state = {
    value: 0,
    voltageData: [],
    currentData: [],
    powerData: [],
    tempData: [],
    startDate: new Date(),
    endDate: new Date()
  };

  handlestartDateChange = date => {
    this.setState({ startDate: date });
  };
  handleendDateChange = date => {
    this.setState({ endDate: date });
  };

  tick = () => {
    ipcRenderer.send("get-sensor-data", { sensorId: this.props.sensorName });
  };

  componentWillMount = () => {
    this.interval = setInterval(this.tick.bind(this), 1000);
    ipcRenderer.on("get-sensor-data", (e, msg) => {
      console.log("renderer", msg.data[0], msg.data);
      if (msg.error) {
        // return alert(msg.error);
      } else {
        // const voltageDummyData = msg.data[0];
        // const currentDummyData = msg.data[1];
        // const powerDummyData = msg.data[2];
        // const tempDummyData = msg.data[3];
        const voltageDummyData = [
          { name: "11/9/18", voltage: 174 },
          { name: "11/9/18", voltage: 134 },
          { name: "11/9/18", voltage: 184 }
        ];
        const currentDummyData = [
          { name: "11/9/18", current: 734 },
          { name: "11/9/18", current: 740 },
          { name: "11/9/18", current: 800 }
        ];
        const powerDummyData = [
          { name: "11/9/18", power: 4 },
          { name: "11/9/18", power: 5 },
          { name: "11/9/18", power: 8 }
        ];
        const tempDummyData = [
          { name: "11/9/18", opTemp: 74, suTemp: 2.2 },
          { name: "12/9/18", opTemp: 64, suTemp: 0.7 },
          { name: "13/9/18", opTemp: 12, suTemp: 1.6 },
          { name: "14/9/18", opTemp: 79, suTemp: 0.8 },
          { name: "15/9/18", opTemp: 82, suTemp: 5.1 }
        ];
        this.setState({
          voltageData: voltageDummyData,
          currentData: currentDummyData,
          powerData: powerDummyData,
          tempData: tempDummyData
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

  render() {
    const { classes } = this.props;
    const { value } = this.state;

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
                  <Grid item xs={12} sm={12} md={12}>
                    <MuiThemeProvider theme={materialTheme}>
                      <center>
                        <DatePicker
                          label="Start"
                          showTodayButton
                          maxDateMessage="Date must be less than End and Today"
                          format="dd/MM/yyyy"
                          value={this.state.startDate}
                          onChange={this.handlestartDateChange}
                          className={classes.datepicker}
                        />
                        <DatePicker
                          label="End"
                          showTodayButton
                          maxDateMessage="Date must be less than Today"
                          format="dd/MM/yyyy"
                          value={this.state.endDate}
                          onChange={this.handleendDateChange}
                          className={classes.datepicker}
                        />
                      </center>
                    </MuiThemeProvider>
                  </Grid>
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
            {value === 2 && <Fragment>Summary</Fragment>}
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
