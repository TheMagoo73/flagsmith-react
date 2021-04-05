import React from 'react'
import { useCallback, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import flagsmith from 'flagsmith'

import FlagsmithContext from './flagsmith-context'
import { reducer } from './reducer'

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

export default FlagsmithProvider