'use client'

import React, { useCallback, useEffect } from "react"

import { io } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg: string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);


const sendMesage:ISocketContext['sendMessage'] = useCallback((msg)=>{
console.log("Send message" , msg);
}, [])

useEffect(()=>{
    const _socket = io('http://locahost:8000');

    return()=>{
        _socket.disconnect();
    };
    
})

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    // Add the necessary value prop to the Provider
    return (
        <SocketContext.Provider value={{ sendMessage: (msg: string) => {} }}>
            {children}
        </SocketContext.Provider>
    );
}
