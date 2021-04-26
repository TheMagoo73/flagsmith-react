import { TestScheduler } from "jest";
import { reducer } from "../src/reducer";

const initialState = {
  isLoading: true,
  isError: false,
  isIdentified: false,
  isListening: false,
};

describe("reducer", () => {
  test("can be created", () => {
    const newState = reducer(initialState, {});

    expect(newState).toEqual(initialState);
  });

  test("can be initialised", () => {
    const newState = reducer(initialState, { type: "INITIALISED" });

    expect(newState).toEqual({ ...initialState, isLoading: false });
  });

  test("can be identified", () => {
    const newState = reducer(
      { ...initialState, isLoading: false },
      { type: "IDENTIFIED" }
    );

    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      isIdentified: true,
    });
  });

  test("can be un-identified", () => {
    const newState = reducer(
      { ...initialState, isLoading: false, isIdentified: true },
      { type: "UNIDENTIFIED" }
    );

    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      isIdentified: false,
    });
  });

  test("can listen", () => {
    const newState = reducer({ ...initialState }, { type: "START_LISTENING" });

    expect(newState).toEqual({ ...initialState, isListening: true });
  });

  test("can stop listening", () => {
    const newState = reducer(
      { ...initialState, isListening: true },
      { type: "STOP_LISTENING" }
    );

    expect(newState).toEqual({ ...initialState, isListening: false });
  });

  test("can be errored", () => {
    const newState = reducer({ ...initialState }, { type: "ERRORED" });

    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      isError: true,
    });
  });
});
