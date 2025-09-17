"use strict";
import Client from './client.json' with {type:'json'};
import machine from './machine/index.js';
import features from './features/index.js';

const client = Client.DATA;
client.features = features;

export default {client};
