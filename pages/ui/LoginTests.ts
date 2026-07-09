import { expect, Locator, Page } from "@playwright/test";
import { ConfigManager } from "../../config/ConfigManager";

export class LoginPage{
    baseUrl: string;
    public emailAddresInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator
    public loginFormText: Locator;
    public loginFormErrorMessage: Locator;
    public logOutPageLink: Locator;
    public dashboardNavBar: Locator;
    public dashboardPageHeaders: Locator;
    // const data
    readonly LOGIN_FORM_TEXT_VALUE = "Login to your account";
    readonly INVALID_CREDENTIALS_ERROR_MESSAGE = "Your email or password is incorrect!";
    readonly NAVBAR_ITEMS = [" Home", " Products", " Cart", " Logout", " Delete Account", " Test Cases", " API Testing", " Video Tutorials", " Contact us"];
    readonly INCORRECT_EMAIL_FORMAT_ERROR_MESSAGE = "Please include an '@' in the email address.";
    
    

    constructor(page:Page){
        this.baseUrl = ConfigManager.getInstance().getBaseUrl();
        this.emailAddresInput = page.locator("input[data-qa='login-email']");
        this.passwordInput = page.locator("input[data-qa='login-password']");
        this.loginButton = page.locator("button[data-qa='login-button']");
        this.loginFormText = page.locator("div.login-form h2");
        this.loginFormErrorMessage = page.locator(".login-form > form > p");
        this.logOutPageLink = page.getByRole('link', {name: 'Logout'});
        this.dashboardNavBar = page.locator(".shop-menu.pull-right");
        this.dashboardPageHeaders = this.dashboardNavBar.locator("ul > li > a");
    }

    async loginWithCredentials(email: string, password: string){
        await this.emailAddresInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
    async goToLoginPage(page: Page){
        await page.goto(this.baseUrl + "/login");
    }

    async validateDashboardLoginPageNavbarItems(){
        await expect(this.dashboardNavBar).toBeVisible();
        const headers: String[]= await this.dashboardPageHeaders.allInnerTexts();
        return headers;
    }
    async expectInvalidLogin(){
        await expect(this.loginFormErrorMessage).toBeVisible();
        await expect(this.loginFormErrorMessage).toHaveText(
            this.INVALID_CREDENTIALS_ERROR_MESSAGE
        );
    }

    async logOut(){
        this.logOutPageLink.click();
    }
    async validateLoginPageFormText(){
        await expect(this.loginFormText).toBeVisible();
        await expect(this.loginFormText).toHaveText(this.LOGIN_FORM_TEXT_VALUE);
    }
}