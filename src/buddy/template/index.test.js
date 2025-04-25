// Copyright (c)::year:: ::copyright::
// ::name:: test file

const {expect} = require('chai')
const :key: = require('./index.js');

describe(::key::.me.name, () => {
  beforeEach(() => {
    return ::key::.init()
  });
  it('Check the DEVA Object', () => {
    expect(::key::).to.be.an('object');
    expect(::key::).to.have.property('agent');
    expect(::key::).to.have.property('vars');
    expect(::key::).to.have.property('listeners');
    expect(::key::).to.have.property('methods');
    expect(::key::).to.have.property('modules');
  });
})
