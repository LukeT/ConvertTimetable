const Calendar = require('./lib/calendar');
const Parse = require('./lib/parse');

const calendar = new Calendar();
const handler = new Parse('timetable.json');

const cMap = {
    C01: 9,
    C02: 7,
    C03: 5,
    C04: 4,
    C05: 1, 
};

calendar.ready()
    .then(() => handler.load())
    .then(() => handler.parse())
    .then(data => {
        let time = 0;

        data.forEach((lecture, i) => {
            time += 500;

            setTimeout(() => {
                const colour = cMap[lecture.getModule().id];

                calendar.create({
                    summary: `${lecture.getModule().name} (${lecture.getModule().id}) [${lecture.getLecture().type}]`,
                    location: `${lecture.getLocation().room} - ${lecture.getLocation().building}`,
                    description: `Type: ${lecture.getLecture().type} \n Lecturer: ${lecture.getLecturer().name} \n`,
                    colorId: colour,
                    start: {
                        dateTime: lecture.getTime().from.format("YYYY-MM-DDTHH:mm:ssZ"),
                        timeZone: 'Europe/London',
                    },
                    end: {
                        dateTime: lecture.getTime().to.format("YYYY-MM-DDTHH:mm:ssZ"),
                        timeZone: 'Europe/London',
                    }
                });
            }, time);
        });
    }).catch(e => console.log(e));