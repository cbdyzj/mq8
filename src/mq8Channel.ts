
import { Channel, Connection } from 'amqplib'
import { Mq8Connection, ConnectionConfig } from './mq8Connection'
import { debug, sleep } from './util'

export interface ChannelConfig {
    prefetchCount?: number
}

// 通道状态
export enum ChannelStatus {
    Unconnected,
    Connecting,
    Connected,
}

/**
 * 对amqplib通道的简单封装，不提供的方法，
 * 维护通道
 */
export class Mq8Channel {

    config: ChannelConfig
    channel: Channel = null
    connection: Mq8Connection
    status = ChannelStatus.Unconnected

    constructor(config: ChannelConfig & ConnectionConfig, connection?: Mq8Connection) {
        this.config = config
        this.connection = connection || new Mq8Connection(config)
    }

    // 刷新通道，确保通道存在
    async getChannel(): Promise<Channel> {
        switch (this.status) {
            case ChannelStatus.Connected:
                return this.channel
            case ChannelStatus.Unconnected:
                await this.createChannel()
                return await this.getChannel()
            case ChannelStatus.Connecting:
                await sleep(100)
                return await this.getChannel()
        }
    }

    protected async onRecreate() { }

    // 创建通道
    private async createChannel(recreate = false) {
        this.status = ChannelStatus.Connecting
        const { prefetchCount = 0 } = this.config
        try {
            const conn = await this.connection.getConnection()
            this.channel = await conn.createChannel()
            await this.channel.prefetch(prefetchCount)
            if (recreate) {
                await this.onRecreate()
            }
            this.registerEvents()
            this.status = ChannelStatus.Connected
            debug('建立通道：', this.toString())
            return this.channel
        } catch (error) {
            this.status = ChannelStatus.Unconnected
            throw error
        }

    }

    // 注册通道事件
    private registerEvents() {
        this.channel.on('error', error => debug(error))
        this.channel.on('close', async  error => {
            this.status = ChannelStatus.Unconnected
            await this.createChannel(true)
            debug(error)
        })
    }

}