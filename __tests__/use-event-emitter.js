import React from "react"
import { useEventEmitter } from "../src/use-event-emitter"

describe('useEventEmitter', () => {
    test('return an event emitter', () => {
        jest
            .spyOn(React, 'useRef')
            .mockReturnValueOnce({current: null})

        const emitter = useEventEmitter()

        expect(typeof(emitter.emit)).toEqual('function')
        expect(typeof(emitter.useSubscription)).toEqual('function')
    })

    test('can emit events', () => {
        jest
            .spyOn(React, 'useRef')
            .mockResolvedValueOnce({current: null})
            .mockReturnValueOnce({current: null})

        jest
            .spyOn(React, 'useEffect')
            .mockImplementation((cb, deps) => {
                cb()
            })
        const emitter = useEventEmitter()

        const callback = jest.fn()
        emitter.useSubscription(callback)
        emitter.emit()
        
        expect(callback).toBeCalled()
    })
})