import { Channel } from 'amqplib';
import { Mq8Channel, ChannelConfig } from './mq8-channel';
import { ConnectionConfig } from './mq8-connection';
export interface Config {
    name: string;
}
/**
 * 对amqplib通道的简单封装
 */
export declare class Queue {
    name: string;
    config: Config;
    channel: Mq8Channel;
    constructor(config: Config & ChannelConfig & ConnectionConfig, channel?: Mq8Channel);
    getChannel(): Promise<Channel>;
    consume(onMessage: any, options?: any): Promise<any>;
    sendToQueue(content: any, options?: any): Promise<boolean>;
    ack(message: any, allUpTo?: any): Promise<void>;
    nack(message: any, allUpTo?: any, requeue?: any): Promise<void>;
}
