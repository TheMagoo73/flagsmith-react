import React from 'react'
import { createContext, useCallback, useContext, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import flagsmith from 'flagsmith'

const FlagsmithContext = createContext()

const reducer = (state, action) => {
  switch(action.type) {
    case 'INITIALISED': {
      return {...state, isLoading: false, isError: false}
    }
    case 'IDENTIFIED': {
      return {...state, isIdentified: true}
    }
    case 'UNIDENTIFIED': {
      return {...state, isIdentified: false}
    }
    case 'ERRORED': {
      return {...state, isLoading: false, isError: true}
    }
  }
}

const FlagsmithProvider = ({ environmentId, children }) => {

  const [state, dispatch] = useReducer(reducer, { isLoading: true, isError: false, isIdentified: false })

  useEffect(() => {
    (async () =>{
      try {
        await flagsmith.init({
          environmentID: environmentId
        })
        dispatch({type: 'INITIALISED'})
      } catch {
        console.log('Failed')
        dispatch({type: 'ERRORED'})
      }
    })()
  }, [environmentId])

  const identify = useCallback(
    async (identity) => {
      try {
        await flagsmith.identify(identity)
        dispatch({type: 'IDENTIFIED'})
      } catch {
        dispatch({type: 'UNIDENTIFIED'})
      }
    }, []
  )

  const hasFeature = useCallback(
    (key) => {
      return flagsmith.hasFeature(key)
    }, []
  )

  const getValue = useCallback(
    (key) => {
      return flagsmith.getValue(key)
    }, []
  )

  return (
    <FlagsmithContext.Provider value={{...state, identify, hasFeature, getValue}}>
      {children}
    </FlagsmithContext.Provider>
  )
}

FlagsmithProvider.propTypes = {
  children: PropTypes.any,
  environmentId: PropTypes.string.isRequired
}

const useFlagsmith = () => {
  const context = useContext(FlagsmithContext)
  if(context === undefined) {
    throw new Error('useFlagsmith must be used with in a FlagsmithProvider')
  }

  return context
}

export { FlagsmithProvider, useFlagsmith }