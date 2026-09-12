import dotenv from 'dotenv';

dotenv.config();
// const env= process.env.ENV || 'dev';
// dotenv.config({path: `.emv.${env}`});

interface Config {
    baseUrl: string,
    apiUrl: string,
    email: string,
    password: string,
    duration: number
}
export class ConfigManager{


    private static instance: ConfigManager | null=null;
    private config : Config ;
    // = {

    //     baseUrl : process.env.BASE_URL!,
    //     apiUrl : process.env.API_URL!,
    //     email : process.env.TEST_USER_EMAIL!,
    //     password: process.env.TEST_USER_PASSWORD!,
    //     duration: 30000
    // }

    private constructor() {
        this.config = {
            baseUrl: this.require('BASE_URL'),
            apiUrl: this.require('API_URL'),
            email: this.require('TEST_USER_EMAIL'),
            password: this.require('TEST_USER_PASSWORD'),
            duration: 30000
        }
    };
    private require(key: string): string{
        const val = process.env[key];
        if (!val) {
            throw new Error(
                `Missing required env var: ${key} `
                // (loaded from .env.${env}). ` +
                // `Check that .env.${env} exists and defines it.`
            );
        }
        return val;
    }
    static getInstance(): ConfigManager{
        if (ConfigManager.instance===null){
            ConfigManager.instance= new ConfigManager();
        }
        return ConfigManager.instance;
    }
    getBaseUrl(): string{ return this.config.baseUrl; }
    getApiUrl(): string{ return this.config.apiUrl; }
    getEmail(): string{ return this.config.email; }
    getPassword(): string{ return this.config.password; }
    getDuration(): number{ return this.config.duration; }
}