import { Connection } from 'amqplib';
export declare enum ConnectionStatus {
    Unconnected = 0,
    Connecting = 1,
    Connected = 2,
    Dead = 3,
}
export interface ConnectionConfig {
    host?: string;
    username?: string;
    password?: string;
    vhost?: string;
    heartbeat?: number;
}
export declare class Mq8Connection {
    connection: Connection;
    config: ConnectionConfig;
    status: ConnectionStatus;
    constructor(config?: ConnectionConfig);
    getConnection(): Promise<Connection>;
    private createConnection();
    private registerEvents();
}
