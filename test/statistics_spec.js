const assert = require('chai').assert
const statistics = require('../electron/modules/statistics.js')

//Testing constants
const TEST_DATA = [
    [106, 112, 103, 173, 137],  //Voltage
    [1, 1, 5, 1, 0],            //Current
    [60, 50, 100, 300, 200],    //Power
    [24, 26, 21, 27, 21],       //Atmospheric Temperature
    [49, 42, 41, 43, 48]        //Solar Panel Temperature
]

describe('Statistics Test', function() {
    this.timeout(10000)
    it('Calculate Average Test', async function() {
        let summary = await statistics.getAvgFromData(TEST_DATA)
        assert.equal(Math.round(summary.voltageAvg), 126)   //Voltage Average
        assert.equal(Math.round(summary.currentAvg), 2)     //Current Average
        assert.equal(Math.round(summary.powerAvg), 142)   //Power Average
        assert.equal(Math.round(summary.opTempAvg), 24)    //Atmospheric Temperature Average
        assert.equal(Math.round(summary.suTempAvg), 45)    //Solar Panel Temperature Average
    })

    it('Calculate Max Value Test', async function() {
        let summary = await statistics.getMaxFromData(TEST_DATA)
        assert.equal(summary.voltageMax, 173)   //Voltage Max
        assert.equal(summary.currentMax, 5)     //Current Max
        assert.equal(summary.powerMax, 300)   //Power Max
        assert.equal(summary.opTempMax, 27)    //Atmospheric Temperature Max
        assert.equal(summary.suTempMax, 49)    //Solar Panel Temperature Max
    })

    it('Calculate Min Value Test', async function() {
        let summary = await statistics.getMinFromData(TEST_DATA)
        assert.equal(summary.voltageMin, 103)   //Voltage Min
        assert.equal(summary.currentMin, 0)     //Current Min
        assert.equal(summary.powerMin, 50)   //Power Min
        assert.equal(summary.opTempMin, 21)    //Atmospheric Temperature Min
        assert.equal(summary.suTempMin, 41)    //Solar Panel Temperature Min
    })
})
