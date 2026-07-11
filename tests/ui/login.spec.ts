import { log } from 'node:console';
import {test, expect} from '../../fixtures/fixtures';

// this tests validate the login form and login functionality of the application. It covers various scenarios such as logging in with valid credentials, invalid credentials, empty credentials, wrong email, wrong password, and invalid email format. It also validates the presence of the login form on page load, successful login and dashboard validation, and successful logout after login.
// this covers login functionality system testing
test.describe("Login UI Tests", async()=>{

    test.beforeEach(async({page, loginPage})=>{
        await loginPage.goToLandingPage(page);
        await loginPage.validateLoginPageFormText();
    })
    
    test("TC1: User logs in with valid credentials successfully", async({page, loginPage, testUser })=>{
        
        await loginPage.loginWithCredentials(testUser.email, testUser.password); 
    });

    test("TC2: User logs in with invalid/unregistered credentials", async({page, loginPage})=>{
       
        await loginPage.loginWithCredentials("invalidEmail@yahoo.com","invalidPassword");
        await loginPage.expectInvalidLogin();
    });

    test("TC3: User logs in with wrong email", async({page, loginPage, testUser})=>{
      
        await loginPage.loginWithCredentials("abc1234@com",testUser.password);
        await loginPage.expectInvalidLogin();
    });

    test("TC4: User logs in with wrong password", async({page,loginPage,testUser})=>{
      
        await loginPage.loginWithCredentials(testUser.email,"invalidPassword");
        await loginPage.expectInvalidLogin();
    });

    test("TC5: User logs in with empty credentials", async({page,loginPage})=>{
       
        await loginPage.loginWithCredentials("","");
        const validationMessage = await loginPage.emailAddresInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        expect(validationMessage).toContain("Please fill out this field.");
        
    });

    test("TC6: User logs in with invalid email format", async({page, loginPage, testUser})=>{
        
        await loginPage.loginWithCredentials("mkl.com",testUser.password);
        const validationMessage = await loginPage.emailAddresInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );
        expect(validationMessage).toContain(loginPage.INCORRECT_EMAIL_FORMAT_ERROR_MESSAGE);
    });

    test("TC7: User logs in with valid credentials successfully & validates the dashboard", async({page, loginPage, testUser})=>{
       
        await loginPage.loginWithCredentials(testUser.email,testUser.password);
        await loginPage.validatePageURL("");
        const expectedNavbarItems : string[]= loginPage.NAVBAR_ITEMS;
        expectedNavbarItems.push(` Logged in as ${testUser.name}`);
        await loginPage.validateNavbarItems();
        
    });

    test("TC8: User logs in with valid credentials & is able to logout successfully ", async({page, loginPage, testUser})=>{
       
        await loginPage.loginWithCredentials(testUser.email,testUser.password);
        await loginPage.logOut();
        await loginPage.validatePageURL("/login");
        await loginPage.validateLoginPageFormText();
    });
});