// Copyright (c)2025 ::copyright::
// #TestDeva test file

const {expect} = require('chai')
const :key: = require('./index.js');

describe(test.me.name, () => {
  beforeEach(() => {
    return test.init()
  });
  it('Check the DEVA Object', () => {
    expect(test).to.be.an('object');
    expect(test).to.have.property('agent');
    expect(test).to.have.property('vars');
    expect(test).to.have.property('listeners');
    expect(test).to.have.property('methods');
    expect(test).to.have.property('modules');
  });
})
