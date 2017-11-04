"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mq8_channel_1 = require("./mq8-channel");
/**
 * 对amqplib通道的简单封装
 */
class Queue {
    constructor(config, channel) {
        this.name = config.name;
        this.channel = channel || new mq8_channel_1.Mq8Channel(config);
    }
    // 刷新通道，确保通道存在
    async getChannel() {
        return await this.channel.getChannel();
    }
    // amqplib的方法的简单封装
    // 注册消费消息的回调
    async consume(onMessage, options) {
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
}
exports.Queue = Queue;
