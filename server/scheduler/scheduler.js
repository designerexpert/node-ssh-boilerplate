const schedule = require('node-schedule');
const metaData = require('./schedule.js');

const getSqlDate = (date = null) => {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}

const executeProcess = (process) => (executeDate) => {
    process.LAST_RUN = getSqlDate(executeDate);
    process.NEXT_RUN = getSqlDate(process.SCHEDULE.nextInvocation()._date);
    console.log("\n------------------------------------------");
    console.log('>>> ON DATETIME:', executeDate)
    console.log(">>> EXECUTING PROCESS ID:", process.PROCESS_ID);
    console.log(">>> EXECUTING PROCESS:", process.PROCESS_NAME);
    console.log(">>> LAST RUN:", process.LAST_RUN);
    console.log(">>> NEXT RUN:", process.NEXT_RUN);
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
        const start = new Date(process.START_DATE);
        const end = new Date(process.END_DATE);
        const rule = generateFrequencyString(process.FREQUENCY, start)
        const options = { start, end, rule };
        const ref = schedule.scheduleJob(options, executeProcess(process));
        process.SCHEDULE = ref;
        process.NEXT_RUN = ref.nextInvocation();
        console.log('NEXT INVOCATION', ref.nextInvocation());
    })
}

readMetaDataAndScheduleJobs();




// console.log('THE SQL DATE IS', getSqlDate());