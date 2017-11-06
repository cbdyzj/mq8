import { Channel, Connection } from 'amqplib'
import { Mq8Channel, ChannelConfig } from './mq8-channel'
import { ConnectionConfig } from './mq8-connection'
import { debug, sleep } from './util'

export interface ExchangeConfig {
}

export class Exchange {

    constructor(
        config: ExchangeConfig & ChannelConfig & ConnectionConfig,
        channel?: Mq8Channel
    ) {

    }
}
