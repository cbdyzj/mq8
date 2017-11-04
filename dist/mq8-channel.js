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
    registerEvents() {
        this.channel.on('error', error => util_1.debug(error));
        this.channel.on('close', error => {
            this.status = ChannelStatus.Unconnected;
            util_1.debug(error);
        });
    }
    async createChannel() {
        this.status = ChannelStatus.Connecting;
        const { prefetchCount = 0 } = this.config;
        try {
            const conn = await this.connection.getConnection();
            this.channel = await conn.createChannel();
            await this.channel.prefetch(prefetchCount);
            this.registerEvents();
        }
        catch (error) {
            this.status = ChannelStatus.Unconnected;
            util_1.debug(error);
        }
        this.status = ChannelStatus.Connected;
        util_1.debug(`消息队列通道建立！`);
        return this.channel;
    }
    // 刷新通道，确保通道存在
    async getChannel() {
        switch (this.status) {
            case ChannelStatus.Connected:
                return this.channel;
            case ChannelStatus.Unconnected:
                return await this.createChannel();
            case ChannelStatus.Connecting:
                await util_1.sleep(100);
                return await this.getChannel();
        }
    }
}
exports.Mq8Channel = Mq8Channel;
