import { expect, Page } from "@playwright/test";
import logger from "../../utils/logger/Logger";
import { ConfigManager } from "../../config/ConfigManager";

export class BasePage{
    page: Page;
    baseUrl: string;

    constructor(page: Page){
        this.page = page;
        this.baseUrl = ConfigManager.getInstance().getBaseUrl();
    }
    async validatePageURL(url: String|null){
        await expect(this.page).toHaveURL(this.baseUrl + url) ;
        logger.info(`Validated page URL: ${this.baseUrl + url}`);
    }
    async goToLandingPage(page: Page){
        await page.goto(this.baseUrl + "/login");
        logger.info("Navigated to landing page");
    }

}