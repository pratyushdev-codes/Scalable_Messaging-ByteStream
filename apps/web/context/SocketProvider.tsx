'use client';

import React, { useCallback, useEffect, useState, useContext } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg: string) => void;
    messages: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const _socket = io('http://localhost:8000');

        _socket.on('connect', () => {
            console.log('Connected to socket server');
            setSocket(_socket);
        });

        _socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        // Listen for messages from the server
        _socket.on('message', (msg: string) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            _socket.disconnect();
            setSocket(null);
        };
    }, []);

    const sendMessage = useCallback((msg: string) => {
        if (socket) {
            socket.emit('message', msg);
            console.log("Sent message:", msg);

            // Emit custom event with the message
            socket.emit('event:message', { message: msg });
        }
    }, [socket]);

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
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
