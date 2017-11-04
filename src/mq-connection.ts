import * as amqp from 'amqplib'
import { Channel, Connection } from 'amqplib'
import { debug, sleep } from './util'
import { Queue, QueueConfig } from './queue'

// 连接状态
export enum Status {
    Unconnected,
    Connecting,
    Connected,
}

//连接配置
export interface MqConfig {
    host?: string
    username?: string
    password?: string
    vhost?: string
    heartbeat?: number
}

//连接句柄
export class MqConnection {

    config: MqConfig

    connection: Connection = null
    status: Status = Status.Unconnected

    constructor(config: MqConfig = {}) {
        this.config = config
    }

    async createConnection() {
        this.status = Status.Connecting
        const {
            host = '127.0.0.1',
            username = '',
            password = '',
            vhost = '',
            heartbeat = 5,
        } = this.config
        const prefix = username && password ? `${username}:${password}@` : ''
        try {
            this.connection = await amqp.connect(
                `amqp://${prefix}${host}${vhost}`,
                { heartbeat }
            )
        } catch (error) {
            this.status = Status.Unconnected
            debug(error)
        }
        this.connection.on('error', error => debug(error))
        this.connection.on('close', error => debug(error))
        this.status = Status.Connected
        debug('服务器连接建立成功！')
        return this
    }

    // 刷新连接，断线重连
    async flushConnection() {
        if (this.status === Status.Connected) {
            return this
        } else if (this.status === Status.Connecting) {
            await sleep(50)
        } else {
            await this.createConnection()
        }
        return await this.flushConnection()
    }

    async createQueue(config: QueueConfig) {
        await this.flushConnection()
        return new Queue(this, config)
    }
}