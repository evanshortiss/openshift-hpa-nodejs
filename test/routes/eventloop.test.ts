import { test } from 'tap'
import { build } from '../helper'

test('eventloop/block', async (t) => {
  const time = 100

  const app = await build(t)
  const start = Date.now()
  const res = await app.inject({
    url: `/eventloop/block?time=${time}`
  })

  t.equal(res.payload, `Finished blocking for ${time}ms`)

  // Verify the process was blocked for at least the target time
  t.equal(Date.now() - start >= time, true)
})
