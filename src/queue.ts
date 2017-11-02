import * as amqp from 'amqplib'
import { Channel, Connection } from 'amqplib'
import { debug } from './util'
import { Mq, MqConfig, MqOption } from './mq'

export interface QueueConfig extends MqConfig { }

export interface QueueOption extends MqOption {
    queueName: string
}

export class Queue extends Mq {

    // 队列名称
    queue: string
    isAlive: boolean = false

    constructor(config: QueueConfig, option: QueueOption) {
        super(config, option)
        this.queue = option.queueName
    }

    async createQueue() { }

    async checkQueue() { }

    async sendToQueue() { }

    async getMessage() { }

    async consumeMessage() { }

    async reestablish() { }
}
