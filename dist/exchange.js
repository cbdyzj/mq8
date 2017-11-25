"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mq8Channel_1 = require("./mq8Channel");
class Exchange extends mq8Channel_1.Mq8Channel {
    constructor(config, connection) {
        super(config, connection);
        this.name = config.name;
    }
    async publish(routingKey, content, options) {
        const ch = await this.getChannel();
        return ch.publish(this.name, routingKey, content, options);
    }
    toString() {
        return `Exchange ${this.name}`;
    }
}
exports.Exchange = Exchange;
