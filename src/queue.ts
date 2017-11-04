import { MqConnection } from './mq-connection'
import { MqChannel, ChannelConfig } from './mq-channel'
import { debug, sleep } from './util'

export interface QueueConfig extends ChannelConfig {
    name: string
}

/**
 * 对amqplib通道的简单封装，使用queue.channel
 */
export class Queue extends MqChannel {

    name: string

    constructor(connection: MqConnection, config: QueueConfig) {
        super(connection, config)
        this.name = config.name
    }

    // amqplib的方法的简单封装
    // 注册消费消息的回调
    async consume(onMessage, options?): Promise<any> {
        await this.flushChannel()
        return this.channel.consume(this.name, onMessage, options)
    }

    // 发送消息，发之前检查通道
    async sendToQueue(content, options?) {
        await this.flushChannel()
        return this.channel.sendToQueue(this.name, content, options)
    }

    // ack消息
    async ack(message, allUpTo?) {
        return this.channel.ack(message, allUpTo)
    }

    // 不ack消息
    async nack(message, allUpTo?, requeue?) {
        return this.channel.nack(message, allUpTo, requeue)
    }

}