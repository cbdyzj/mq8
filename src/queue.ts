import { Channel, Connection } from 'amqplib'
import { Mq8Channel,  ChannelConfig } from './mq8-channel'
import { ConnectionConfig } from './mq8-connection'
import { debug, sleep } from './util'

export interface Config {
    name: string // 队列名字
}

/**
 * 对amqplib通道的简单封装
 */
export class Queue {

    name: string
    config: Config
    channel: Mq8Channel

    constructor(
        config: Config & ChannelConfig & ConnectionConfig,
        channel?: Mq8Channel
    ) {
        this.name = config.name
        this.channel = channel || new Mq8Channel(config)
    }

    // 刷新通道，确保通道存在
    async getChannel(): Promise<Channel> {
        return await this.channel.getChannel()
    }

    // amqplib的方法的简单封装
    // 注册消费消息的回调
    async consume(onMessage, options?): Promise<any> {
        const ch = await this.getChannel()
        return ch.consume(this.name, onMessage, options)
    }

    // 发送消息，发之前检查通道
    async sendToQueue(content, options?) {
        const ch = await this.getChannel()
        return ch.sendToQueue(this.name, content, options)
    }

    // ack消息
    async ack(message, allUpTo?) {
        const ch = await this.getChannel()
        return ch.ack(message, allUpTo)
    }

    // 不ack消息
    async nack(message, allUpTo?, requeue?) {
        const ch = await this.getChannel()
        return ch.nack(message, allUpTo, requeue)
    }
}