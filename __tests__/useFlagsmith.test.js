import * as React from "react";
import { renderHook } from "@testing-library/react-hooks";

import flagsmith from "flagsmith";
import { useFlagsmith, FlagsmithProvider } from "../src/";
import { act } from "@testing-library/react";

const MY_ENV_ID = "MY_ENV_ID";
const wrapper = ({ children }) => (
  <FlagsmithProvider environmentId={MY_ENV_ID}>{children}</FlagsmithProvider>
);

describe("useFlagsmith", () => {
  test("if context is not defined, throws an error", () => {
    const { result } = renderHook(() => useFlagsmith());
    console.log(result.error);
    expect(result.error).toEqual(
      Error("useFlagsmith must be used with in a FlagsmithProvider")
    );
  });

  test("makes sure flagsmith is initialized", async () => {
    jest
      .spyOn(flagsmith, "init")
      .mockImplementationOnce(() => Promise.resolve());

    const { result, waitForNextUpdate } = renderHook(() => useFlagsmith(), {
      wrapper,
    });
    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isError).toBeFalsy();
  });

  test("handles when flagsmith has an error during initialization", async () => {
    jest
      .spyOn(flagsmith, "init")
      .mockImplementationOnce(() => Promise.reject());

    const { result, waitForNextUpdate } = renderHook(() => useFlagsmith(), {
      wrapper,
    });
    await waitForNextUpdate();

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.isError).toBeTruthy();
  });

  test("a valid identify user sets isIdentified to true", async () => {
    const identify = jest.spyOn(flagsmith, "identify");

    const { result } = renderHook(() => useFlagsmith(), { wrapper });

    await act(() => result.current.identify("user_123"));
    expect(identify).toHaveBeenCalledWith("user_123");
    expect(result.current.isIdentified).toBeTruthy();
  });

  test("a valid inentify user with traits sets isIdentified to true", async () => {
    const identify = jest.spyOn(flagsmith, "identify");

    const { result } = renderHook(() => useFlagsmith(), { wrapper });

    await act(() => result.current.identify("user_123", {foo: 'bar'}));
    expect(identify).toHaveBeenCalledWith("user_123", {foo: 'bar'});
    expect(result.current.isIdentified).toBeTruthy();
  })

  test("an invalid identify user sets isIdentified to false", async () => {
    const identify = jest
      .spyOn(flagsmith, "identify")
      .mockReturnValue(Promise.reject());

    const { result } = renderHook(() => useFlagsmith(), { wrapper });

    await act(() => result.current.identify("user_123"));
    expect(identify).toHaveBeenCalledWith("user_123");
    expect(result.current.isIdentified).toBeFalsy();
  });

  test("you can logout an user", async () => {
    const promise = Promise.resolve();
    const identify = jest.spyOn(flagsmith, "identify").mockReturnValue(promise);
    jest.spyOn(flagsmith, "logout").mockReturnValue(promise);

    const { result } = renderHook(() => useFlagsmith(), { wrapper });

    await act(() => result.current.identify("user_123"));
    expect(identify).toHaveBeenCalledWith("user_123");
    expect(result.current.isIdentified).toBeTruthy();

    await act(() => result.current.logout());
    expect(result.current.isIdentified).toBeFalsy();
  });

  test("you can starts and stops polling using startListening and stopListening", () => {
    const startListening = jest.spyOn(flagsmith, "startListening");
    const stopListening = jest.spyOn(flagsmith, "stopListening");

    const { result } = renderHook(() => useFlagsmith(), { wrapper });

    act(() => result.current.startListening(2000));
    expect(startListening).toHaveBeenCalledWith(2000);
    expect(result.current.isListening).toBeTruthy();

    act(() => result.current.stopListening());
    expect(stopListening).toHaveBeenCalled();
    expect(result.current.isListening).toBeFalsy();

    act(() => result.current.startListening());
    expect(result.current.isListening).toBeTruthy();
  });

  test("you can check if a feature exists and get it using hasFeature and getValue", () => {
    const features = {
      repo: "flagsmith-react",
    };
    const hasFeature = jest
      .spyOn(flagsmith, "hasFeature")
      .mockImplementationOnce((v) => !!features[v]);
    const getValue = jest
      .spyOn(flagsmith, "getValue")
      .mockImplementationOnce((v) => features[v]);

    const { result } = renderHook(() => useFlagsmith(), { wrapper });

    expect(result.current.hasFeature("stars")).toBeFalsy();
    expect(hasFeature).toHaveBeenCalledWith("stars");

    expect(result.current.getValue("repo")).toBe("flagsmith-react");
    expect(getValue).toHaveBeenCalledWith("repo");
  });

  test("you can get flags using getFlags", async () => {
    const promise = Promise.resolve({
      repo: "flagsmith-react",
    });
    jest.spyOn(flagsmith, "getFlags").mockReturnValue(promise);

    const { result } = renderHook(() => useFlagsmith(), { wrapper });

    expect(await result.current.getFlags()).toEqual({
      repo: "flagsmith-react",
    });
  });

  test("you can get all flags using getAllFlags", async () => {
    const promise = Promise.resolve({
      repo: "flagsmith-react",
      another: "Flag"
    });
    jest.spyOn(flagsmith, "getAllFlags").mockReturnValue(promise);

    const { result } = renderHook(() => useFlagsmith(), { wrapper });

    expect(await result.current.getAllFlags()).toEqual({
      repo: "flagsmith-react",
      another: "Flag"
    });
  });

  test("you can increment or set a trait providing its key and value", async () => {
    const traits = {
      stars: 1,
    };
    const incrementTrait = jest
      .spyOn(flagsmith, "incrementTrait")
      .mockImplementationOnce((k, v) => ({
        ...traits,
        [k]: traits[k] + v,
      }));
    const setTrait = jest
      .spyOn(flagsmith, "setTrait")
      .mockImplementationOnce((k, v) => ({
        ...traits,
        [k]: v,
      }));
    const setTraits = jest
      .spyOn(flagsmith, "setTraits")
      .mockImplementationOnce((v) => v);

    const { result } = renderHook(() => useFlagsmith(), { wrapper });

    expect(await result.current.setTrait("repo", "flagsmith-react")).toEqual({
      stars: 1,
      repo: "flagsmith-react",
    });
    expect(setTrait).toHaveBeenCalledWith("repo", "flagsmith-react");

    expect(await result.current.incrementTrait("stars", 3)).toEqual({
      stars: 4,
    });
    expect(incrementTrait).toHaveBeenCalledWith("stars", 3);

    expect(
      await result.current.setTraits({ repo: "flagsmith-react" })
    ).toEqual({ repo: "flagsmith-react" });
    expect(setTraits).toHaveBeenCalledWith({ repo: "flagsmith-react" });
  });

  test("you can get and set traits using getTrait and setTraits", () => {
    const traits = {
      repo: "flagsmith-react",
    };
    const getTrait = jest
      .spyOn(flagsmith, "getTrait")
      .mockImplementationOnce((v) => traits[v]);

    const { result } = renderHook(() => useFlagsmith(), { wrapper });

    expect(result.current.getTrait("repo")).toBe("flagsmith-react");
    expect(getTrait).toHaveBeenCalledWith("repo");
  });
});
