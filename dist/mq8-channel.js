"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mq8_connection_1 = require("./mq8-connection");
const util_1 = require("./util");
// 通道状态
var ChannelStatus;
(function (ChannelStatus) {
    ChannelStatus[ChannelStatus["Unconnected"] = 0] = "Unconnected";
    ChannelStatus[ChannelStatus["Connecting"] = 1] = "Connecting";
    ChannelStatus[ChannelStatus["Connected"] = 2] = "Connected";
})(ChannelStatus = exports.ChannelStatus || (exports.ChannelStatus = {}));
/**
 * 对amqplib通道的简单封装，不提供的方法，
 * 维护通道
 */
class Mq8Channel {
    constructor(config, connection) {
        this.channel = null;
        this.status = ChannelStatus.Unconnected;
        this.config = config;
        this.connection = connection || new mq8_connection_1.Mq8Connection(config);
    }
    // 刷新通道，确保通道存在
    async getChannel() {
        switch (this.status) {
            case ChannelStatus.Connected:
                return this.channel;
            case ChannelStatus.Unconnected:
                await this.createChannel();
                return await this.getChannel();
            case ChannelStatus.Connecting:
                await util_1.sleep(100);
                return await this.getChannel();
        }
    }
    async onRecreate() { }
    // 创建通道
    async createChannel(recreate = false) {
        this.status = ChannelStatus.Connecting;
        const { prefetchCount = 0 } = this.config;
        try {
            const conn = await this.connection.getConnection();
            this.channel = await conn.createChannel();
            await this.channel.prefetch(prefetchCount);
            if (recreate) {
                await this.onRecreate();
            }
            this.registerEvents();
        }
        catch (error) {
            this.status = ChannelStatus.Unconnected;
            throw error;
        }
        this.status = ChannelStatus.Connected;
        return this.channel;
    }
    // 注册通道事件
    registerEvents() {
        this.channel.on('error', error => util_1.debug(error));
        this.channel.on('close', async (error) => {
            this.status = ChannelStatus.Unconnected;
            await this.createChannel(true);
            util_1.debug(error);
        });
    }
}
exports.Mq8Channel = Mq8Channel;
