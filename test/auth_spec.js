const assert = require('chai').assert;
const datastore = require('../electron/datastore.js');
const log = require('../electron/modules/loginlogout.js')


describe('Authentication Functionality Testing', function () {
    this.timeout(10000)


  it('new User Success', async function() {
    await log.newUser(TEST_DATA.user);
    let newUser = await datastore.findUser(TEST_DATA.user.email);
    assert.equal(newUser, true, 'User created successfully');
  })

  it('new user fail', async function(){
    let x = {
      email: 'happy@gmail.com',
      password: 'testpass123',
      username: 'test',
    }
    let response = await log.newUser(x);
    assert.equal(response, undefined);
  })

  it('new Password pass', async function(){
    let msg = {
      email: TEST_DATA.user.email,
      password: 'newPass',
    }
    let response = await datastore.newPassword(msg);
    assert.equal(response, true);
  })

  it('new Password fail with non-existing email', async function(){
    let msg = {
      email: 'nonExistingEmail@gmail.com',
      password: 'newPass',
    }
    try {
      await datastore.newPassword(msg);
      assert.fail("should not get here");
    } catch (e) {
      // expected result
    }
  })

  it('new Password with same password', async function(){
    let msg = {
      email: TEST_DATA.user.email,
      password: 'testpass123',
    }
    let response = await datastore.newPassword(msg);
    assert.equal(response, true);
  })


})

const TEST_DATA = {
    user: {
        email: 'horus.sustaingineering@gmail.com',
        password: 'testpass123',
        username: 'test',
        organization: 'UBC'
    }
}