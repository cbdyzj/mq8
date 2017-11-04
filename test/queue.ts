import { MqConnection, Queue } from '../src'
import { debug, sleep } from '../src/util'

// 消息消费者
async function consumer(queue: Queue) {
    while (true) {
        await queue.sendToQueue(new Buffer((new Date).toLocaleTimeString()))
        await sleep(1000)
    }
}

// 消息生产者
async function producer(queue: Queue) {
    queue.consume(msg => {
        debug('收到消息：', msg.content.toString())
        queue.ack(msg)
    })
}

async function test() {
    const mqc = new MqConnection
    const queue = await mqc.createQueue({ name: 'test' })
    consumer(queue)
    producer(queue)
}

test.call(null)

