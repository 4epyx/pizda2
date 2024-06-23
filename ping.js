const util = require('util');
const exec = util.promisify(require('child_process').exec);
const config = require('./config.json');


const pingDevice = async (ip) => {
    try {
        const { stdout, stderr } = await exec(`ping ${ip} -c ${config.ping_count}`);

        if (stderr != "") {
            console.log(stderr);
        }

        console.log(stdout);

        return stdout;
    } catch(err) {
        return "DEVICE UNAVAILABLE";
    }
}

module.exports = pingDevice;