import { Mq8Channel, ChannelConfig } from './mq8_channel';
import { Mq8Connection, ConnectionConfig } from './mq8_connection';
export interface ExchangeConfig extends ChannelConfig {
    name: string;
}
export declare class Exchange extends Mq8Channel {
    name: string;
    config: ExchangeConfig;
    constructor(config: ExchangeConfig & ConnectionConfig, connection?: Mq8Connection);
    publish(routingKey: any, content: any, options?: any): Promise<boolean>;
    toString(): string;
}
