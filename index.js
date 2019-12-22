import { useState } from 'react'

Array.prototype.removeDuplicates = function() {
    return Array.from(new Set(this))
}

export const useStateMachine = (initialState, stateFlow) => {
    const [currentState, setCurrentState] = useState(initialState)
    const flow = stateFlow
    const availableStates = Object.entries(flow[currentState].on).map(([signal, nextState]) => nextState).removeDuplicates()
    const availableActions = Object.entries(flow[currentState].on).map(([signal, nextState]) => signal).removeDuplicates()
    const allStates = Object.entries(stateFlow).map(([state, flow]) => state).removeDuplicates()
    const allActions = Object.values(stateFlow).reduce((allActions, s) => {
        return allActions.concat(Object.entries(s.on).map(([action, nextState]) => action)).removeDuplicates()
    }, [])

    return {
        state: currentState,
        flow: flow,
        states: {
            all: allStates,
            available: availableStates,
        },
        actions: {
            all: allActions,
            available: availableActions,
        },
        transition: action => {
            if (availableStates !== []) {
                if (flow[currentState].hasOwnProperty('on') && flow[currentState].on.hasOwnProperty(action)) {
                    console.log(`transition: ${ currentState } -> ${ flow[currentState].on[action] }`)
                    setCurrentState(flow[currentState].on[action])
                }
            }
            return
        },
    }
}
