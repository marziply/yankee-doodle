# Yankee Doodle

Yankee Doodle, abbreviated as Yank, is a Lodash.pick inspired JavaScript
package to pick object values from plain JavaScript objects. There's zero
dependencies to worry about, so naturally this package is really small at
only around 9K minified. It's safe to use in both browser and Node
environments.

> _IE11 support is currently lacking due to some regular expressions that
> aren't available in IE11 - stop using IE11!_

## Installing

```sh
$ npm i -S yankee-doodle
```

## Getting Started

If you're familiar with the `pick/pickBy` methods in Lodash, then this
package should be easy to understand quickly. You can think of this package
like a superset to `pick` from Lodash, with a feature rich schema syntax
that allows picking properties from an object in a much more declarative way.

Yanking properties from objects can be done by providing the data you want
to extract values from as the first parameter to the `yank` method, and the
properties you wish to extract as either an array of schemas or as a series
of arguments.

The schemas you provide to Yank follow a similar syntax to JSON objects,
only with the values stripped. There are additional syntaxes for
manipulating which values are picked called filters.

All syntax and demo examples below use [tests/data.json](/tests/data.json)
as the source of data for picking values from, as shown below.

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1985-01-01",
  "addressDetails": {
    "address1": "10 Downing Street",
    "address2": null,
    "address3": null,
    "city": "London",
    "postcode": "SW1A 2AB"
  },
  "nested": {
    "data": {
      "items": {
        "one": "one",
        "two": "two",
        "three": "three"
      }
    }
  }
}
```

## Syntax

Examples of schemas shown below are the strings you would provide as arguments
to Yank, each followed by their resulting value. Each schema example is assumed
to be the first and only schema parameter given to Yank.

#### Root property access

<sup>**Schema**</sup>

```text
firstName,
lastName
```

<sup>**Result**</sup>

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

---

#### Nested properties

<sup>**Schema**</sup>

```text
addressDetails: {
  city
}
```

<sup>**Result**</sup>

```json
{
  "addressDetails": {
    "city": "London"
  }
}
```

---

#### Property path access

<sup>**Schema**</sup>

```text
addressDetails.city,
nested.data.items: {
  one,
  two
}
```

<sup>**Result**</sup>

```json
{
  "city": "London",
  "items": {
    "one": "one",
    "two": "two"
  }
}
```

---

## Filters

On each key within a schema, filters can be applied to manipulate how Yank
handles the value at that location. Filters are placed after the key, separated
by a pipe (`|`), followed by parenthesis if the filter requires any arguments.
If no arguments are required, the parenthesis can be omitted. Multiple filters
can be applied simply by chaining additional filters separated by a pipe.

In addition, a macro flag can be applied to filters that support it by adding
an exclamation point (`!`) to the end of the filter name.

Below is an example schema that makes use of filters.

<sup>**Schema**</sup>

```text
firstName | as(first_name),
lastName | as(last_name),
doesNotExist | nullable,
alsoDoesNotExist | nullable!: {
  thisWillBeNull,
  soWillThis
},
dateOfBirth | as(dob) | nullable,
thisWontBeInTheResult
```

<sup>**Result**</sup>

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "doesNotExist": null,
  "alsoDoesNotExist": {
    "thisWillBeNull": null,
    "soWillThis": null
  },
  "dob": "1985-01-01"
}
```

#### Available filters

| Name | Arguments | Macro | Description |
|:---|:---|:---|:---|
| as | (alias) |  | Renames the picked property |
| nullable |  | Sets child properties to nullable | Sets property to nullable |
| extract |  |  | Merges properties into the parent depth |
| exec | (key, ...args) |  | Executes a method at the current depth with<br>additional arguments passed to the method |

## Demo

Simply spread the property names into the `yank` method and it will return
only those values from the given object.

<sup>**Usage**</sup>
``` javascript
yank(data, 'firstName', 'lastName')
```

<sup>**Result**</sup>
```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

---

Alternatively, provide an array instead, or even a spread array of arrays,
it's all the same.

<sup>**Usage**</sup>

``` javascript
yank(data, ['firstName'], ['lastName'])
```

<sup>**Result**</sup>

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

---

All schemas are stripped of whitespace before parsing, so it's easy and
convenient to format them like you would for JSON.

<sup>**Usage**</sup>

``` javascript
yank(data, `
  nested: {
    data: {
      items: {
        one,
        two
      }
    }
  }
`)
```

<sup>**Result**</sup>

```json
{
  "nested": {
    "data": {
      "items": {
        "one": "one",
        "two": "two"
      }
    }
  }
}
```

---

Have a nested object? Similar to JSON syntax, use `{` and `}` to yank child
properties. This can be as nested as you like.

<sup>**Usage**</sup>

``` javascript
yank(data, 'addressDetails: { address1, city }', 'firstName')
```

```json
{
  "addressDetails": {
    "address1": "10 Downing Street",
    "city": "London"
  },
  "firstName": "John"
}
```

---

Deeply nesting is possible as well.

<sup>**Usage**</sup>

``` javascript
yank(data, `
  nested: {
    data: {
      items: {
        one,
        two
      }
    }
  }
`)
```

```json
{
  "nested": {
    "data": {
      "items": {
        "one": "one",
        "two": "two"
      }
    }
  }
}
```

Yanking properties that don't exist will result in nothing happening for
that particular key. The example below demonstrates that an empty object is
returned because neither of the given properties exist on the original data
object.

<sup>**Usage**</sup>

``` javascript
yank(data, 'emailAddress', 'phoneNumber')
```

<sup>**Result**</sup>
```json
{}
```

---

Mixing existing properties with properties that don't exist works too. The
ones that don't exist simply get ignored.

<sup>**Usage**</sup>

``` javascript
yank(data, [
  `addressDetails: {
    county
  }`,
  `addressDetails: {
    city
  }`,
  'dateOfBirth'
])
```

<sup>**Result**</sup>

```json
{
  "addressDetails": {
    "city": "London"
  },
  "dateOfBirth": "1985-01-01"
}
```

---

## Tests

```sh
$ npm test
```

## Acknowledgments

* Heavily inspired by
  [Lodash.pick](https://github.com/lodash/lodash/blob/master/pick.js)
  and [supick](https://github.com/PavloAndriiesh/supick).
