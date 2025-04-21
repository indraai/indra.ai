import Client from './client.json' with {type:'json'};
import features from '/Users/quinnmichaels/Dev/deva.world/data/features/index.js';

const client = Client.DATA;
client.features = features;

export default {client};
