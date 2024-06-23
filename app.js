const gRPC = require('@grpc/grpc-js');
const protoLoader = require("@grpc/proto-loader");
const pingDevice = require('./ping.js');
const pingParser = require('./pingParser.js')

const packageDef = protoLoader.loadSync("./monitoring.proto", {});
const gRPCObject = gRPC.loadPackageDefinition(packageDef);

const monitoring = gRPCObject.monitoring;



const checkDevice = async (call, callback) => {
    const req = call.request;
    console.log(req);
    const out = await pingDevice(req.ip);
    const res = pingParser(out)

    res.device = req;
    res.out = out;
    if (out == "DEVICE UNAVAILABLE") {
        res.need_notification = true;
    } else {
        res.need_notification = false;
    }

    console.log(res);

    return callback(null, res);
}

console.log(gRPCObject);

const server = new gRPC.Server();
server.addService(monitoring.MonitoringService.service, {
    checkDevice
});

server.bindAsync("localhost:4000", gRPC.ServerCredentials.createInsecure(), () => {
    server.start();
  });
