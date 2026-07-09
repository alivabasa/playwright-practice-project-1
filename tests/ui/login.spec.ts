import { log } from 'node:console';
import {test, expect} from '../../fixtures/fixtures';

// this tests validate the login form and login functionality of the application. It covers various scenarios such as logging in with valid credentials, invalid credentials, empty credentials, wrong email, wrong password, and invalid email format. It also validates the presence of the login form on page load, successful login and dashboard validation, and successful logout after login.
// this covers login functionality system testing
test.describe("Login UI Tests", async()=>{
    
    test("TC1: User lands on login page and validates the presence of login form on page load", async({page,loginPage})=>{
        
        await loginPage.goToLoginPage(page);
        await loginPage.validateLoginPageFormText();
    });

    test("TC2: User logs in with valid credentials successfully", async({page,loginPage, testUser })=>{
        
        await loginPage.goToLoginPage(page);
        await loginPage.validateLoginPageFormText();
        await loginPage.loginWithCredentials(testUser.email, testUser.password);
        
    });

    test("TC3: User logs in with invalid/unregistered credentials", async({page, loginPage})=>{
       
        await loginPage.goToLoginPage(page);
        await loginPage.validateLoginPageFormText();
        await loginPage.loginWithCredentials("invalidEmail@yahoo.com","invalidPassword");
        await expect(loginPage.loginFormErrorMessage).toBeVisible();
        await expect(loginPage.loginFormErrorMessage).toHaveText(
            loginPage.INVALID_CREDENTIALS_ERROR_MESSAGE
        );
    });

    test("TC4: User logs in with wrong email", async({page, loginPage, testUser})=>{
      
        await loginPage.goToLoginPage(page);
        await loginPage.validateLoginPageFormText();
        await loginPage.loginWithCredentials("abc1234@com",testUser.password);
        await loginPage.expectInvalidLogin();
    });

    test("TC5: User logs in with wrong password", async({page,loginPage,testUser})=>{
      
        await loginPage.goToLoginPage(page);
        await loginPage.validateLoginPageFormText();
        await loginPage.loginWithCredentials(testUser.email,"invalidPassword");
        await loginPage.expectInvalidLogin();
    });

    test("TC6: User logs in with empty credentials", async({page,loginPage})=>{
       
        await loginPage.goToLoginPage(page);
        await loginPage.validateLoginPageFormText();
        await loginPage.loginWithCredentials("","");
        const validationMessage = await loginPage.emailAddresInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        expect(validationMessage).toContain("Please fill out this field.");
        
    });

    test("TC7: User logs in with invalid email format", async({page, loginPage, testUser})=>{
        
        await loginPage.goToLoginPage(page);
        await loginPage.validateLoginPageFormText();
        await loginPage.loginWithCredentials("mkl.com",testUser.password);
        const validationMessage = await loginPage.emailAddresInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        expect(validationMessage).toContain(loginPage.INCORRECT_EMAIL_FORMAT_ERROR_MESSAGE);
    });

    test("TC8: User logs in with valid credentials successfully & validates the dashboard", async({page, loginPage, testUser})=>{
       
        await loginPage.goToLoginPage(page);
        await loginPage.validateLoginPageFormText();
        await loginPage.loginWithCredentials(testUser.email,testUser.password);
        await expect(page).toHaveURL(loginPage.baseUrl);
        const expectedNavbarItems : string[]= loginPage.NAVBAR_ITEMS;
        expectedNavbarItems.push(` Logged in as ${testUser.name}`);
        expect(await loginPage.validateDashboardLoginPageNavbarItems()).toEqual(loginPage.NAVBAR_ITEMS);
        
    });

    test("TC9: User logs in with valid credentials & is able to logout successfully ", async({page, loginPage, testUser})=>{
       
        await loginPage.goToLoginPage(page);
        await loginPage.validateLoginPageFormText();
        await loginPage.loginWithCredentials(testUser.email,testUser.password);
        await loginPage.logOut();
        await expect(page).toHaveURL(loginPage.baseUrl + "/login");
        await loginPage.validateLoginPageFormText();
    });
});