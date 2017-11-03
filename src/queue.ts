import * as amqp from 'amqplib'
import { Channel, Connection } from 'amqplib'
import { debug } from './util'
import { Mq, MqConfig } from './mq'

export interface QueueConfig extends MqConfig {
    name: string
}

export class Queue extends Mq {

    // 队列名称
    name: string
    isAlive: boolean = false

    constructor(config: QueueConfig) {
        super(config)
        this.name = config.name
    }

    async createQueue() { }

    async checkQueue() { }

    async sendToQueue() { }

    async getMessage() { }

    async consumeMessage() { }

    async reestablish() { }
}
