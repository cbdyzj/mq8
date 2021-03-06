"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = require("amqplib");
const util_1 = require("./util");
// 连接状态
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["Unconnected"] = 0] = "Unconnected";
    ConnectionStatus[ConnectionStatus["Connecting"] = 1] = "Connecting";
    ConnectionStatus[ConnectionStatus["Connected"] = 2] = "Connected";
    ConnectionStatus[ConnectionStatus["Dead"] = 3] = "Dead";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
// 连接句柄
class Mq8Connection {
    constructor(config = {}) {
        this.status = ConnectionStatus.Unconnected;
        this.config = config;
    }
    // 获取连接
    async getConnection() {
        switch (this.status) {
            case ConnectionStatus.Connected:
                return this.connection;
            case ConnectionStatus.Unconnected:
                await this.createConnection();
                return await this.getConnection();
            case ConnectionStatus.Connecting:
                await util_1.sleep(100);
                return await this.getConnection();
            case ConnectionStatus.Dead:
                throw new Error('连接已关闭！');
        }
    }
    // 根据当前配置创建连接
    async createConnection() {
        this.status = ConnectionStatus.Connecting;
        const { host = '127.0.0.1', username = '', password = '', vhost = '', heartbeat = 5, } = this.config;
        const prefix = username && password ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : '';
        try {
            this.connection = await amqp.connect(`amqp://${prefix}${host}${encodeURIComponent(vhost)}`, { heartbeat });
        }
        catch (error) {
            this.status = ConnectionStatus.Unconnected;
            throw error;
        }
        // 连接注册事件
        this.registerEvents();
        this.status = ConnectionStatus.Connected;
        util_1.debug('建立连接：', host, vhost);
        return this.connection;
    }
    // 为连接注册事件
    registerEvents() {
        this.connection.on('error', error => util_1.debug(error));
        this.connection.on('close', error => {
            this.status = ConnectionStatus.Unconnected;
            util_1.debug(error);
        });
    }
}
exports.Mq8Connection = Mq8Connection;
