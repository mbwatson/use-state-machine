# useStateMachine Hook

### Description

Good UI aligns user expectations with application outcomes. Controlling the flow of state in UI components with a Finite State Machine helps prevent unexpected results. 

This `useStateMachine` hook returns a _machine_ object that encapsulates the state and the flow of states. When the hook is called, it receives two parameters: (1) the initial state and (2) an object defining all states and actions describing the state changes those actions cause.

#### State Flow

The _state flow_ is an object representation of a directed graph, but it is helpful to think of it as simply a set of rules. It's top-level properties are possible states for your component. Each state has an `on` property, which is an object describing possible states to which to transition and the actions that invoke them.

#### Example

Consider a timer UI component that may have four states

`zero`, `running`, `paused`, and `complete`

and four actions

`START`, `PAUSE`, `RESET`, and `END`.

A snippet from a possible stateFlow object for such a timer is shown below, and it illustrates how transitions may occur from the `running` state.

```js
    running: {
        on: {
            PAUSE: 'paused',
            RESET: 'zero',
            END: 'complete',
        },
    },
```

The above snippet tells the state machine that, when it is in the `running` state, it should respond to three signals `PAUSE`, `RESET`, and `END` by transitioning to the three states `paused`, `zero`, and `complete`, respectively.

Then the state machine could be invoked as follows.

```js
const machine = useStateMachine('zero', {
    zero: {
        on: {
            START: 'running',
        },
    },
    running: {
        on: {
            PAUSE: 'paused',
            RESET: 'zero',
            END: 'complete',
        },
    },
    paused: {
        on: {
            START: 'running',
            RESET: 'zero',
        },
    },
    complete: {
        on: {
            RESET: 'zero',
        },
    },
})
```

- Transition: `running` -> `paused`

```js
console.log(machine.state) // 'running'
machine.transition('PAUSE')
console.log(machine.state) // 'paused'
```

- Transition: `paused` -> `zero`

```js
console.log(machine.state) // 'paused'
machine.transition('RESET')
console.log(machine.state) // 'zero'
```

- No Transition

```js
console.log(machine.state) // 'zero'
machine.transition('PAUSE')
console.log(machine.state) // 'zero'
```

The state machine acts like a router between states, simply keeping track of a the component's next state. As such, it behaves quite similarly to React's useState hook, but with a more deterministic state flow. The difference here is that the component isn't responsible for determining the state. That logic is outsourced to this hook, which responds to UI events triggered by the user.

Throw this `transition` function into an event handler, and call it with an action parameter to change (or not change) the state accordingly.


```jsx
const SomeComponents = () => {
    // ...
    const handleChangeState = action => e => machine.transition(action)
    // ...
    return (
        // ...
        <button onClick={ handleChangeState('START') }>Start Timer</button>
        // ...
    )
}
    

```

View a [demo](https://mbwatson.github.io/use-state-machine-example).

## API

To define a state machine to control a component's state

```js
const machine = useStateMachine(initialState, stateFlow)
```

- `machine.state` (String) - current state
- `machine.flow` (Object) - entire flow provided upon initial hook
- `machine.states.all` (Array of Strings) - all states
- `machine.states.available` (Array of Strings) - all states available from current state
- `machine.actions.all` (Array of Strings) - all actions
- `machine.actions.available` (Array of Strings) - all actions available from current state
- `machine.transition` (Function) - recieves one parameter, an action (String), and it updates the current state according to rules defined in state flow object.

The `machine.states.*` and `machine.actoins.*` are helpful to design the UI based on current state and possible next states. For example, maybe your Clock app needs to render _pause_ and _stop_ buttons if its Timer component is in the _countdown_ state.