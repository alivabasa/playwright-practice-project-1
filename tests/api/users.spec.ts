import {test, expect} from '@playwright/test';
import {ApiTests} from '../../pages/ApiTests';
import {User} from '../../models/User';
import {ConfigManager} from '../../config/ConfigManager';
import { UserFactory, UserFactoryBuilder } from '../../factories/UserFactory';

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
        expect (createUserResponse.statusCode).toBe(200);
        expect (createUserResponse.responseBody.message).toBe("User created!");

        const email= user.email;
        const password = user.password;

        // verify user credentials is stored
        const getUserDetailsResponse = await apiTests.getUserDetailsByEmail(email);
        console.log(getUserDetailsResponse);
        expect (getUserDetailsResponse.statusCode).toBe(200);
        expect (getUserDetailsResponse.responseBody.user.email).toBe(email);
        expect (getUserDetailsResponse.responseBody.user.first_name).toBe(user.firstName);
        expect (getUserDetailsResponse.responseBody.user.last_name).toBe(user.lastName);

         // login with the created user credentials
         const loginResponse = await apiTests.verifyLogin(email, password);
         console.log(loginResponse);
         expect (loginResponse.statusCode).toBe(200);
         expect (loginResponse.responseBody.message).toBe("User exists!");

         // delete the created user
         const deleteUserResponse = await apiTests.deleteAccount(email, password);
         console.log(deleteUserResponse);
         expect (deleteUserResponse.statusCode).toBe(200);
         expect (deleteUserResponse.responseBody.message).toBe("Account deleted!");
    });

    test("User logs in with invalid credentials",async()=>{
        const invalidCredentialsResponse = await apiTests.verifyLogin(
            "unknownEmail@gmail.com","unknownPassword");
        console.log(invalidCredentialsResponse);
        expect(invalidCredentialsResponse.statusCode).toBe(200);
        expect(invalidCredentialsResponse.responseBody.message).toBe("User not found!");
        expect(invalidCredentialsResponse.responseBody.responseCode).toBe(404);

    });

    test("User logs in without an email",async()=>{
        const invalidCredentialsResponse = await apiTests.verifyLogin(
            "","unknownPassword");
        console.log(invalidCredentialsResponse);
        expect(invalidCredentialsResponse.statusCode).toBe(200);
        expect(invalidCredentialsResponse.responseBody.message).toBe(
            "Bad request, email or password parameter is missing in POST request.");
        expect(invalidCredentialsResponse.responseBody.responseCode).toBe(400);
    });

    test("User creates an account with already registered email", async()=>{
        const user = UserFactory.default();
        // create new user
        await apiTests.createAccount(user);  
        const duplicateAccountResponse = await apiTests.createAccount(user);
        console.log(duplicateAccountResponse);
        expect(duplicateAccountResponse.responseBody.message).toBe("Email already exists!");
        expect(duplicateAccountResponse.responseBody.responseCode).toBe(400);
        
    });
    test("User creates an account with custom details", async()=>{
        const user = new UserFactoryBuilder()
        .withCountry("UK")
        .withCity("London")
        .withTitle("Mrs")
        .build();

        const createUserResponse = await apiTests.createAccount(user);
        console.log(createUserResponse);
        expect (createUserResponse.statusCode).toBe(200);
        expect (createUserResponse.responseBody.message).toBe("User created!");

        // verify user credentials is stored
        const getUserDetailsResponse = await apiTests.getUserDetailsByEmail(user.email);
        console.log(getUserDetailsResponse);
        expect (getUserDetailsResponse.statusCode).toBe(200);
        expect (getUserDetailsResponse.responseBody.user.email).toBe(user.email);
        expect (getUserDetailsResponse.responseBody.user.country).toBe("UK");
        expect (getUserDetailsResponse.responseBody.user.city).toBe("London");

        // delete the created user
        const deleteUserResponse = await apiTests.deleteAccount(user.email, user.password);
        console.log(deleteUserResponse);
        expect (deleteUserResponse.statusCode).toBe(200);
        expect (deleteUserResponse.responseBody.message).toBe("Account deleted!");

    });
})