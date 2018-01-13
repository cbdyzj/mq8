import { Queue, Exchange, debug, sleep } from '../src'

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
        await queue.sendToQueue(Buffer.from('1: ' + (new Date).toLocaleTimeString()))
        await sleep(1000)
    }
}

// 消息生产者2
async function producer2() {
    const exchange = new Exchange({ name: 'test' })
    await sleep(500)
    while (true) {
        await exchange.publish('test', Buffer.from('2: ' + (new Date).toLocaleTimeString()))
        await sleep(1000)
    }
}

consumer()
producer1()
producer2()
