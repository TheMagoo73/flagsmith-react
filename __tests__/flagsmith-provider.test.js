import * as React from 'react';
import {render, screen} from '@testing-library/react';
import FlagsmithProvider from "../src/flagsmith-provider";
import flagsmith from "flagsmith";


const MY_ENV_ID = 'MY_ENV_ID'
describe('provider', () => {
    test('it proxies an env id', () => {
        const mockedFlagsmithInit = jest.spyOn(flagsmith, 'init')
        render(<FlagsmithProvider environmentId={MY_ENV_ID} api="https://api-dev.flagsmith.com/api/v1"/>)

        expect(mockedFlagsmithInit).toHaveBeenCalledWith(expect.objectContaining({
            "environmentID": MY_ENV_ID,
            api: 'https://api-dev.flagsmith.com/api/v1'
        }))
    })

    test('it renders the children element', () => {
        render(<FlagsmithProvider environmentId={MY_ENV_ID}><h1>Hello Flagsmith!</h1></FlagsmithProvider>)

        expect(screen.getByRole('heading', {level: 1, name: /Hello Flagsmith/i})).not.toBeNull()
    })
})
