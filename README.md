# mq8

- 一个简单的amqplib封装

## usage

### 说明

- 队列或者交换的实例可以共用连接、通道
- 通道可以共用连接

### 安装

```
$ npm i https://github.com/cbdyzj/mq8.git 
```

### 使用

```typescript
import { Queue, debug, sleep } from '../src'

// 消息消费者
async function producer() {
    const queue = new Queue({ name: 'test' })
    while (true) {
        await queue.sendToQueue(new Buffer((new Date).toLocaleTimeString()))
        await sleep(1000)
    }
}

// 消息生产者
async function consumer() {
    const queue = new Queue({ name: 'test' })
    queue.consume(msg => {
        debug('收到消息：', msg.content.toString())
        queue.ack(msg)
    })
}

// 消费者，生产者单独连接
consumer()
producer()

```

## rabbitmq

```
$ docker-compose up -d
$ npm test
```
