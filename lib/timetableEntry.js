const moment = require('moment');

module.exports = class TimetableEntry {
    constructor(row) {
        this.class = row;
    }
    
    getLecture() {
        return {
            type: this.class.moduleType,

        }
    }
    getModule() {
        return {
            id: this.class.moduleID,
            name: this.class.moduleName,
        };
    }

    getLecturer() {
        return {
            name: this.class.lecturer,
        }
    }

    getLocation() {
        return {
            room: this.class.moduleRoom,
            building: this.class.buildingID,
        }
    }

    getTime() {
        const from = moment(this.class.start);
        const to = moment(this.class.end);

        return {
            from,
            to,
            duration: to.diff(from, 'minutes'),
        };
    }
}