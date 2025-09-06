// ©2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under the Vedic License Agreement LICENSE.md

/**************
func:     webpack
params:   runtime
describe: runs the webpack build for the public js file from the development
					file in the src/ui directory. will then place it in the public/js directory
					for use.
***************/
import path from 'node:path';

// set the __dirname
import {fileURLToPath} from 'node:url';    
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default {
	watch: true,
	entry: './src/ui/index.js',
	mode: 'development',
	output: {
		filename: 'ui.js',
		path: path.resolve(__dirname, 'assets', 'js'),
	},
};
