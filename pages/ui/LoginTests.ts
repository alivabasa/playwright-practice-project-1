import { Locator, Page } from "@playwright/test";
import { ConfigManager } from "../../config/ConfigManager";

export class LoginPage{
    private baseUrl: string;
    private emailAddresInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator
    private loginFormText: Locator;

    // const data
    private static readonly LOGIN_FORM_TEXT_VALUE = "Login to your account";


    constructor(page:Page){
        this.baseUrl = ConfigManager.getInstance().getBaseUrl();
        this.emailAddresInput = page.locator("input[data-qa='login-email']");
        this.passwordInput = page.locator("input[data-qa='login-password']");
        this.loginButton = page.locator("button[data-qa='login-button']");
        this.loginFormText = page.locator("div.login-form h2");
    }

    async loginWithCredentials(email: string, password: string){
        await this.emailAddresInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }


}