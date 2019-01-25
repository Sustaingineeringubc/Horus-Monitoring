/**
 * Require the files in order so that when 'mocha' is called on this file,
 * it executes the test in the correct order
 */

require(`./auth_spec.js`)
// Commented out to avoid generating spam between our emails with every test
//require(`./resetPassword_spec.js`)
require(`./filewatch_spec.js`)
require(`./datastore_spec.js`)
require(`./cache_spec.js`)
require(`./statistics_spec.js`)
require(`./sensors_spec`)