const path = require("path");
const config = require("../config/config.json");
const dbPath = path.resolve(config.dbPath, config.dbName);
const moment = require("moment");
const fs = require('fs');
const util = require('util');
const readline = require('readline');
const stream = require('stream');


let AdminModel = {};

const _readLines = function({ input }) {
    const output = new stream.PassThrough({ objectMode: true });
    const rl = readline.createInterface({ input });
    console.log(rl);
    rl.on("line", line => {
        output.write(line);
    });
    rl.on("close", () => {
        output.push(null);
    });
    return output;
}

const ReadFile = async(fileName) => {
    let result = [];
    result = await fs.readFileSync(fileName).toString().split('\n');
    return result;
}

AdminModel.getLogFile = function(fileId, callback) {
    let fileName = path.normalize(__dirname + './../logs/FileManager-2019-01-14.log');
    console.log(fileName);
    ReadFile(fileName)
        .then((result) => {
            console.log(result);
            callback({
                status: 'OK',
                message: ``,
                data: result
            });
        })
        .catch((err) => {
            callback({
                status: 'FAIL',
                message: `Error ${err.message}`,
                data: null
            });
        });
}



module.exports = AdminModel;