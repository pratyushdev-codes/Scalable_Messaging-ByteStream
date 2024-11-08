'use client';

import React, { useCallback, useEffect, useState, useContext } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg: string) => void;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const _socket = io('http://localhost:8000');

        _socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        _socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        setSocket(_socket);

        return () => {
            _socket.disconnect();
        };
    }, []);

    const sendMessage = useCallback((msg: string) => {
        if (socket) {
            socket.emit('message', msg);
            console.log("Sent message:", msg);
        }
    }, [socket]);

    return (
        <SocketContext.Provider value={{ sendMessage }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) {
        throw new Error("Socket context is not available. Ensure that SocketProvider is wrapped around the component using useSocket.");
    }
    return state;
};
