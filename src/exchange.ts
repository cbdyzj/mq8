import { Mq8Channel, ChannelConfig } from './mq8-channel'
import { Mq8Connection, ConnectionConfig } from './mq8-connection'
import { debug, sleep } from './util'

export interface ExchangeConfig extends ChannelConfig {
    name: string // 交换名字
}

export class Exchange extends Mq8Channel {

    name: string
    config: ExchangeConfig

    constructor(config: ExchangeConfig & ConnectionConfig, connection?: Mq8Connection) {
        super(config, connection)
        this.name = config.name
    }

    async publish(routingKey, content, options?) {
        const ch = await this.getChannel()
        return ch.publish(this.name, routingKey, content, options)
    }

    toString() {
        return `Exchange ${this.name}`
    }
}
