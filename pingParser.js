const config = require('./config.json');

const pingParser = (out) => {
    if (out == 'DEVICE UNAVAILABLE') {
        return {
            stat: {
                transmitted: config.ping_count,
                received: 0,
                loss: config.ping_count,
                time: -1
            },
            delay: {
                min: -1,
                avg: -1,
                max: -1
            }
        }
    }


    const outRows = out.split('\n');
    const statistic = outRows.slice(3+config.ping_count);

    const statMatch = [...statistic[0].matchAll(/\d+/g)];
    const delayMatch = statistic[1].split(' = ')[1];
    const delaySplitted = delayMatch.split('/');

    return {
        stat: {
            transmitted: Number(statMatch[0][0]),
            received: Number(statMatch[1][0]),
            loss: Number(statMatch[2][0]),
            time: Number(statMatch[3][0])
        },
        delay: {
            min: Number(delaySplitted[0]),
            avg: Number(delaySplitted[1]),
            max: Number(delaySplitted[2])
        }
    }
}

module.exports = pingParser;