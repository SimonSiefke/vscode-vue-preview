const api = require('./vue-hot-reload-api')
const Vue = require('vue')

const Counter = {
  data() {
    return {
      count: 0,
    }
  },
  created() {
    console.log('created')
  },
  render(h) {
    return h(
      'button',
      {
        on: {
          click: () => {
            this.count++
          },
        },
      },
      this.count
    )
  },
}

const CounterId = 'counter'
api.install(Vue)
api.createRecord(CounterId, Counter)

setInterval(() => {
  const newCounter = {
    created() {
      console.log('created')
    },
    render(h) {
      return h(
        'button',
        {
          on: {
            click: () => {
              this.count++
            },
          },
        },
        this.count
      )
    },
    data() {
      return {
        count: 10,
      }
    },
  }
  api.reload(CounterId, newCounter)
}, 1000)

new Vue.default({
  el: '#app',
  render: h => h(Counter),
})
