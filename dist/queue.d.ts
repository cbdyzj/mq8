import { Message } from 'amqplib';
import { Mq8Channel, ChannelConfig } from './mq8-channel';
import { ConnectionConfig } from './mq8-connection';
export interface QueueConfig extends ChannelConfig {
    name: string;
}
export interface Consumer {
    onMessage: (msg: Message | null) => any;
    options?: any;
}
/**
 * 对amqplib通道的简单封装
 */
export declare class Queue extends Mq8Channel {
    name: string;
    consumer: Consumer;
    config: QueueConfig;
    constructor(config: QueueConfig & ConnectionConfig);
    setConsumer(onMessage: any, options?: any): Promise<any>;
    sendToQueue(content: any, options?: any): Promise<boolean>;
    ack(message: any, allUpTo?: any): Promise<void>;
    nack(message: any, allUpTo?: any, requeue?: any): Promise<void>;
    protected onRecreate(): Promise<any>;
}
