import { expect, Locator, Page } from "@playwright/test";
import { ConfigManager } from "../../config/ConfigManager";
import { BasePage } from "./BasePage";


export class SignUpPage extends BasePage{
    public signUpText: Locator;
    public nameInput: Locator;
    public emailInput: Locator;
    public signUpButton: Locator;
    public signUpFormErrorMessage: Locator;

    // const data
    readonly SIGNUP_FORM_TEXT_VALUE = "New User Signup!";
    readonly USER_ALREADY_EXIST_ERROR_MESSAGE = "Email Address already exist!";
    readonly MANDATORY_FIELD_ERROR_MESSAGE = "Please fill out this field.";

    constructor(page: Page) {
        super(page);
        this.signUpText = page.locator(".signup-form h2");
        this.nameInput = page.locator("input[data-qa='signup-name']");
        this.emailInput = page.locator("input[data-qa='signup-email']");
        this.signUpButton = page.locator("button[data-qa='signup-button']");
        this.signUpFormErrorMessage = page.locator(".signup-form > form > p");
    }
    
    async signUpWithCredentials(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.signUpButton.click();
    }
    async validateSignUpPageFormText() {
        await expect(this.signUpText).toBeVisible();
        await expect(this.signUpText).toHaveText(this.SIGNUP_FORM_TEXT_VALUE);
        await expect(this.nameInput).toBeVisible();
        await expect(this.emailInput).toBeVisible();
    }
    async expectInvalidSignUp(){
        await expect(this.signUpFormErrorMessage).toBeVisible();
        await expect(this.signUpFormErrorMessage).toContainText(
            this.USER_ALREADY_EXIST_ERROR_MESSAGE
        );
    }
}