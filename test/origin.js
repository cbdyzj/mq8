const mq = require('amqplib')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function consumer() {
    try {
        const conn = await mq.connect('amqp://127.0.0.1')
        const ch = await conn.createChannel()
        const q = 'hello'
        ch.assertQueue(q, { durable: false });
        ch.consume(q, msg => {
            console.log('from q: ', msg.content.toString())
        }, { noAck: true })
    } catch (error) {
        console.log(error)
    }
}

async function producer() {
    try {
        const conn = await mq.connect('amqp://127.0.0.1')
        const ch = await conn.createChannel()

        const q = 'hello'
        ch.assertQueue(q, { durable: false });
        while (true) {
            ch.sendToQueue(q, Buffer.from('hello!'))
            console.log('send to q')
            await sleep(1000)
        }

    } catch (error) {
        console.log(error)
    }
}

consumer()
producer()
