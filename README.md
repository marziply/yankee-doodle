# Yankee Doodle

A Lodash.pick inspired JavaScript package to pick object values from plain JavaScript objects. Other packages lacked what I needed from an object property picker so I created this. Zero dependencies and works in all major web browsers plus Node.

## Getting Started

Super simple to use, although there are some limitations with what you can parse. If your objects are complicated, make them simpler! Data should be simple and easy to read.

### Installing

```
npm i yankee-doodle
```

### Demo

Given the the data below, you can yank values from an object using a schema or collection of schemas to build a new object with those values.

``` javascript
import yank from 'yankee-doodle'

const data = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1985-01-01',
  addressDetails: {
    address1: '10 Downing Street',
    address2: null,
    address3: null,
    city: 'London',
    postcode: 'SW1A 2AB'
  },
  nested: {
    data: {
      items: {
        one: 'one',
        two: 'two',
        three: 'three'
      }
    }
  }
}
```

Simply spread the property names into the `yank` method and it will return only those values from the given object.

``` javascript
yank(data, 'firstName', 'lastName')
// {
//   "firstName": "John",
//   "lastName": "Doe"
// }
```

Have a nested object? Similar to JSON markup, use `{` and `}` to yank children properties. This can be as nested as you like.

``` javascript
yank(data, 'addressDetails: { address1, city }', 'firstName')
// {
//   "addressDetails": {
//     "address1": "10 Downing Street",
//     "city": "London"
//   },
//   "firstName": "John"
// }
```

Deeply nesting is possible like so.

``` javascript
yank(data, 'nested: { data: { items: { one, two } } }')
// {
//   "nested": {
//     "data": {
//       "items": {
//         "one": "one",
//         "two": "two"
//       }
//     }
//   }
// }
```

You can even provide your schema with whitespace if you felt so inclined to format at this way.

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
// {
//   "nested": {
//     "data": {
//       "items": {
//         "one": "one",
//         "two": "two"
//       }
//     }
//   }
// }
```

You can even rename properties by providing the original property name followed by `->` and then the new property name you would like to change it to. This works for any given property anywhere in the schema, including nested properties.

``` javascript
yank(data, 'firstName->first_name', 'lastName->last_name', 'addressDetails->address_details: { city }')
// {
//   "first_name": "John",
//   "last_name": "Doe",
//   "address_details": {
//     "city": "London"
//   }
// }
```

Yanking properties that don't exist will result in nothing happening for that particular key. Example below demonstrates that an empty object is returned because neither of the given properties exist on the original data object.

``` javascript
yank(data, 'emailAddress', 'phoneNumber')
// {}
```

Mixing existing properties with properties that don't exist works too. The ones that don't exist simply get ignored.

``` javascript
yank(data, 'addressDetails: { county }', 'addressDetails: { city }', 'dateOfBirth')
// {
//   "addressDetails": {
//     "city": "London"
//   },
//   "dateOfBirth"
// }
```

Don't want an empty object when there are no values associated with what you're picking from? Use `yank.nullify` to return a null value instead.

``` javascript
{
  emailAddress: yank.nullify(data, 'emailAddress')
}
// {
//   "emailAddress": null
// }
```

## Todo

- Add Lodash style path keys for selecting deeply nested properties
- Add tests

## Tests

**Soon to be added**

## Authors

* **Hayden Perry** - *Maintainer* - [bakewellcake](https://github.com/bakewellcake)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

* Heavily inspired by [Lodash.pick](https://github.com/lodash/lodash/blob/master/pick.js) and [supick](https://github.com/PavloAndriiesh/supick).
