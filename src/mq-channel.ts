import { Channel, Connection } from 'amqplib'
import { MqConnection } from './mq-connection'
import { debug, sleep } from './util'

export interface ChannelConfig {
    prefetchCount?: number
}

// 通道状态
export enum Status {
    Unconnected,
    Connecting,
    Connected,
}

/**
 * 对amqplib通道的简单封装，不提供的方法，
 * 维护通道
 */
export class MqChannel {

    config: ChannelConfig

    channel: Channel = null
    connection: MqConnection
    status = Status.Unconnected

    constructor(connection: MqConnection, config: ChannelConfig) {
        this.config = config
        this.connection = connection
    }

    async createChannel() {
        this.status = Status.Connecting
        const { prefetchCount = 0 } = this.config
        try {
            this.channel = await this.connection.connection.createChannel()
            await this.channel.prefetch(prefetchCount)
        } catch (error) {
            this.status = Status.Unconnected
            debug(error)
        }
        this.status = Status.Connected
        debug(`消息队列通道建立，队列名：${this['name']}`)
        return this
    }

    // 刷新通道，确保通道存在
    async flushChannel() {
        if (this.status === Status.Connected) {
            return this
        } else if (this.status === Status.Connecting) {
            await sleep(50)
        } else {
            await this.createChannel()
        }
        return await this.flushChannel()
    }
}