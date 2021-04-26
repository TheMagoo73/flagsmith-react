export const reducer = (state, action) => {
  switch (action.type) {
    case "INITIALISED": {
      return { ...state, isLoading: false, isError: false };
    }
    case "IDENTIFIED": {
      return { ...state, isIdentified: true };
    }
    case "UNIDENTIFIED": {
      return { ...state, isIdentified: false };
    }
    case "ERRORED": {
      return { ...state, isLoading: false, isError: true };
    }
    case "START_LISTENING": {
      return { ...state, isListening: true };
    }
    case "STOP_LISTENING": {
      return { ...state, isListening: false };
    }
    default: {
      return { ...state };
    }
  }
};
