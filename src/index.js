
import Vue from 'vue'

// To Mount Component
export function mount(component) {
  const Ctor = Vue.extend(component)
  const propsData = component.$propsDataInjection
  const vm = new Ctor({ propsData }).$mount()
  return vm
}

// To Make State Injections
export function injectState(Component, injections) {
  const defaultValue = Component.data ? Component.data() : {}
  Component.data = function () {
    return {
      ...defaultValue,
      ...injections
    }
  }
  return Component
}


// To Make a Mock Injection for default Injections
export function defaultInjections(injects) {

  // If No Injections
  let injections = {
    'vuex': {
      mapStates: () => {},
      mapActions: () => {},
      mapGetters: () => {}
    },
    'vuex-saga': {
      mapSagas: () => {}
    }
  }

  if (!injects) return { injections, stateInjections: {}, propsData: {} }


  // If there's an injection
  // Destruct
  const internal = {}
  const others = {}
  const keys = Object.keys(injects)
  keys.forEach((key) => {
    if (
         key !== 'states'
      && key !== 'actions'
      && key !== 'getters'
      && key !== 'sagas'
      && key !== 'propsData'
    ) {
      others[key] = injects[key]
    } else {
      internal[key] = injects[key]
    }
  })

  // Vuex Injections
  if (internal['sagas']) injections['vuex-saga'].mapSagas = () => internal['sagas']
  if (internal['actions']) injections['vuex'].mapActions = () => internal['actions']

  // Others injections
  if(typeof others === 'object') injections = {...injections, ...others}

  // If There's some state Injections
  let stateInjections
  if (internal['getters'] || internal['states']) {
    // Combine Getters and States Injections
    const states = {...internal['getters'], ...internal['states']}

    // Save the state injections
    stateInjections = states
  }

  return { injections, stateInjections, propsData: internal['propsData'] }

}


// Wrap it all to mock a component constructor
export function mockComponent(injector, injects) {
  const { injections, stateInjections, propsData } = defaultInjections(injects)

  // Inject it!
  let Component = injector({
    ...injections
  })

  // Inject States From getters And states Argumen
  Component = injectState(Component, stateInjections)

  // Inject propsData
  Component.$propsDataInjection = propsData

  return Component
}


const combine = { mockComponent, mount }
export default combine
