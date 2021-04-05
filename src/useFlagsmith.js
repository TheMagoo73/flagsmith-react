import { useContext } from "react"
import FlagsmithContext from "./flagsmith-context"

const useFlagsmith = () => {
  const context = useContext(FlagsmithContext)
  if(context === undefined) {
    throw new Error('useFlagsmith must be used with in a FlagsmithProvider')
  }

  return context
}
  
export default useFlagsmith