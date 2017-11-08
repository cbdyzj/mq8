import * as events from 'events'
import * as amqp from 'amqplib'
import { Connection } from 'amqplib'
import { debug, sleep } from './util'

// 连接状态
export enum ConnectionStatus {
    Unconnected,
    Connecting,
    Connected,
    Dead,
}

// 连接配置
export interface ConnectionConfig {
    host?: string
    username?: string
    password?: string
    vhost?: string
    heartbeat?: number
}

// 连接句柄
export class Mq8Connection {

    connection: Connection
    config: ConnectionConfig
    status: ConnectionStatus = ConnectionStatus.Unconnected

    constructor(config: ConnectionConfig = {}) {
        this.config = config
    }

    // 获取连接
    async getConnection(): Promise<Connection> {
        switch (this.status) {
            case ConnectionStatus.Connected:
                return this.connection
            case ConnectionStatus.Unconnected:
                await this.createConnection()
                return await this.getConnection()
            case ConnectionStatus.Connecting:
                await sleep(100)
                return await this.getConnection()
            case ConnectionStatus.Dead:
                throw new Error('连接已关闭！')
        }
    }

    // 根据当前配置创建连接
    private async createConnection() {
        this.status = ConnectionStatus.Connecting
        const {
            host = '127.0.0.1',
            username = '',
            password = '',
            vhost = '',
            heartbeat = 5,
        } = this.config
        const prefix = username && password ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : ''
        try {
            this.connection = await amqp.connect(
                `amqp://${prefix}${host}${encodeURIComponent(vhost)}`,
                { heartbeat }
            )
        } catch (error) {
            this.status = ConnectionStatus.Unconnected
            throw error
        }
        // 连接注册事件
        this.registerEvents()
        this.status = ConnectionStatus.Connected
        return this.connection
    }

    // 为连接注册事件
    private registerEvents() {
        this.connection.on('error', error => debug(error))
        this.connection.on('close', error => {
            this.status = ConnectionStatus.Unconnected
            debug(error)
        })
    }
}