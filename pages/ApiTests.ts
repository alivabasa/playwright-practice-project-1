import {APIRequestContext, expect} from '@playwright/test';
import {User, UserDetailResponse, ApiMessageResponse} from '../models/User';
import { ConfigManager } from '../config/ConfigManager';

// type of the response body will be decided dynamically based on the API endpoint we are hitting, so we can use a generic type T to represent the response body, which can be of any type depending on the API endpoint. This allows us to reuse the ApiResponse interface for different API endpoints with different response body types, making our code more flexible and reusable. For example, if we are hitting an API endpoint that returns a UserDetailResponse, we can specify T as UserDetailResponse when using the ApiResponse interface, and if we are hitting an API endpoint that returns an ApiMessageResponse, we can specify T as ApiMessageResponse when using the ApiResponse interface.
interface ApiResponse<T> {
    statusCode: number,
    responseBody: T
}
export class ApiTests{
    private apiContext: APIRequestContext;
    // private configManager: ConfigManager;
    private baseUrl: string;
     
    constructor(apiContext: APIRequestContext){
        this.apiContext = apiContext;
        this.baseUrl = ConfigManager.getInstance().getApiUrl();
    }

    // POST endpoint /createAccount
    async createAccount(user: User): Promise<ApiResponse<ApiMessageResponse>>{
        const response = await this.apiContext.post(`${this.baseUrl}/createAccount`, {
            multipart:{
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
        return {
            statusCode: response.status(),
            responseBody: responseBody
        }
    }

    async getUserDetailsByEmail(email:string): Promise<ApiResponse<UserDetailResponse>>{
        const response = await this.apiContext.get(
            `${this.baseUrl}/getUserDetailByEmail?email=${email}`);
        
        const responseBody = await response.json()    ;
        return {
            statusCode: response.status(),
            responseBody: responseBody
        }
    }

    async verifyLogin(email: string, password: string): Promise<ApiResponse<ApiMessageResponse>>{
        const response = await this.apiContext.post(
            `${this.baseUrl}/verifyLogin`, {
                multipart: {
                    email: email,
                    password: password
                }
            }
        );
        const responseBody = await response.json();
        return {
            statusCode: response.status(),
            responseBody: responseBody
        }
    }
    async deleteAccount(email: string, password:string) : Promise<ApiResponse<ApiMessageResponse>>{
        const response = await this.apiContext.delete(
            `${this.baseUrl}/deleteAccount`, {
                multipart: {
                    email: email,
                    password: password
                }
            }
        );
        const responseBody = await response.json();
        return {
            statusCode: response.status(),
            responseBody: responseBody
        }
    }

}