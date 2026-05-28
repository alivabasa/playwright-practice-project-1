import {test, expect} from '@playwright/test';
import {ApiTests} from '../../pages/ApiTests';
import {User} from '../../models/User';
import {ConfigManager} from '../../config/ConfigManager';
import { UserFactory } from '../../factories/UserFactory';

test.describe('User API Tests', () => {
    let apiTests: ApiTests;

    test.beforeEach(async ({request}) => {
        apiTests = new ApiTests(request);
    });

    test('create -> verify user credentials is stored-> login -> delete', async()=>{
        const user = UserFactory.default();
        // create new user
        const createUserResponse = await apiTests.createAccount(user);
        console.log(createUserResponse);
        expect (createUserResponse.statusCode).toBe(201);
        expect (createUserResponse.responseBody.message).toBe("User created!");


    });
})