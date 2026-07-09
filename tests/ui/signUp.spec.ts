import { UserFactory } from "../../factories/UserFactory";

import {test, expect} from '../../fixtures/fixtures';


test.describe("Sign Up Tests", ()=>{
    
    test("TC1: User signs up with valid credentials successfully", async({page, signUpPage, newUserData})=>{
        // const newuser = UserFactory.default();
        await signUpPage.goToSignUpPage(page);
        await expect(signUpPage.signUpText).toBeVisible();
        await expect(signUpPage.signUpText).toHaveText(signUpPage.SIGNUP_FORM_TEXT_VALUE);
        await expect(signUpPage.nameInput).toBeVisible();
        await expect(signUpPage.emailInput).toBeVisible();
        await signUpPage.signUpWithCredentials(newUserData.name, newUserData.email);
        await expect(page).toHaveURL(signUpPage.baseUrl + "/signup");
    });

    test("TC2: User signs up with already existing credentials", async({page, signUpPage, testUser})=>{
        
        await signUpPage.goToSignUpPage(page);
        await expect(signUpPage.signUpText).toBeVisible();
        await expect(signUpPage.signUpText).toHaveText(signUpPage.SIGNUP_FORM_TEXT_VALUE);
        await expect(signUpPage.nameInput).toBeVisible();
        await expect(signUpPage.emailInput).toBeVisible();
        await signUpPage.signUpWithCredentials(testUser.name, testUser.email);
        await expect(signUpPage.signUpFormErrorMessage).toBeVisible();
        await expect(signUpPage.signUpFormErrorMessage).toContainText(
            signUpPage.USER_ALREADY_EXIST_ERROR_MESSAGE
        );
    
    });

    test("TC3: User signs up with empty email credential", async({page, signUpPage,testUser})=>{
       
        await signUpPage.goToSignUpPage(page);
        await expect(signUpPage.signUpText).toHaveText(signUpPage.SIGNUP_FORM_TEXT_VALUE);
        await signUpPage.signUpWithCredentials(testUser.name, " ");
        const validationMessage = await signUpPage.emailInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        )
        expect(validationMessage).toContain(signUpPage.MANDATORY_FIELD_ERROR_MESSAGE);
    });

    test("TC4: User signs up with empty name credential", async({page, signUpPage, testUser})=>{
       
        await signUpPage.goToSignUpPage(page);
        await expect(signUpPage.signUpText).toHaveText(signUpPage.SIGNUP_FORM_TEXT_VALUE);
        await signUpPage.signUpWithCredentials("", testUser.email);
        const validationMessage = await signUpPage.nameInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        )
        expect(validationMessage).toContain(signUpPage.MANDATORY_FIELD_ERROR_MESSAGE);
    });
})