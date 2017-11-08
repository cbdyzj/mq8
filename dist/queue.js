"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mq8_channel_1 = require("./mq8-channel");
/**
 * 对amqplib通道的简单封装
 */
class Queue extends mq8_channel_1.Mq8Channel {
    constructor(config) {
        super(config);
        this.name = config.name;
    }
    // amqplib的方法的简单封装
    // 注册消费消息的回调
    async setConsumer(onMessage, options) {
        this.consumer = { onMessage, options };
        const ch = await this.getChannel();
        return ch.consume(this.name, onMessage, options);
    }
    // 发送消息，发之前检查通道
    async sendToQueue(content, options) {
        const ch = await this.getChannel();
        return ch.sendToQueue(this.name, content, options);
    }
    // ack消息
    async ack(message, allUpTo) {
        const ch = await this.getChannel();
        return ch.ack(message, allUpTo);
    }
    // 不ack消息
    async nack(message, allUpTo, requeue) {
        const ch = await this.getChannel();
        return ch.nack(message, allUpTo, requeue);
    }
    // 重建通道的钩子
    async onRecreate() {
        const { onMessage, options } = this.consumer;
        return await this.setConsumer(onMessage, options);
    }
}
exports.Queue = Queue;
