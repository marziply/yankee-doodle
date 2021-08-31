import { jest } from '@jest/globals'
import Filter, { filters } from '../src/filter.js'
import Flag from '../src/flag.js'
import yank from '../src/yank.js'
import data from './data.json'

describe('src/filter', () => {
  describe('filters', () => {
    describe('as', () => {
      it('should set node.key.name to the argument given', () => {
        const name = 'test-name'
        const node = {
          key: {
            name: null
          }
        }

        filters.as({
          node,
          data,
          flag: null,
          args: [
            name
          ]
        })

        expect(node.key.name).toEqual(name)
      })

      it('should rename a property after picking it from a data object', () => {
        const result = yank(data, `
        dateOfBirth | as(dob)
      `)

        expect(result).toEqual({
          dob: data.dateOfBirth
        })
      })
    })

    describe('nullable', () => {
      it('should set node.options.nullable to true', () => {
        const node = {
          options: {
            nullable: false
          }
        }

        filters.nullable({
          node,
          data,
          flag: {
            on: jest.fn()
          },
          args: []
        })

        expect(node.options.nullable).toBe(true)
      })

      it('MACRO flag should set all children to nullable', () => {
        const node = {
          options: {
            nullable: true
          },
          children: [
            {
              options: {
                nullable: false
              }
            },
            {
              options: {
                nullable: false
              }
            }
          ]
        }

        filters.nullable({
          node,
          data,
          args: [],
          flag: {
            on: (_, cb) => cb()
          }
        })

        expect(node.options.nullable).toBe(true)
        expect(node.children.every(c => c.options.nullable === true)).toBe(true)
      })

      it('should set undefined values to null', () => {
        const result = yank(data, `
        noValueHere | nullable,
          alsoNoValueHere
        `)

        expect(result.alsoNoValueHere).toBeUndefined()
        expect(result).toEqual({
          noValueHere: null
        })
      })
    })

    describe('extract', () => {
      it('should set node.options.extract to true', () => {
        const node = {
          options: {
            extract: false
          }
        }

        filters.extract({
          node,
          data,
          args: [],
          flag: null
        })

        expect(node.options.extract).toBe(true)
      })

      it('should merge current depth of values into parent depth', () => {
        const result = yank(data, `
        addressDetails | extract: {
          address1,
          address2
        }
      `)

        expect(result.addressDetails).toBeUndefined()
        expect(result).toEqual({
          address1: data.addressDetails.address1,
          address2: data.addressDetails.address2
        })
      })
    })

    describe('exec', () => {
      it('should set node.options.exec to a method in the current depth', () => {
        const value = 'test-value'
        const arg = 'test-arg'
        const args = [
          'arg1',
          'arg2'
        ]
        const dataWithFn = {
          ...data,
          testFn: jest.fn().mockReturnValue(value)
        }
        const node = {
          options: {
            exec: null
          }
        }

        filters.exec({
          node,
          data: dataWithFn,
          flag: null,
          args: [
            'testFn',
            ...args
          ]
        })

        const result = node.options.exec(arg)

        expect(dataWithFn.testFn).toBeCalledWith(arg, ...args)
        expect(result).toEqual(value)
      })

      it('should execute a method in the current depth with the picked value', () => {
        const value = 'test-value'
        const arg = 'foo'
        const dataWithFn = {
          ...data,
          testFn: jest
            .fn()
            .mockReturnValue(value)
        }
        const result = yank(dataWithFn, `
        firstName | exec(testFn, ${arg})
      `)

        expect(dataWithFn.testFn).toBeCalledWith(data.firstName, arg)
        expect(result).toEqual({
          firstName: value
        })
      })
    })
  })

  describe('Filter', () => {
    describe('constructor', () => {
      it('should set filter, key, params, name, and flag', () => {
        const str = 'as(foo)'
        const filter = new Filter(str)

        expect(filter.filter).toEqual(str)
        expect(filter.key).toEqual('as')
        expect(filter.name).toEqual('as')
        expect(filter.params).toEqual('(foo)')
        expect(filter.flag).toBeInstanceOf(Flag)
      })
    })

    describe('apply', () => {
      it('should run fn() with options', () => {
        const filter = new Filter('as(foo)')
        const node = {
          value: 'test-node'
        }
        const data = {
          value: 'test-data'
        }

        filter.fn = jest.fn()
        filter.apply(node, data)

        expect(filter.fn).toBeCalledWith({
          flag: filter.flag,
          args: filter.args,
          node,
          data
        })
      })
    })
  })
})
