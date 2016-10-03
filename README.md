# Convert Timetable

This project takes a JSON file produced by MyStudentRecord and imports it to Google Calendar, JSON is found by viewing source of the calendar page

Why? Because Google Calendar is easier and the Uni doesn't provide any other way (didn't).

Requirements:
 * JSON saved as timetable.json (an Array)
 * OAuth Application created via their console (save the file as client_secret.json) -- https://console.developers.google.com/apis/credentials
 * NodeJS

How to use once configured:
 * git clone git@github.com:LukeT/ConvertTimetable.git
 * npm install
 * node .
