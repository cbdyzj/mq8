# mq8

- 一个简单的amqplib封装

## usage

- 安装

```
$ npm i https://github.com/cbdyzj/mq8.git 
```

- 使用

```typescript
import { Queue } from 'mq8'

// 消息生产者
async function producer(queue: Queue) {
    while (true) {
        await queue.sendToQueue(new Buffer((new Date).toLocaleTimeString()))
        await sleep(1000)
    }
}

// 消息消费者
async function consumer(queue: Queue) {
    queue.consume(msg => {
        debug('收到消息：', msg.content.toString())
        queue.ack(msg)
    })
}

const queue = new Queue({ name: 'hello' })
consumer(queue)
producer(queue)
```

## rabbitmq

```
$ docker-compose up -d
$ npm test
```
