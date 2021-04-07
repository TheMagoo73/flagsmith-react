import { useRef, useEffect } from 'react';

export function useEventEmitter() {
  const ref = useRef();
  if (!ref.current) {
    ref.current = {
      subscriptions: new Set(),  
      emit: (val) => {
        for (const subscription of this.subscriptions) {
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
          this.subscriptions.add(subscription);
          return () => {
            this.subscriptions.delete(subscription);
          };
        }, []);
      }
    };
  }
  return ref.current;
}