const midtransClient = require("midtrans-client")

let coreApi = new midtransClient.CoreApi({
    isProduction: false, //Development
    serverKey: "SB-Mid-server-Fjb24fPlrZGpDgqTTEdUzwpd",
    clientKey: "SB-Mid-client-wMqxu3DX8bh-NyoJ",
  });

module.exports = coreApi;