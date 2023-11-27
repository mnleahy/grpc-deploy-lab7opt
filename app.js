var grpc = require("@grpc/grpc-js")
var protoLoader = require("@grpc/proto-loader")
var PROTO_PATH = __dirname + "/protos/random_numbers.proto"
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH
)
var random_numbers_proto = grpc.loadPackageDefinition(packageDefinition).random_numbers

// define the server and have function call and callback
function generateRandomNumbers(call, callback) {
  for(var i = 0; i < call.request.amount; i++){
    call.write({
      value: Math.round(Math.random() * 10)
    })
  }
  call.end()
}

var server = new grpc.Server()
// Add a service to our server
server.addService(random_numbers_proto.RandomService.service, { generateRandomNumbers: generateRandomNumbers})
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), function() {
  server.start()
})
