import { Mq8Channel, ChannelConfig } from './mq8-channel';
import { ConnectionConfig } from './mq8-connection';
export interface ExchangeConfig extends ChannelConfig {
    name: string;
}
export declare class Exchange extends Mq8Channel {
    name: string;
    config: ExchangeConfig;
    constructor(config: ExchangeConfig & ConnectionConfig);
    publish(routingKey: any, content: any, options?: any): Promise<boolean>;
}
