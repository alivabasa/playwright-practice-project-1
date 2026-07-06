// import {test, expect} from '@playwright/test';
// import {LoginPage} from '../../pages/ui/LoginTests';
// import {UserFactory} from '../../factories/UserFactory';
// import { User } from '../../models/User';
// import { ApiTests } from '../../pages/api/ApiTests';
import {test, expect} from '../../fixtures/fixtures';

// this tests validate the login form and login functionality of the application. It covers various scenarios such as logging in with valid credentials, invalid credentials, empty credentials, wrong email, wrong password, and invalid email format. It also validates the presence of the login form on page load, successful login and dashboard validation, and successful logout after login.
// this covers login functionality system testing
test.describe("Login UI Tests", async()=>{
    // let user: User;
    // let loginPage: LoginPage;
    // let apiPage: ApiTests;
    // here were are creating the user once before runnning the tests
    // test.beforeAll(async({request})=>{
    //     apiPage = new ApiTests(request);
    //     user = UserFactory.default();
    //     const response = await apiPage.createAccount(user);

    //     if(response.responseBody.message!= "User created!"){
    //         throw new Error("User creation failed, cannot proceed with login tests");
    //     }
    // });

    // test.afterAll(async({request})=>{
    //     // it will delete the user after all the tests are run
    //     apiPage = new ApiTests(request);
    //     await apiPage.deleteAccount(user.email, user.password);
    // });

    test("TC1: User lands on login page and validates the presence of login form on page load", async({page,loginPage})=>{
        // loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(page);
        await expect(loginPage.loginFormText).toBeVisible();
        await expect(loginPage.loginFormText).toHaveText(loginPage.LOGIN_FORM_TEXT_VALUE);
    });

    test("TC2: User logs in with valid credentials successfully", async({page,loginPage, testUser })=>{
        // loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(page);
        await expect(loginPage.loginFormText).toBeVisible();
        await loginPage.loginWithCredentials(testUser.email, testUser.password);
        
    });

    test("TC3: User logs in with invalid/unregistered credentials", async({page, loginPage})=>{
        // loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(page);
        await expect(loginPage.loginFormText).toBeVisible();
        await loginPage.loginWithCredentials("invalidEmail@yahoo.com","invalidPassword");
        await expect(loginPage.loginFormErrorMessage).toBeVisible();
        await expect(loginPage.loginFormErrorMessage).toHaveText(
            loginPage.INVALID_CREDENTIALS_ERROR_MESSAGE
        );
    });

    test("TC4: User logs in with wrong email", async({page, loginPage, testUser})=>{
        // loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(page);
        await expect(loginPage.loginFormText).toBeVisible();
        await loginPage.loginWithCredentials("abc1234@com",testUser.password);
        await expect(loginPage.loginFormErrorMessage).toBeVisible();
        await expect(loginPage.loginFormErrorMessage).toHaveText(
            loginPage.INVALID_CREDENTIALS_ERROR_MESSAGE
        );
    });

    test("TC5: User logs in with wrong password", async({page,loginPage,testUser})=>{
        // loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(page);
        await expect(loginPage.loginFormText).toBeVisible();
        await loginPage.loginWithCredentials(testUser.email,"invalidPassword");
        await expect(loginPage.loginFormErrorMessage).toBeVisible();
        await expect(loginPage.loginFormErrorMessage).toHaveText(
            loginPage.INVALID_CREDENTIALS_ERROR_MESSAGE
        );
    });

    test("TC6: User logs in with empty credentials", async({page,loginPage})=>{
        // loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(page);
        await expect(loginPage.loginFormText).toBeVisible();
        await loginPage.loginWithCredentials("","");
        const validationMessage = await loginPage.emailAddresInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        expect(validationMessage).toContain("Please fill out this field.");
        
    });

    test("TC7: User logs in with invalid email format", async({page, loginPage, testUser})=>{
        // loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(page);
        await expect(loginPage.loginFormText).toBeVisible();
        await loginPage.loginWithCredentials("mkl.com",testUser.password);
        const validationMessage = await loginPage.emailAddresInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        expect(validationMessage).toContain(loginPage.INCORRECT_EMAIL_FORMAT_ERROR_MESSAGE);
    });

    test("TC8: User logs in with valid credentials successfully & validates the dashboard", async({page, loginPage, testUser})=>{
        // loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(page);
        await expect(loginPage.loginFormText).toBeVisible();
        await loginPage.loginWithCredentials(testUser.email,testUser.password);
        await expect(page).toHaveURL(loginPage.baseUrl);
        const expectedNavbarItems : string[]= loginPage.NAVBAR_ITEMS;
        expectedNavbarItems.push(` Logged in as ${testUser.name}`);
        expect(await loginPage.validateDashboardLoginPageNavbarItems()).toEqual(loginPage.NAVBAR_ITEMS);
        
    });

    test("TC9: User logs in with valid credentials & is able to logout successfully ", async({page, loginPage, testUser})=>{
        // loginPage = new LoginPage(page);
        await loginPage.goToLoginPage(page);
        await expect(loginPage.loginFormText).toBeVisible();
        await loginPage.loginWithCredentials(testUser.email,testUser.password);
        await loginPage.logOutPageLink.click();
        await expect(page).toHaveURL(loginPage.baseUrl + "/login");
        await expect(loginPage.loginFormText).toBeVisible();
        await expect(loginPage.loginFormText).toHaveText(loginPage.LOGIN_FORM_TEXT_VALUE);
    });
});