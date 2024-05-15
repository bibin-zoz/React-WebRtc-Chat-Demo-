const webSocket=require('websocket').server;
const http=require('http');
const server=http.createServer((req,res)=>{});
const webSocketServer=new webSocket({httpServer:server});
webSocketServer.on('request',function(request){
    const connection=request.accept(null,request.origin);
    connection.on('message',function(message){
        console.log('Received Message:',message.utf8Data);
        connection.sendUTF('Hi this is WebSocket server!');
    });
    connection.on('close',function(reasonCode,description){
        console.log('Client has disconnected.');
    });
});
server.listen(3001,function(){
    console.log('Listening on port 3001');
});