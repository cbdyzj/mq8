import { Message } from 'amqplib'
import { Mq8Channel, ChannelConfig } from './mq8Channel'
import { Mq8Connection, ConnectionConfig } from './mq8Connection'
import { debug, sleep } from './util'

export interface QueueConfig extends ChannelConfig {
    name: string // 队列名字
}

export interface Consumer {
    onMessage: (msg: Message | null) => any
    options?: any
}

/**
 * 对amqplib通道的简单封装
 */
export class Queue extends Mq8Channel {

    name: string
    consumer: Consumer // 消费者,一个消息队列实例只有一个消费者
    config: QueueConfig

    constructor(config: QueueConfig & ConnectionConfig, connection?: Mq8Connection) {
        super(config, connection)
        this.name = config.name
    }

    // amqplib的方法的简单封装
    // 注册消费消息的回调
    async setConsumer(onMessage, options?): Promise<any> {
        this.consumer = { onMessage, options }
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

    toString() {
        return `Queue ${this.name}`
    }

    // 重建通道的钩子
    protected async onRecreate() {
        const { onMessage, options } = this.consumer
        return await this.setConsumer(onMessage, options)
    }
}