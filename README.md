# funcrithmetic

[![npm module](https://badge.fury.io/js/funcrithmetic.svg)](https://www.npmjs.org/package/funcrithmetic)
[![Build Status](https://travis-ci.org/christianhg/funcrithmetic.svg?branch=master)](https://travis-ci.org/christianhg/funcrithmetic)
[![Dependencies](https://david-dm.org/christianhg/funcrithmetic.svg)](https://david-dm.org/christianhg/funcrithmetic)
[![devDependencies](https://david-dm.org/christianhg/funcrithmetic/dev-status.svg)](https://david-dm.org/christianhg/funcrithmetic?type=dev)

> Monadic wrapper for doing arithmetic operations in JavaScript

* [Goal](#goal)
* [Usage](#usage)
* [Guarding against non-numbers](#guarding-against-non-numbers)
* [Advanced usage](#advanced-usage)
* [Development](#development)

## Goal

The main goal of `funcrithmetic` is to facilitate writing conventional arithmetic equations in a more straightforward way:

```js
const goldenSection = (Math.sqrt(5) + 1) / 2
// vs.
const goldenSection = FR.of(5)
  .sqr()
  .add(1)
  .div(2)
  .valueOf()
// => 1.618033988749895
```

The module aims to expose arithmetic operators in an easy-to-use fashion as well as acting as a Maybe Monad. If the term "Maybe Monad" throws you off, or the terms "Applicative" and "Functor" mean nothing to you, don't worry. You don't need to care all that much about these extra capabilities. The module can be used without ever touching this part of the API.

It is however worth noting that because `funcrithmetic` is a "Maybe Monad", it guards you against non-number values, including `undefined` and `null` (more on this later).

## Usage

To use `funcrithmetic`, an "entry point" for the arithmetic equation is picked - in this case the `5` - and the subsequent operators are chained in the desired order. The more complicated the equation is, the more the simplicity of the chain notation becomes apparent:

```js
const truncatedPentagon = Math.sqrt((5 - Math.sqrt(5)) / 2)
// vs.
const truncatedPentagon = FR.of(5)
  .sqrt()
  .subFrom(5)
  .div(2)
  .sqrt()
  .valueOf()
// => 1.1755705045849463
```

Notice the `FR.of` in the beginning of the expression? This is how values are "lifted" into the wrapper in order to get access to the arithmetic methods on it. Similarly the `.valueOf()` unwraps the value again:

```js
const wrappedFive = FR.of(5)
// => FR(5)

const wrappedTwentyFive = wrappedFive.sqr()
// => FR(25)

const wrappedTwenty = wrappedTwentyFive.sub(5)
// => FR(20)

const twenty = wrappedTwenty.valueOf()
// => 20
```

That's basically it.

* `.of(x)`: lifts a value into the wrapper.
* `.valueOf()`: unwraps the value again.

The exposed arithmetic methods on the wrapped value are:

* `.add(x)`: adds `x` to the value.
* `.dec()`: decreases the value by `1`.
* `.div(x)`: divides the value by `x`.
* `.inc()`: increases the value by `1`.
* `.exp(x)`: exponentiates the value by `x`.
* `.mul(x)`: multiplies the value by `x`.
* `.neg()`: negates the value.
* `.sub(x)`: subtracts `x` from the value.
* `.subFrom(x)`: subtracts the value from `x`.
* `.sqr()`: squares the value.
* `.sqrt()`: calculates the square root of the value.

## Guarding against non-numbers

In order to be able to chain methods as long as you want without worrying about e.g. `undefined` or `NaN`, `funcrithmetic` guards against any non-number values internally:

```js
FR.of('foo').add(2).valueOf()
// => undefined

FR.of(2).add('foo').valueOf()
// => undefined

FR.of(2).div(0).valueOf()
// => undefined

FR.of(-4).sqrt().valueOf()
// => undefined
```

Note that `funcrithmetic` regards `Infinity` and `NaN` as non-numbers. This is why `FR.of(2).div(0).valueOf()` doesn't yield `Infinity` and `FR.of(-4).sqrt().valueOf()` doesn't yield `NaN`.

## Advanced usage

Because `funcrithmetic` is monadic, some extra methods are exist on the wrapper:

* `.map(f)`: takes any function `f` and applies it to the value.
* `.chain(f)`: takes any function `f` that returns a `funcrithmetic` wrapper and applies it to the value.
* `.ap(fr)`: applies a wrapper to another wrapper that holds a function.

### Using `.map`:

```js
const res = FR.of(64).map(x => Math.sqrt(x) * 2 + 5).valueOf()
// => 21
```

### Using `.chain`:

```js
const res = FR.of(10).chain(x => FR.of(x * x)).valueOf()
// => 100
```

### Using `.ap`:

```js
const add = a => b => a + b

const res = FR.of(add)
  .ap(FR.of(3).sqr())
  .ap(FR.of(4).sqr())
  .sqrt()
  .valueOf()
// => 5
```

Note that the function has to be curried in order to apply the wrappers one by one.

## Installation

The module is distributed via [npm](https://www.npmjs.com/):

```
npm install funcrithmetic
```

And can be imported as a ES2015 module or CommonJS module depending on you setup:

```js
import FR from 'funcrithmetic'

const FR = require('funcrithmetic')
```

## Development

Run tests on watch mode:

```
npm run dev
```

Run tests and ensure proper code formatting:

```
npm test
```

Automatically format the source code including tests:

```
npm run prettier
```
