const fs = require('fs');
const _ = require('lodash');

const TimetableEntry = require('./timetableEntry');

module.exports = class Handler {
    constructor(file) {
        this.filename = file;
    }

    load() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filename, (err, data) => {
                if (err) return reject(err);

                try {
                    this.data = JSON.parse(data);

                    return resolve(this);
               } catch (e) {
                    reject(e);
                }
            });
        })
    }

    parse() {
        return new Promise((resolve, reject) => {
            resolve(this.data.map(row => new TimetableEntry(row)));
        });
    }
}