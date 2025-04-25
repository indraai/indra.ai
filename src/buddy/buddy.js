#!/usr/bin/env node
"use strict"
// Copyright (c)2025 Quinn Michaels

import Deva from '@indra.ai/deva';
import chalk from 'chalk';
import inquire from 'inquirer';

import data from './data.json' with {type:'json'};
const {agent,vars} = data.DATA;

// set the __dirname
import process from 'node:process';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';    
const __dirname = dirname(fileURLToPath(import.meta.url));

// Creates a new DEVA Buddy.
const BUDDY = new Deva({
  agent: {
    key: agent.key,
    prompt: agent.prompt,
    voice: agent.voice,
    profile: agent.profile,
  },
  utils: {
    translate(input) {
    return input.trim();
    },
    parse(input) {
      return input.trim();
    },    
  },
  vars,
  devas: {},
  listeners: {},
  modules: {
    inquire,
  },
  func: {

    addToIndex() {
      if (this.vars.options.dir) return Promose.resolve(`📄 CUSTOM DEVA DIR. NO INDEX FILE.`);
      const indexFile = this.lib.path.join(this.vars.paths.copy_to_base, 'index.js');
      if (!this.lib.fs.existsSync(indexFile)) return Promise.reject('NO INDEX FILE TO LOAD.');

      const indexFileLoad = this.lib.fs.readFileSync(indexFile, 'utf8');

      const indexFileUpadate = indexFileLoad.replace('};', `  ${this.vars.answers.key}: require('./${this.vars.answers.key}'),\n};`);
      this.lib.fs.writeFileSync(indexFile, indexFileUpadate);
      return Promise.resolve(`${this.vars.messages.index_updated} ${indexFile}`);
    },
    baseDevaDirectory() {
      const { copy_to_base } = this.vars.paths;
      const dir_exists = this.lib.fs.existsSync(copy_to_base);
      if (!dir_exists) {
        this.lib.fs.mkdirSync(copy_to_base);
      }
      return dir_exists;
    },

    queFiles(copy_from, copy_to) {
      const { answers, create } = this.vars;
      this.vars.create.directories.push(copy_to);

      return new Promise((resolve, reject) => {

        const items = this.lib.fs.readdirSync(copy_from);
        if (!items) return reject('NO ITEMS');

        items.forEach(item => {
          const copy_from_file = this.lib.path.resolve(copy_from, item);
          const copy_to_file = this.lib.path.join(copy_to, item);

          const filestat = this.lib.fs.statSync(copy_from_file);

          if (filestat.isDirectory()) this.func.queFiles(copy_from_file, copy_to_file);
          else {
            const theyear = new Date().getFullYear();
            const content = this.lib.fs.readFileSync(copy_from_file, 'utf8')
                            .replace(/::id::/g, this.lib.uid())
                            .replace(/::owner::/g, answers.owner)
                            .replace(/::key::/g, answers.key)
                            .replace(/::year::/g, theyear)
                            .replace(/::key-upper::/g, answers.key.toUpperCase())
                            .replace(/::name::/g, answers.name)
                            .replace(/::describe::/g, answers.describe)
                            .replace(/::style::/g, answers.style)
                            .replace(/::emoji::/g, answers.emoji)
                            .replace(/::avatar::/g, answers.avatar)
                            .replace(/::background::/g, answers.background)
                            .replace(/::voice::/g, answers.voice)
                            .replace(/::gender::/g, answers.gender)
                            .replace(/::pronouns::/g, answers.pronouns)
                            .replace(/::city::/g, answers.city)
                            .replace(/::region::/g, answers.region)
                            .replace(/::nation::/g, answers.nation)
                            .replace(/::planet::/g, answers.planet)
                            .replace(/::system::/g, answers.system)
                            .replace(/::date::/g, this.lib.formatDate(Date.now(), 'long', true));

            // PUSH THE NEWLY CREATED FILE TO THE CREATE FILES ARRAY VARIABLE
            this.vars.create.files.push({copy_to_file, content});

            return resolve(this.vars.messages.que_complete);
          }
        });

      });
    },
    que() {
      const { copy_from, copy_to } = this.vars.paths;
      if (!copy_from) return console.log('no files to copy from');
      if (!copy_to) return console.log('no files to copy to');
      console.log(chalk.greenBright(this.vars.messages.que_heading));
      console.log(chalk.cyan(`↪ fr: ${copy_from}`));
      console.log(chalk.cyan(`↪ to: ${copy_to}`));
      this.func.queFiles(copy_from, copy_to).then(filesQued => {
        console.log(chalk.greenBright(filesQued));
        return this.func.createDeva();
      }).then(devaCreated => {
        console.log(chalk.greenBright(devaCreated));
        return this.func.addToIndex();
      }).then(indexAdded => {
        console.log(chalk.greenBright(indexAdded));
      }).catch(err => {
        console.error('🛑 ERROR', err);
      });
    },

    createDeva() {
      this.func.baseDevaDirectory();
      const {files,directories} = this.vars.create;
      directories.forEach(dir => {
        console.log(chalk.magenta(`${this.vars.messages.folder} ${dir}`));
        this.lib.fs.mkdirSync(dir);
      });
      files.forEach(file => {
          this.lib.fs.writeFileSync(file.copy_to_file, file.content)
          console.log(chalk.yellow(`${this.vars.messages.file} ${file.copy_to_file}`));
      });
      return Promise.resolve(`${this.vars.messages.deva_created} ${this.vars.answers.key} (${this.vars.answers.name}) `);
    },

  },

  methods: {
    inquire() {

      // this sets up a custom directory question for the user which is not in the json data
      this.vars.questions.push({                      // append directory to questions because of __dirname
        type: 'input',                                // set the input type
        name: 'directory',                            // set the name
        message: 'DIRECTORY',                         // set the MESSAGE
        default: this.lib.path.join(process.cwd(), 'devas'),    // set the default path for the question
      });

      // send the questions to inquirer to be presented to the user
      this.modules.inquire.prompt(this.vars.questions).then(answers => {

        // set the options variable to load what the BUDDY was configured with.
        this.vars.paths = {
          copy_from: this.lib.path.join(__dirname, 'template'),
          copy_to: this.lib.path.join(answers.directory, answers.key),
          copy_to_base: answers.directory,
        },

        console.log(chalk.yellow('::::::::::::::::::::::::::::'));
        console.log(chalk.blueBright.bold(this.vars.messages.heading));

        for (let answer in answers) {
          console.log(chalk.blueBright(`↪ ${answer.toUpperCase()}: `) + chalk.greenBright(answers[answer]));
        }

        console.log(chalk.yellow('::::::::::::::::::::::::::::'));

        // now this is where we take the
        this.vars.answers = answers;
        this.func.que();
      });
    },

  },
  onReady(data, resolve) {
    this.methods.inquire();                           // when buddy inits then run the inquire method.
    return resolve(data);
  },
});


export default BUDDY;
