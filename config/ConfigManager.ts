import dotenv from 'dotenv';

dotenv.config();

interface Config {
    baseUrl: string,
    apiUrl: string,
    email: string,
    password: string,
    duration: number
}
export class ConfigManager{

    private static instance: ConfigManager | null=null;
    private config : Config = {

        baseUrl : process.env.BASE_URL!,
        apiUrl : process.env.API_URL!,
        email : process.env.TEST_USER_EMAIL!,
        password: process.env.TEST_USER_PASSWORD!,
        duration: 30000

        // baseUrl : process.env.BASE_URL || "https://reqres.in",
        // apiUrl : process.env.API_URL || "https://reqres.in/api",
        // email : process.env.TEST_USER_EMAIL || "eve.holt@reqres.in",
        // password: process.env.TEST_USER_PASSWORD || "cityslicka",
        // duration: 30000
    }

    private constructor() {};

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