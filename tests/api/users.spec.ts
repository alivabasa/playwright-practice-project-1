import {UserService} from '../../pages/api/UserService';
import {User} from '../../models/User';
import {ConfigManager} from '../../config/ConfigManager';
import { UserFactory, UserFactoryBuilder } from '../../factories/UserFactory';
import {test, expect} from '../../fixtures/fixtures';

test.describe('User API Tests', () => {
    
    test('TC1: create -> verify user credentials is stored-> login -> delete', async({apiTests})=>{
        const user = UserFactory.default();
        // create new user
        await apiTests.verifyNewUserIsCreated(user);
        // verify user credentials is stored
        await apiTests.verifyUserExists(user.email, user);
         // login with the created user credentials
        await apiTests.verifyUserLoginIsSuccessful(user.email, user.password);
         // delete the created user
        await apiTests.verifyUserIsDeleted(user.email, user.password);
    });

    test("TC2: User logs in with invalid credentials",async({apiTests})=>{
        const invalidCredentialsResponse = await apiTests.verifyUserLogin(
            "unknownEmail@gmail.com","unknownPassword");
       
        expect(invalidCredentialsResponse.statusCode).toBe(200);
        expect(invalidCredentialsResponse.responseBody.message).toBe("User not found!");
        expect(invalidCredentialsResponse.responseBody.responseCode).toBe(404);

    });

    test("TC3: User logs in without an email",async({apiTests})=>{
        const invalidCredentialsResponse = await apiTests.verifyUserLogin(
            "","unknownPassword");
     
        expect(invalidCredentialsResponse.statusCode).toBe(200);
        expect(invalidCredentialsResponse.responseBody.message).toBe(
            "Bad request, email or password parameter is missing in POST request.");
        expect(invalidCredentialsResponse.responseBody.responseCode).toBe(400);
    });

    test("TC4: User creates an account with already registered email", async({apiTests})=>{
        const user = UserFactory.default();
        // create new user
        await apiTests.createAccount(user);  
        const duplicateAccountResponse = await apiTests.createAccount(user);
       
        expect(duplicateAccountResponse.responseBody.message).toBe("Email already exists!");
        expect(duplicateAccountResponse.responseBody.responseCode).toBe(400);
        
    });
    test("TC5: User creates an account with custom details", async({apiTests})=>{
        const user = new UserFactoryBuilder()
        .withCountry("UK")
        .withCity("London")
        .withTitle("Mrs")
        .build();

        // create new user
        await apiTests.verifyNewUserIsCreated(user);
        // verify user credentials is stored
        await apiTests.verifyUserExists(user.email, user);
        // delete the created user
        await apiTests.verifyUserIsDeleted(user.email, user.password);
       

    });
})