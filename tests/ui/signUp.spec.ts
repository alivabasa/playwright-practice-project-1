import test, { expect } from "@playwright/test";
import { User } from "../../models/User";
import { ApiTests } from "../../pages/api/ApiTests";
import { UserFactory } from "../../factories/UserFactory";
import { SignUpPage } from "../../pages/ui/SignUpTests";


test.describe("Sign Up Tests", ()=>{
    let user: User;
    let apipage : ApiTests;
    let signUpPage : SignUpPage;
    test.beforeAll(async({request})=>{
        apipage = new ApiTests(request);
        user = UserFactory.default();
        const response = await apipage.createAccount(user);
         if (response.responseBody.message!= "User created!"){
            throw new Error("User creation failed, cannot proceed with signup tests");
         }
    })

    test.afterAll(async({request})=>{
        apipage = new ApiTests(request);
        await apipage.deleteAccount(user.email, user.password);
    })

    test("TC1: User signs up with valid credentials successfully", async({page})=>{
        signUpPage = new SignUpPage(page);
        await signUpPage.goToSignUpPage(page);
        await expect(signUpPage.signUpText).toBeVisible();
        await expect(signUpPage.signUpText).toHaveText(signUpPage.SIGNUP_FORM_TEXT_VALUE);
        await expect(signUpPage.nameInput).toBeVisible();
        await expect(signUpPage.emailInput).toBeVisible();
        await signUpPage.signUpWithCredentials(user.name, user.email);
        await expect(page).toHaveURL(signUpPage.baseUrl + "/signup");
    });

    test("TC2: User signs up with already existing credentials", async({page})=>{
        signUpPage = new SignUpPage(page);
        await signUpPage.goToSignUpPage(page);
        await expect(signUpPage.signUpText).toBeVisible();
        await expect(signUpPage.signUpText).toHaveText(signUpPage.SIGNUP_FORM_TEXT_VALUE);
        await expect(signUpPage.nameInput).toBeVisible();
        await expect(signUpPage.emailInput).toBeVisible();
        await signUpPage.signUpWithCredentials(user.name, "mk@gmail.com");
        await expect(signUpPage.signUpFormErrorMessage).toBeVisible();
        await expect(signUpPage.signUpFormErrorMessage).toContainText(
            signUpPage.USER_ALREADY_EXIST_ERROR_MESSAGE
        );
    
    });

    test("TC3: User signs up with empty email credential", async({page})=>{
        signUpPage = new SignUpPage(page);
        await signUpPage.goToSignUpPage(page);
        await expect(signUpPage.signUpText).toHaveText(signUpPage.SIGNUP_FORM_TEXT_VALUE);
        await signUpPage.signUpWithCredentials(user.name, " ");
        const validationMessage = await signUpPage.emailInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        )
        expect(validationMessage).toContain(signUpPage.MANDATORY_FIELD_ERROR_MESSAGE);
    });

    test("TC4: User signs up with empty name credential", async({page})=>{
        signUpPage = new SignUpPage(page);
        await signUpPage.goToSignUpPage(page);
        await expect(signUpPage.signUpText).toHaveText(signUpPage.SIGNUP_FORM_TEXT_VALUE);
        await signUpPage.signUpWithCredentials(" ", user.email);
        const validationMessage = await signUpPage.nameInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        )
        expect(validationMessage).toContain(signUpPage.MANDATORY_FIELD_ERROR_MESSAGE);


    });
})