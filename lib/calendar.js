var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs.json';

module.exports = class GoogleCal {
    constructor() {
        this.cal = google.calendar('v3');
    }

    ready() {
        return new Promise((resolve, reject) => {
            fs.readFile('client_secret.json', (err, content) => {
                if (err) {
                    reject();
                    console.log('Error loading client secret file: ' + err);
                    return;
                }

                this.authorize(JSON.parse(content), (auth) => {
                    this.auth = auth;

                    this.setCalendar().then(resolve).catch(reject);
                });
            });
        })
    }

    storeToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    }


    getNewToken(oauth2Client, callback) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });

        console.log('Authorize this app by visiting this url: ', authUrl);

        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();

            oauth2Client.getToken(code, (err, token) => {
                if (err) {
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }

                oauth2Client.credentials = token;
                this.storeToken(token);
                callback(oauth2Client);
            });
        });
    }

    authorize(credentials, callback) {
        const oauth2Client = new (new googleAuth()).OAuth2(
            credentials.installed.client_id,
            credentials.installed.client_secret,
            credentials.installed.redirect_uris[0]
        );

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                this.getNewToken(oauth2Client, callback);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client);
            }
        });
    }

    setCalendar(id) {
        return new Promise((resolve, reject) => {
            this.getCalendars().then(data => {
                console.log("Calendars:");

                data.forEach((e, i) => {
                    console.log(`[${i}] - ${e.summary}`);
                });
                
                var rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                rl.question('Which calendar would you like to use? ', (id) => {
                    this.calendar = data[id].id;
                    resolve();
                    rl.close();
                });
            }).catch(e => {
                reject();
                console.log("[ERR] Unable to get calendars");
            });    
        });
    }

    getCalendars() {
        return new Promise((resolve, reject) => {
            this.cal.calendarList.list({
                auth: this.auth,
            }, (err, resp) => {
                if (err) return reject(err);
                return resolve(resp.items);
            })
        });
    }

    create(resource) {
        console.log(resource);

        this.cal.events.insert({
            auth: this.auth,
            resource,
            calendarId: this.calendar,
        }, (err, data) => {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
            	urn;
            }

            console.log(`Created ${data.htmlLink}`);
        });
    }
}