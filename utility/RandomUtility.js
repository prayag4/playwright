const randomstring = require('randomstring');
// const faker = require('faker');
const { faker } = require('@faker-js/faker');



class RandomUtility {
    async generateRandomString() {
        const randomString = randomstring.generate(10);
        return randomString
    }

    async generateRandomNumberss(min, max) {
        const number = Math.random() * (max - min) + min;
        return Math.floor(number)
    }

    async generateRandomNumber(min = 1, max = 1000000) {
        const number = Math.random() * (max - min) + min;
        return String(Math.floor(number))
    }
    //Above function will be used in below function
    async generateRandomTime() {
        const hour = await this.generateRandomNumber(0, 12);  // Use 12-hour format (0-12)
        const minute = await this.generateRandomNumber(0, 59);  // Minute range should be 0-59

        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');

        // Generate random AM or PM
        const ampm = Math.random() < 0.5 ? 'AM' : 'PM';

        const text = `${formattedHour}:${formattedMinute} ${ampm}`;  // Add AM or PM
        return text;
    }
    async generateRandomTimeRange() {
        // Generate a random start hour and minute
        const startHour = await this.generateRandomNumber(0, 12); // 0-12 for 12-hour format
        const startMinute = await this.generateRandomNumber(0, 59); // 0-59 for minutes

        // Format the start time
        const formattedStartHour = startHour.toString().padStart(2, '0');
        const formattedStartMinute = startMinute.toString().padStart(2, '0');
        const startAmpm = Math.random() < 0.5 ? 'AM' : 'PM';
        const startTime = `${formattedStartHour}:${formattedStartMinute} ${startAmpm}`;

        // Generate a random duration in minutes (e.g., between 15 and 180 minutes)
        const durationInMinutes = await this.generateRandomNumber(15, 180);

        // Convert start time to minutes for easier calculation
        const startTotalMinutes = (startHour % 12) * 60 + startMinute + (startAmpm === 'PM' ? 12 * 60 : 0);

        // Calculate end time in total minutes
        const endTotalMinutes = startTotalMinutes + durationInMinutes;

        // Ensure end time does not exceed 12 hours (720 minutes)
        const endHour = Math.floor((endTotalMinutes % 720) / 60);
        const endMinute = endTotalMinutes % 60;
        const endAmpm = endTotalMinutes >= 720 ? 'PM' : 'AM'; // Determine AM/PM

        // Format the end time
        const formattedEndHour = endHour.toString().padStart(2, '0');
        const formattedEndMinute = endMinute.toString().padStart(2, '0');
        const endTime = `${formattedEndHour}:${formattedEndMinute} ${endAmpm}`;

        return [startTime, endTime]; // Return the time range
    }



    async generateMultipleLineContent(lines = 5) {
        let content = '';
        for (let i = 0; i < lines; i++) {
            content += faker.lorem.sentence() + "\n";
        }
        return content;
    }

    async generateRandomEmail() {
        const randomEmail = faker.internet.email();
        return randomEmail

    }

    async getRandomSelectedValuesFromArray(array) {
        let arrayselectedValues = []
        let randomCountTocheck
        if (array.length === 1) {
            randomCountTocheck = 1;
        } else {
            randomCountTocheck = Math.ceil(Math.random() * (array.length - 1))
        }
        if (randomCountTocheck <= 5) {
            for (let i = 0; i < randomCountTocheck; i++) {
                let randomIndex = Math.floor(Math.random() * array.length)
                arrayselectedValues.push(array[randomIndex])
                array.splice(randomIndex, 1);
            }
        }
        else {
            for (let i = 0; i < 5; i++) {
                let randomIndex = Math.floor(Math.random() * array.length)
                arrayselectedValues.push(array[randomIndex])
                array.splice(randomIndex, 1)
            }

        }
        return arrayselectedValues
    }

    async getRandomSelectedOneValueFromArray(array) {
        let randomIndex = Math.floor(Math.random() * array.length)
        let selectedValue = array[randomIndex]
        return selectedValue
    }

    async generateFakePhoneNumber() {
        const firstDigit = faker.helpers.arrayElement(['9', '8', '7', '6']);

        // Generate remaining 9 digits
        const remaining = faker.string.numeric(9);

        // Combine to make 10-digit number
        const number = `${firstDigit}${remaining}`;

        // Optionally add country code
        const e164Number = `+91${number}`;

        return e164Number;
    }
    async formatDateToDDMMYYYY(date) {
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
        const year = date.getFullYear(); // Get full year

        return `${day}/${month}/${year}`; // Return formatted date
    }

    async getRandomDate() {
        //get today date
        let todayDate = new Date();

        const twoYearsInMillis = 2 * 365 * 24 * 60 * 60 * 60

        // for date range of plus or minus 2
        const randomOffset = Math.floor(Math.random() * twoYearsInMillis * 2) - twoYearsInMillis
        const randomDate = new Date(todayDate.getTime() + randomOffset)

        //format the date
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(randomDate);

        const arrayDate = formattedDate.split(" ")
        const dateDDMMYYYformat = await this.formatDateToDDMMYYYY(randomDate)
        return [arrayDate, dateDDMMYYYformat]
    }

    async getRandomDateRange() {
        // Get the current date
        const currentDate = new Date();

        // Calculate the start and end dates for ±2 years
        const twoYearsInMs = 2 * 365 * 24 * 60 * 60 * 1000; // Approximate milliseconds in 2 years
        const startRange = new Date(currentDate.getTime() - twoYearsInMs);
        const endRange = new Date(currentDate.getTime() + twoYearsInMs);

        // Generate random start and end dates
        const randomStart = new Date(startRange.getTime() + Math.random() * (endRange - startRange));
        const randomEnd = new Date(randomStart.getTime() + Math.random() * (endRange - randomStart)); // Ensure end is after start

        //format start and random date
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const startformattedDate = new Intl.DateTimeFormat('en-GB', options).format(randomStart);
        const endformattedDate = new Intl.DateTimeFormat('en-GB', options).format(randomEnd);

        //get array
        let arrayStartDate = startformattedDate.split(" ")
        let arrayEndDate = endformattedDate.split(" ")

        const startdateDDMMYYYformat = this.formatDateToDDMMYYYY(randomStart)
        const enddateDDMMYYYformat = this.formatDateToDDMMYYYY(randomEnd)

        return [arrayStartDate, startdateDDMMYYYformat, arrayEndDate, enddateDDMMYYYformat]
    }

    async getRandomLatLong() {
        // Latitude: -90 to 90
        const latitude = (Math.random() * 180 - 90).toFixed(6);
        // Longitude: -180 to 180
        const longitude = (Math.random() * 360 - 180).toFixed(6);

        return [latitude, longitude];
    }


    async generateRandomText(length = 8) {
        const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
        const numbers = '0123456789';
        const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
        const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const allChars = specialChars + numbers + lowerCaseLetters + upperCaseLetters;
        let password = '';

        // Ensure password has at least one of each type
        password += specialChars[Math.floor(Math.random() * specialChars.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
        password += upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];

        // Generate the remaining random characters
        for (let i = password.length; i < length; i++) {
            const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
            password += randomChar;
        }

        // Shuffle the password to avoid predictable patterns
        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        return password;
    }
}
// random = new RandomUtility();
// (async () => {
//     console.log(await random.generateFakePhoneNumber("IN"))
// })()
// random.generateFakePhoneNumber("IN").then((response) => console.log("asddas ", response))
module.exports = RandomUtility;