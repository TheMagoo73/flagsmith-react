import React from 'react'
import { useCallback, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'

import FlagsmithContext from './flagsmith-context'
import { reducer } from './reducer'

import { useEventEmitter } from './use-event-emitter'

import reactFlagsmith from 'flagsmith'

const FlagsmithProvider = ({ environmentId, children, flagsmith = reactFlagsmith}) => {

  const [state, dispatch] = useReducer(reducer, { isLoading: true, isError: false, isIdentified: false, isListening: false })
  const { emit, useSubscription } = useEventEmitter()

  const handleChange = useCallback(e => emit(e), [emit])

  useEffect(() => {
    (async () =>{
      try {
        await flagsmith.init({
          environmentID: environmentId,
          onChange: handleChange
        })
        dispatch({type: 'INITIALISED'})
      } catch {
        console.log('Failed')
        dispatch({type: 'ERRORED'})
      }
    })()
  }, [environmentId, handleChange, flagsmith])

  const identify = useCallback(
    async (identity) => {
      try {
        await flagsmith.identify(identity)
        dispatch({type: 'IDENTIFIED'})
      } catch {
        dispatch({type: 'UNIDENTIFIED'})
      }
    }, [flagsmith]
  )

  const logout = useCallback(
    async () => {
      try {
        await flagsmith.logout()
      } finally {
        dispatch({type: 'UNIDENTIFIED'})  
      }
    }, [flagsmith]
  )

  const startListening = useCallback(
    (interval = 1000) => {
      flagsmith.startListening(interval)
      dispatch({type: 'START_LISTENING'})
    }, [flagsmith]
  )

  const stopListening = useCallback(
    () => {
      flagsmith.stopListening()
      dispatch({type: 'STOP_LISTENING'})
    }, [flagsmith]
  )

  const hasFeature = useCallback(
    (key) => {
      return flagsmith.hasFeature(key)
    }, [flagsmith]
  )

  const getValue = useCallback(
    (key) => {
      return flagsmith.getValue(key)
    }, [flagsmith]
  )

  return (
    <FlagsmithContext.Provider value={{
      ...state, 
      identify, 
      hasFeature, 
      getValue, 
      subscribe: useSubscription, 
      logout,
      startListening,
      stopListening}}>
      {children}
    </FlagsmithContext.Provider>
  )
}

FlagsmithProvider.propTypes = {
  children: PropTypes.any,
  environmentId: PropTypes.string.isRequired,
  flagsmith: PropTypes.object.isRequired
}

export default FlagsmithProvider