# mq8

- 一个简单的amqplib封装

## usage

### 安装

```
$ npm i https://github.com/cbdyzj/mq8.git 
```

### 使用

```typescript
import { Queue, Exchange, debug, sleep } from 'mq8'

// 消息消费者
async function consumer() {
    const queue = new Queue({ name: 'test' })
    queue.setConsumer(msg => {
        debug('收到消息：', msg.content.toString())
        queue.ack(msg)
    })
}

// 消息生产者1
async function producer1() {
    const queue = new Queue({ name: 'test' })
    while (true) {
        await queue.sendToQueue(new Buffer('1: ' + (new Date).toLocaleTimeString()))
        await sleep(1000)
    }
}

// 消息生产者2
async function producer2() {
    const exchange = new Exchange({ name: 'test' })
    await sleep(500)
    while (true) {
        await exchange.publish('test', new Buffer('2: ' + (new Date).toLocaleTimeString()))
        await sleep(1000)
    }
}

consumer()
producer1()
producer2()

```

## rabbitmq

```
$ docker-compose up -d
$ npm test
```
