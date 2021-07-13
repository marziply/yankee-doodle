module.exports = {
  as ({ node, args: [name] }) {
    node.key.name = () => name
  },
  nullable () {

  },
  extract () {

  },
  exec () {

  }
}
