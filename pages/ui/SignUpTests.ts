import { Locator, Page } from "@playwright/test";
import { ConfigManager } from "../../config/ConfigManager";


export class SignUpPage{
    public baseUrl: string;
    public signUpText: Locator;
    public nameInput: Locator;
    public emailInput: Locator;
    public signUpButton: Locator;
    public signUpFormErrorMessage: Locator;
   
     // const data
     readonly SIGNUP_FORM_TEXT_VALUE = "New User Signup!";
     readonly USER_ALREADY_EXIST_ERROR_MESSAGE = "Email Address already exist!";
     readonly MANDATORY_FIELD_ERROR_MESSAGE = "Please fill out this field.";

    constructor(page: Page){
        this.baseUrl = ConfigManager.getInstance().getBaseUrl();
        this.signUpText = page.locator(".signup-form h2");
        this.nameInput = page.locator("input[data-qa='signup-name']");
        this.emailInput = page.locator("input[data-qa='signup-email']");
        this.signUpButton = page.locator("button[data-qa='signup-button']"); 
        this.signUpFormErrorMessage = page.locator(".signup-form > form > p");       
    }
    async goToSignUpPage(page: Page){
        await page.goto(this.baseUrl + "/login");
    }
    async signUpWithCredentials(name: string, email: string){
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.signUpButton.click();
    }


}