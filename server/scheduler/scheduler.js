const schedule = require('node-schedule');
const metaData = require('./schedule.js');

const getSqlDate = (date = null) => {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

const executeProcess = (process) => (executeDate) => {
    console.log("\n------------------------------------------");
    console.log('>>> ON DATETIME:', executeDate)
    console.log(">>> EXECUTING PROCESS ID:", process.PROCESS_ID);
    console.log(">>> EXECUTING PROCESS:", process.PROCESS_NAME);
    console.log("------------------------------------------\n");
}

const generateFrequencyString = (FREQUENCY, START_DATE) => {
    const scheduleSeconds = START_DATE.getSeconds();
    const scheduleMinutes = START_DATE.getMinutes()
    const scheduleHours = START_DATE.getHours()
    const scheduleDate = START_DATE.getDate();
    switch (FREQUENCY.toLowerCase()) {
        case 'hourly':
            return '* * */1 * * *';
        case 'daily':
            return `${scheduleSeconds} ${scheduleMinutes} ${scheduleHours} */1 * *`;
        case 'weekly':
            const weeklyDay = START_DATE.getDay();
            return `${scheduleSeconds} ${scheduleMinutes} ${scheduleHours} * * */${weeklyDay}`;
        case 'monthly':
            return `${scheduleSeconds} ${scheduleMinutes} ${scheduleHours} */${scheduleDate} * * *`;
        default:
            if (FREQUENCY) {
                return `${scheduleSeconds} */${FREQUENCY} * * * *`;
            } else {
                return START_DATE;
            }
    }
}

const readMetaDataAndScheduleJobs = () => {
    const today = Date.now();
    metaData.forEach(process => {
        const processScheduledStart = new Date(process.START_DATE);
        const processScheduledEnd = new Date(process.END_DATE);
        let freqStr = generateFrequencyString(process.FREQUENCY, processScheduledStart)
        if (processScheduledStart <= today && processScheduledEnd >= today) {
            // IF TODAY'S DATE FALLS WITHIN THE SCHEDULED WINDOW OF TIME.
            const ref = schedule.scheduleJob(freqStr, executeProcess(process));
            console.log('SCHEDULED ONE:', ref)
            console.log('NEXT INVOCATION', ref.nextInvocation())
        }
    })
}

readMetaDataAndScheduleJobs();




// console.log('THE SQL DATE IS', getSqlDate());