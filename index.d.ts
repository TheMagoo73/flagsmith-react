import {IFlags} from 'flagsmith'

export interface Flagsmith {
    /**
     * Denotes if Flagsmith is fully initialised and ready
     */
    isLoading: boolean

    /**
     * Denotes if Flagsmith is in an errored state
     */
    isError: boolean

    /**
     * Denotes if Flagsmith is evaluating flags for a specific user
     */
    isIdentified: boolean

    /**
     * Denotes if Flagsmith is listening for changes
     */
    isListening: boolean

    /**
     * Identify user, triggers a call to get flags if flagsmith.init has been called
     */
    identify:(userId:string) => Promise<IFlags|undefined>

    /**
     * Clears the identity, triggers a call to getFlags
     */
    logout:() => Promise<IFlags>

    /**
     * Polls the flagsmith API, specify interval in ms
     */
    startListening:(interval?:number) => void

    /**
     * Stops polling
     */
    stopListening:() => void

    /**
     * Determine whether a flag is enabled e.g. flagsmith.hasFeature("powerUserFeature")
     */
    hasFeature:(key:string) => boolean

    /**
     * Get the value of a particular remote config e.g. flagsmith.getValue("font_size")
     */
    getValue:(key:string) => string|number|boolean

    /**
     * Attach a callback function that is notified whenever the Flagsmith state 
     * changes (i.e. new flag evaluations are available)
     */
    subscribe:(callback:Function) => void

    /**
     * Force a re-evaluation and fetch of flags
     */
    getFlags:() => Promise<IFlags>
}

/**
 * Hook function to access Flagsmith functionality
 */
export function useFlagsmith (): Flagsmith

declare module  "FlagsmithProvider" {
    import React from 'react'

    interface FlagsmithProviderProps {
        environmentId: string  // Flagsmith environmentId
        flagsmith: ?Object  // Optional Flagsmith implementation
        children: React.ReactChildren  //
    }

    export const FlagsmithProvider: (props: FlagsmithProviderProps) => React.FunctionComponent<FlagsmithProviderProps>
}
