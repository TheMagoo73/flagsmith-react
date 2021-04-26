import { useRef, useEffect } from "react";

export function useEventEmitter() {
  const ref = useRef();
  if (!ref.current) {
    ref.current = {
      subscriptions: new Set(),
      emit: (val) => {
        for (const subscription of ref.current.subscriptions) {
          subscription(val);
        }
      },
      useSubscription: (callback) => {
        const callbackRef = useRef();
        callbackRef.current = callback;
        useEffect(() => {
          function subscription(val) {
            if (callbackRef.current) {
              callbackRef.current(val);
            }
          }
          ref.current.subscriptions.add(subscription);
          return () => {
            ref.current.subscriptions.delete(subscription);
          };
        }, []);
      },
    };
  }
  return ref.current;
}
