import http from 'http'
import SocketService from './services/socket';
async function init(){

    const socketService = new SocketService();

    const httpServer = http.createServer();
    const PORT = process.env.PORT || 8000   

    socketService.io.attach(httpServer);
    console.log("Init Socket Listeners")
    httpServer.listen(PORT , ()=> console.log(`Server listening on PORT : ${PORT}`));

    socketService.initListeners();

}

init();