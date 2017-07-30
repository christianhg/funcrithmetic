import test from 'ava'

import FR from './index'

const id = x => x
const add = a => b => a + b
const sub = a => b => b - a

test('has a pointed interface', t => {
  t.is(FR.of(0).valueOf(), 0)
})

test('adds', t => {
  t.is(FR.of(0).add(1).valueOf(), 1)
})

test('subtracts', t => {
  t.is(FR.of(0).sub(1).valueOf(), -1)
})

test('subtracts from', t => {
  t.is(FR.of(3).subFrom(1).valueOf(), -2)
})

test('multiplies', t => {
  t.is(FR.of(2).mul(2).valueOf(), 4)
  t.is(FR.of(-2).mul(2).valueOf(), -4)
})

test('divides', t => {
  t.is(FR.of(4).div(2).valueOf(), 2)
})

test('squares', t => {
  t.is(FR.of(4).sqr().valueOf(), 16)
})

test('square roots', t => {
  t.is(FR.of(16).sqrt().valueOf(), 4)
})

test('exponentiates', t => {
  t.is(FR.of(2).exp(3).valueOf(), 8)
  t.is(FR.of(3).exp(2).valueOf(), 9)
  t.is(FR.of(3).exp(2.5).valueOf(), 15.588457268119896)
  t.is(FR.of(10).exp(-1).valueOf(), 0.1)

  t.is(FR.of(2).exp(3).exp(2).valueOf(), 64)
})

test('increments', t => {
  t.is(FR.of(3).inc().valueOf(), 4)
})

test('decrements', t => {
  t.is(FR.of(3).dec().valueOf(), 2)
})

test('negates', t => {
  t.is(FR.of(3).neg().valueOf(), -3)
})

test('chains methods', t => {
  t.is(FR.of(5).sqrt().add(1).div(2).valueOf(), (Math.sqrt(5) + 1) / 2)

  t.is(
    FR.of(5).sqrt().subFrom(5).div(2).sqrt().valueOf(),
    Math.sqrt((5 - Math.sqrt(5)) / 2)
  )

  t.is(FR.of(5).exp(2).sub(5).valueOf(), 20)
})

test('recognises numbers', t => {
  t.is(FR.of(5).isNumber(), true)
  t.is(FR.of(-1).isNumber(), true)
})

test('does not recognise NaN as a number', t => {
  t.is(FR.of(NaN).isNumber(), false)
})

test('does not recognise Infinity as a number', t => {
  t.is(FR.of(Infinity).isNumber(), false)
  t.is(FR.of(-Infinity).isNumber(), false)
})

test('does not coerce other types to numbers', t => {
  t.is(FR.of('0').isNumber(), false)
  t.is(FR.of(null).isNumber(), false)
})

test('guards against non-numbers in arithmetic methods', t => {
  t.is(FR.of('foo').add(2).valueOf(), undefined)
  t.is(FR.of('foo').dec().valueOf(), undefined)
  t.is(FR.of('foo').div(2).valueOf(), undefined)
  t.is(FR.of('foo').inc().valueOf(), undefined)
  t.is(FR.of('foo').exp(2).valueOf(), undefined)
  t.is(FR.of('foo').mul(2).valueOf(), undefined)
  t.is(FR.of('foo').neg().valueOf(), undefined)
  t.is(FR.of('foo').sub(2).valueOf(), undefined)
  t.is(FR.of('foo').sqr().valueOf(), undefined)
  t.is(FR.of('foo').sqrt().valueOf(), undefined)

  t.is(FR.of(2).add('foo').valueOf(), undefined)
})

test('implements the Functor specification', t => {
  t.is(FR.of(2).map(id).valueOf(), FR.of(2).valueOf())
  t.is(
    FR.of(2).map(n => sub(2)(add(2)(n))).valueOf(),
    FR.of(2).map(add(2)).map(sub(2)).valueOf()
  )
  t.is(FR.of(64).map(x => Math.sqrt(x) * 2 + 5).valueOf(), 21)
})

test('implements the Applicative specification', t => {
  t.is(FR.of(2).map(id).valueOf(), FR.of(id).ap(FR.of(2)).valueOf())
  t.is(FR.of(2).map(add(2)).valueOf(), FR.of(add(2)).ap(FR.of(2)).valueOf())
  t.is(FR.of(add).ap(FR.of(2)).ap(FR.of(2)).valueOf(), 4)
  t.is(FR.of(add).ap(FR.of(3).sqr()).ap(FR.of(4).sqr()).sqrt().valueOf(), 5)

  const liftA2 = (f, fx, fy) => fx.map(f).ap(fy)

  t.is(liftA2(add, FR.of(2), FR.of(4)).valueOf(), 6)
})

test('implements the Chain specification', t => {
  t.is(FR.of(2).chain(n => FR.of(n + 2)).valueOf(), 4)
  t.is(FR.of(10).chain(x => FR.of(x * x)).valueOf(), 100)
})
