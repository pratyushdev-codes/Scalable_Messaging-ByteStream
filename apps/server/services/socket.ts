import { Server } from "socket.io";

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init Socket Server....");

        // Initialize the server properly
        this._io = new Server({
            cors:{
                allowedHeaders:["*"],
                origin: '*'
            }
        });
    }

    public initListeners() {
        const io = this.io;
        io.on("connect", (socket) => {
            console.log("Client connected", socket.id);

            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log("New Message received", message);
            });
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;
