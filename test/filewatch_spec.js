const Application = require('spectron').Application;
const electronPath = require('electron');
const assert = require('chai').assert;
const fs = require('fs');
const jsonlines = require('jsonlines');
const file = require('path').resolve(__dirname, '../test-json.jsonl');
const datastore = require('../electron/datastore.js');
datastore.initializeUserId("test");
const filewatch = require('../electron/datasource/filewatch.js');

//Testing constants
const TEST_DATA = {
    number: '+16041234567',
    date: '27/11/18',
    time: '22:24:30-28',
    data: {
        pumpId: '1',
        loadVoltage: '120',
        loadCurrent: '30',
        power: '60',
        atmosphericTemperature: '20',
        solarPanelTemperature: '25',
        waterBreakerFlag: '5'
    }
};

var writeJSONFile = function() {
    return new Promise((resolve, reject) => {
        try {
            let writeStream = fs.createWriteStream(file, { 'flags': 'a', 'encoding': null, 'mode': 0666 });
            let stringifier = jsonlines.stringify();
            stringifier.pipe(writeStream);
            stringifier.write(TEST_DATA);
            stringifier.end();
            return resolve(true);
        } catch(err) {
            console.log(err);
            return reject(err);
        }
	})
}

var waitForDBData = async () => {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(async () =>{
                let newDBEntry = await datastore.getNewestSensorData('1');
                return resolve(newDBEntry);
            }, 1000);
        } catch(error) {
            console.log(error);
            return reject(error);
        }
    });
}

describe('Filewatch Test', async function () {
    this.timeout(10000);
    it('Starts the JSON Parser and writes to the JSON File to verify new Database entry', async function() {
        let write = await writeJSONFile();
        let newDBEntry = await waitForDBData();
        assert.deepStrictEqual(newDBEntry.data, TEST_DATA.data);
        setTimeout(() =>{
            process.exit();
        }, 1000);
    });
});
