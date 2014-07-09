#!/bin/env node

var shell = require('shelljs');
var program = require('commander');
// var fs = require('fs');
var inquirer = require("inquirer");

checkForGit();

program
    .option('-a, --add', 'asks you for stuff');

program
    .command('init')
    .description('add a precommit')
    .action(function () {
        ask();
    });

program.parse(process.argv);

if (program.add) {
    console.log(process.cwd());
    ask();
}


/**
 * performs a inquirer promt and asks for precommits
 * @return {[type]} [description]
 */
function ask() {
    inquirer.prompt([{
            type: "checkbox",
            message: "Select a pre-commit-hook",
            name: "pre-commit",
            choices: [
                new inquirer.Separator("pre-commit:"), {
                    name: "jshint",
                    checked: true
                }, {
                    name: "jscs",
                    checked: true
                }
            ],
            validate: function (answer) {
                if (answer.length < 1) {
                    return "You must choose at least one topping.";
                }
                return true;
            }
        }],
        function (answers) {
            var pre = answers['pre-commit'];
            if (pre) {
                pre.map(function (item) {
                    proceedAnswer('precommit', item);
                });
            }
        });
}

function proceedAnswer(hookType, answer) {
    if (hookType === 'precommit') {
        switch (answer) {
        case 'jshint':
            console.log('jshint');
            install('jshint');
            break;
        case 'jscs':
            console.log('jscs', isInstalled(answer));
            install('jscss');
        }
    }
}

function install(module) {
    if (!isInstalled(module)) {
        wantToInstall(module);
    }
}

function wantToInstall(module) {
    inquirer.prompt([{
        type: "list",
        name: "installAction",
        message: module + " not found",
        choices: [
            "run sudo npm install -g " + module,
            "abort"
        ]
    }], function (answers) {
        shell.exec(answers.installAction.replace('run ', ''));
    });
}

/**
 * checks wheather a module is globally installed
 * using shell.which()
 * @param  {[type]}  module [description]
 * @return {Boolean}        [description]
 */
function isInstalled(module) {
    return !!shell.which(module);
}

function checkForGit() {
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.echo(shell
            .which('git'));
        shell.exit(1);
    }
}
