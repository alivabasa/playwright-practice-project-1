import { APIRequestContext, expect } from '@playwright/test';
import { User, UserDetailResponse, ApiMessageResponse } from '../../models/User';
import { ConfigManager } from '../../config/ConfigManager';
import logger from '../../utils/logger/Logger';
import { log } from 'node:console';

// type of the response body will be decided dynamically based on the API endpoint we are hitting, so we can use a generic type T to represent the response body, which can be of any type depending on the API endpoint. This allows us to reuse the ApiResponse interface for different API endpoints with different response body types, making our code more flexible and reusable. For example, if we are hitting an API endpoint that returns a UserDetailResponse, we can specify T as UserDetailResponse when using the ApiResponse interface, and if we are hitting an API endpoint that returns an ApiMessageResponse, we can specify T as ApiMessageResponse when using the ApiResponse interface.
interface ApiResponse<T> {
    statusCode: number,
    responseBody: T
}
export class UserService {
    private apiContext: APIRequestContext;
    private baseUrl: string;

    constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
        this.baseUrl = ConfigManager.getInstance().getApiUrl();
    }

    // POST endpoint /createAccount
    async createAccount(user: User): Promise<ApiResponse<ApiMessageResponse>> {
        const response = await this.apiContext.post(`${this.baseUrl}/createAccount`, {
            multipart: {
                name: user.name,
                email: user.email,
                password: user.password,
                title: user.title,
                birth_date: user.birthDate,
                birth_month: user.birthMonth,
                birth_year: user.birthYear,
                firstname: user.firstName,
                lastname: user.lastName,
                company: user.company,
                address1: user.address1,
                address2: user.address2,
                country: user.country,
                zipcode: user.zipcode,
                state: user.state,
                city: user.city,
                mobile_number: user.mobileNumber
            }

        });

        const responseBody = await response.json();
        logger.info(`Create Account API response: ${JSON.stringify(responseBody)}`);
        return {
            statusCode: response.status(),
            responseBody: responseBody
        }
    }

    async getUserDetailsByEmail(email: string): Promise<ApiResponse<UserDetailResponse>> {
        const response = await this.apiContext.get(
            `${this.baseUrl}/getUserDetailByEmail?email=${email}`);

        const responseBody = await response.json();
        logger.info(`Get User Details By Email API response: ${JSON.stringify(responseBody)}`);
        return {
            statusCode: response.status(),
            responseBody: responseBody
        }
    }

    async verifyUserLogin(email: string, password: string): Promise<ApiResponse<ApiMessageResponse>> {
        const response = await this.apiContext.post(
            `${this.baseUrl}/verifyLogin`, {
            multipart: {
                email: email,
                password: password
            }
        }
        );
        const responseBody = await response.json();
        logger.info(`Verify Login API response: ${JSON.stringify(responseBody)}`);
        return {
            statusCode: response.status(),
            responseBody: responseBody
        }
    }
    async deleteAccount(email: string, password: string): Promise<ApiResponse<ApiMessageResponse>> {
        const response = await this.apiContext.delete(
            `${this.baseUrl}/deleteAccount`, {
            multipart: {
                email: email,
                password: password
            }
        }
        );
        const responseBody = await response.json();
        logger.info(`Delete Account API response: ${JSON.stringify(responseBody)}`);
        return {
            statusCode: response.status(),
            responseBody: responseBody
        }
    }
    async verifyUserExists(email: string, user: User) {
        const getUserDetailsResponse = await this.getUserDetailsByEmail(email);
        expect(getUserDetailsResponse.statusCode).toBe(200);
        expect(getUserDetailsResponse.responseBody.user.email).toBe(email);
        expect(getUserDetailsResponse.responseBody.user.first_name).toBe(user.firstName);
        expect(getUserDetailsResponse.responseBody.user.last_name).toBe(user.lastName);
        logger.info(`Verified user exists with email: ${email}`);
    }

    async verifyUserLoginIsSuccessful(email: string, password: string) {
        const loginResponse = await this.verifyUserLogin(email, password);
        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.responseBody.message).toBe("User exists!");
        logger.info(`Verified user login is successful for email: ${email}`);
    }

    async verifyUserIsDeleted(email: string, password: string) {
        const deleteUserResponse = await this.deleteAccount(email, password);
        expect(deleteUserResponse.statusCode).toBe(200);
        expect(deleteUserResponse.responseBody.message).toBe("Account deleted!");
        logger.info(`Verified user is deleted with email: ${email}`);
    }

    async verifyNewUserIsCreated(user: User){
        const createUserResponse = await this.createAccount(user);
        expect (createUserResponse.statusCode).toBe(200);
        expect (createUserResponse.responseBody.message).toBe("User created!");
        logger.info(`Verified new user is created with email: ${user.email}`);
    }



}