import {test, expect} from '../../fixtures/fixtures';

test.describe("Sign Up UI Tests", ()=>{
    test.beforeEach(async({page, signUpPage})=>{
        await signUpPage.goToLandingPage(page);
        await signUpPage.validateSignUpPageFormText();
    })
    
    test("TC1: User signs up with valid credentials successfully", async({page, signUpPage, newUserData})=>{
        await signUpPage.signUpWithCredentials(newUserData.name, newUserData.email);
        await signUpPage.validatePageURL("/signup");
    });

    test("TC2: User signs up with already existing credentials", async({page, signUpPage, testUser})=>{
        
        await signUpPage.signUpWithCredentials(testUser.name, testUser.email);
        await signUpPage.expectInvalidSignUp();
    
    });

    test("TC3: User signs up with empty email credential", async({page, signUpPage,testUser})=>{
       
        await signUpPage.signUpWithCredentials(testUser.name, " ");
        const validationMessage = await signUpPage.emailInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        )
        expect(validationMessage).toContain(signUpPage.MANDATORY_FIELD_ERROR_MESSAGE);
    });

    test("TC4: User signs up with empty name credential", async({page, signUpPage, testUser})=>{
       
        await signUpPage.signUpWithCredentials("", testUser.email);
        const validationMessage = await signUpPage.nameInput.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        )
        expect(validationMessage).toContain(signUpPage.MANDATORY_FIELD_ERROR_MESSAGE);
    });
})