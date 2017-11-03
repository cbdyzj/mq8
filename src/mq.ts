import * as amqp from 'amqplib'
import { Channel, Connection } from 'amqplib'
import { debug } from './util'

// 连接状态
export enum Status {
    Unconnected,
    Connecting,
    Connected,
}

// 配置
export interface MqConfig {
    host: string
    username?: string
    password?: string
    virsualHost?: string
    prefetchCount?: number
    heartbeat?: number
}

export class Mq {

    connection: Connection = null
    channel: Channel = null
    status = Status.Unconnected

    config: MqConfig

    constructor(config: MqConfig) {
        this.config = config
    }

    async createChannel() {
        if (this.status === Status.Connected) { return this }
        // 开始建立通道
        this.status = Status.Connecting
        const {
            host,
            username = '',
            password = '',
            virsualHost = '',
            prefetchCount = 0,
            heartbeat = 5,
        } = this.config
        try {
            if (this.connection) {
                // 这里吞掉异常
                await (this.connection.close().catch(error => debug(error)))
            }
            const prefix = username && password ? `${username}:${password}@` : ''
            this.connection = await amqp.connect(
                `amqp://${prefix}${host}${virsualHost}`,
                { heartbeat }
            )
            if (!this.connection) { throw new Error('创建连接失败！') }
            // 为连接注册事件
            this.connection.on('error', error => debug(error))
            this.connection.on('close', error => debug(error))
            this.channel = await this.connection.createChannel()
            if (!this.channel) { throw new Error('创建通道失败！') }
            await this.channel.prefetch(prefetchCount)
            debug('消息队列建立成功！')
            this.status = Status.Connected
        } catch (error) {
            debug(error)
        }
    }

}
