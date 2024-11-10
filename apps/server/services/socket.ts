import { Server } from "socket.io";
import Redis from "ioredis";
import dotenv from 'dotenv';
dotenv.config();


// Initialize Redis clients with environment variables
const pub = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '21906', 10),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});

const sub = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '21906', 10),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Initializing Socket Server...");

        // Initialize the server with proper CORS setup
        this._io = new Server({
            cors: {
                origin: '*',
                methods: ["GET", "POST"],
                allowedHeaders: ["Content-Type"],
            },
        });

        // Subscribe to Redis messages
        sub.subscribe('MESSAGES');
    }

    public initListeners() {
        const io = this.io;

        // Handle socket connections
        io.on("connection", (socket) => {
            console.log("Client connected", socket.id);

            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log("New Message received:", message);

                // Publish message to Redis channel
                await pub.publish('MESSAGES', JSON.stringify({ message }));
            });
        });

        // Handle incoming messages from Redis
        sub.on('message', (channel, message) => {
            if (channel === 'MESSAGES') {
                io.emit("message", message);
            }
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;
