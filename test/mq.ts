import { Mq } from '../src/mq'

async function test() {
    const mq = new Mq({ host: '127.0.0.1' })
    await mq.createChannel()
}

test()