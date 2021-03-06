import { Channel } from 'amqplib';
import { Mq8Connection, ConnectionConfig } from './mq8_connection';
export interface ChannelConfig {
    prefetchCount?: number;
}
export declare enum ChannelStatus {
    Unconnected = 0,
    Connecting = 1,
    Connected = 2,
}
/**
 * 对amqplib通道的简单封装，不提供的方法，
 * 维护通道
 */
export declare class Mq8Channel {
    config: ChannelConfig;
    channel: Channel;
    connection: Mq8Connection;
    status: ChannelStatus;
    constructor(config: ChannelConfig & ConnectionConfig, connection?: Mq8Connection);
    getChannel(): Promise<Channel>;
    protected onRecreate(): Promise<void>;
    private createChannel(recreate?);
    private registerEvents();
}
