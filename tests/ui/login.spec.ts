import {test, expect} from '@playwright/test';
import {LoginPage} from '../../pages/ui/LoginTests';
import {UserFactory} from '../../factories/UserFactory';

test.beforeAll(async()=>{})

// this tests validate the login form and login functionality of the application. It covers various scenarios such as logging in with valid credentials, invalid credentials, empty credentials, wrong email, wrong password, and invalid email format. It also validates the presence of the login form on page load, successful login and dashboard validation, and successful logout after login.
// this covers login functionality system testing
test.describe("Login UI Tests", async()=>{

    test("TC1: User lands on login page and validates the presence of login form on page load", async({page})=>{

    });

    test("TC2: User logs in with valid credentials successfully", async({page})=>{

    });

    test("TC3: User logs in with invalid/unregistered credentials", async({page})=>{

    });

    test("TC4: User logs in with wrong email", async({page})=>{

    });

    test("TC5: User logs in with wrong password", async({page})=>{

    });

    test("TC6: User logs in with empty credentials", async({page})=>{

    });

    test("TC7: User logs in with invalid email format", async({page})=>{

    });

    test("TC8: User logs in with valid credentials successfully & validates the dashboard", async({page})=>{

    });

    test("TC9: User logs in with valid credentials & is able to logout successfully ", async({page})=>{

    });

   

});