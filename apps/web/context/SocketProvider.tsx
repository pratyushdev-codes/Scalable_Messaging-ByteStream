'use client'

import React from "react"

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg: string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    // Add the necessary value prop to the Provider
    return (
        <SocketContext.Provider value={{ sendMessage: (msg: string) => {} }}>
            {children}
        </SocketContext.Provider>
    );
}
