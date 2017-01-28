# Vue Testing

Let's make Vue Testing And [Mocking](https://vue-loader.vuejs.org/en/workflow/testing-with-mocks.html) Become Easier And Much Fun.

## Installation
```bash
npm install vue-testing inject-loader --save-dev
```

## Motivation
If you're testing without [```vue-testing```](https://github.com/BosNaufal/vue-testing) you'll realize that you have a long boilerplate code to mock up your component. Let me show you how it looks. It's taken from [https://vue-loader.vuejs.org/en/workflow/testing-with-mocks.html](https://vue-loader.vuejs.org/en/workflow/testing-with-mocks.html)

```html
<!-- example.vue -->
<template>
  <div class="msg">{{ msg }}</div>
</template>

<script>
// this dependency needs to be mocked
import SomeService from '../service'

export default {
  data () {
    return {
      msg: SomeService.msg
    }
  }
}
</script>
```

```javascript
// example.spec.js

// Import the component and make the injection preparation
const ExampleInjector = require('!!vue?inject!./example.vue')

// Inject and Mock External Resource
const ExampleWithMocks = ExampleInjector({
  // mock it
  '../service': {
    msg: 'Hello from a mocked service!'
  }
})

it('should render', () => {
  // Render the component manually
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: {
      'test': ExampleWithMocks
    }
  }).$mount()
  expect(vm.$el.querySelector('.msg').textContent).toBe('Hello from a mocked service!')
})
```

### Magic Vue Properties
Probably, you'll not get frustated with that code. Cause it's simple. until your component uses vue properties that magically injected by some plugin. For example ```vue-router``` injects ```this.$router``` and ```this.$route``` Or ```vuex``` injects ```this.$store```. It will throw error variable undefined since we not render the whole app. So, How do you handle it without touching your component code? It needs some effort.

```html
<!-- example.vue -->
<template>
  <div class="msg">{{ msg }}</div>
</template>

<script>
// this dependency needs to be mocked
import SomeService from '../service'

export default {
  data () {
    return {
      msg: SomeService.msg
    }
  },

  created() {
    // Use Magic Properties
    if(this.$route.params === someCondition) this.$router.push('/login')
  }
}
</script>
```

```javascript
// example.spec.js

// Import the component and make the injection preparation
const ExampleInjector = require('!!vue?inject!./example.vue')

// Inject and Mock External Resource
const ExampleWithMocks = ExampleInjector({
  // mock it
  '../service': {
    msg: 'Hello from a mocked service!'
  }
})

// You can inject magic properties this way
ExampleWithMocks.beforeCreate = function () {
  this.$route = { params: {} }
  this.$router = { push: () => {} }
}

it('should render', () => {
  // Render the component manually
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: {
      'test': ExampleWithMocks
    }
  }).$mount()

  expect(vm.$el.querySelector('.msg').textContent).toBe('Hello from a mocked service!')
})
```

### Vuex Helper Function
Oke, let's say that you always pass the router params via props since ```vue-router@2.2.x```. But you'll still get the problem  when you're using vuex helper function like ```mapActions```, ```mapStates```, ```mapGetters```. Sure, you need write more.

```html
<!-- example.vue -->
<template>
  <div class="msg">{{ msg }}</div>
</template>

<script>
// this dependency needs to be mocked
import SomeService from '../service'

// Vuex Helper Function
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      msg: SomeService.msg
    }
  },

  methods: {
    // Use It!
    ...mapActions({
      test: 'SOME_ACTION'
    })
  },

  created() {
    // Use Magic Properties
    if(this.$route.params === someCondition) this.$router.push('/login')
    // Bind It!
    this.test()
  }
}
</script>
```

```javascript
// example.spec.js

// Import the component and make the injection preparation
const ExampleInjector = require('!!vue?inject!./example.vue')

// Inject and Mock External Resource
const ExampleWithMocks = ExampleInjector({
  // mock it
  '../service': {
    msg: 'Hello from a mocked service!'
  },

  'vuex': {
    mapActions: () => {}
  }
})

// Mock The Method To Put Your Spy
ExampleWithMocks.methods = {
  ...ExampleWithMocks.methods,
  test: function() {
    return spy
  }
}

// You can inject magic properties this way
ExampleWithMocks.beforeCreate = function () {
  this.$route = { params: {} }
  this.$router = { push: () => {} }
}

it('should render', () => {
  // Render the component manually
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: {
      'test': ExampleWithMocks
    }
  }).$mount()

  expect(vm.$el.querySelector('.msg').textContent).toBe('Hello from a mocked service!')
})
```

## Let's Make It Simple!
Let's make it simple with ```vue-testing```. You'll just need little effort to mock your component constructor. Take a peek.
```javascript
// example.spec.js

// Import Vue Testing Helpers
import { mockComponent, mount } from 'vue-testing';

// Import the component and make the injection preparation
const ExampleInjector = require('!!vue?inject!./example.vue')

// Mock It!
let Component = mockComponent(ExampleInjector, {

  // You can inject component properties via propsData
  propsData: {
    msg: 'hai'
  },

  // Even You can inject the local state without breaking your beforeCreate function
  // It will save you from mapStates and mapGetters vuex function error in testing
  states: {
    localState: 'hello',
    $route: {
      params: {}
    },
    $router: {
      push: () => {}
    }
  },

  // You can inject the actions to be your local methods!
  // It will save you from mapActions vuex function error in testing
  actions: {
    test: () => spy
  },


  // Default integrated with vuex-saga
  // It will save you from mapSagas vuex-saga function error in testing
  sagas: {
    test: () => {}
  },


  // Mock the external module
  // You can just put all in one scope
  '../service': {
    msg: 'Hello from a mocked service!'
  },
  'jquery': () => {}
  'external-module': {}
})


describe('ExampleComponent', function () {

  let vm;
  beforeEach(function () {
    // Mount it!
    // Mount it in every test scope. So you'll get fresh component
    vm = mount(Component)
  })

  // Focus On Your Test!
  it('Some Test', function () {
    const actual = vm.$el.querySelector('.msg').textContent
    const expected = 'Hello from a mocked service!'
    expect(actual).toBe(expected)
  })

})
```

## Have You Tested Your Components? You Should Be~

## Thank You for Making this useful~

## Let's talk about some projects with me
Just Contact Me At:
- Email: [bosnaufalemail@gmail.com](mailto:bosnaufalemail@gmail.com)
- Skype Id: bosnaufal254
- twitter: [@BosNaufal](https://twitter.com/BosNaufal)


## License
[MIT](http://opensource.org/licenses/MIT)
Copyright (c) Naufal Rabbani
