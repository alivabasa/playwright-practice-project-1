import { User } from '../models/User';

export class UserFactory {
    static default(): User {
        const timestamp = Date.now();
        return {
            name: `testUser${timestamp}`,
            email: `testUser${timestamp}@testmail.com`,
            password: 'test@1256',
            title: 'Mr',
            firstName: 'Ravi',
            lastName: 'Kumar',
            birthDate: '12',
            birthMonth: '10',
            birthYear: '1997',
            company: 'Test Corp',
            address1: '12 MG Road',
            address2: 'Near Central Park',
            country: 'India',
            zipcode: '560001',
            state: 'Karnataka',
            city: 'Bengaluru',
            mobileNumber: '9876543210',
        }
    }

    // this ... means object spread operator which is used to create a new object by copying the properties of an existing object. In this case, we are creating a new user object by copying the properties of the default user object and then overriding the email property with an empty string or an invalid email string. This allows us to create different variations of the user object for testing purposes without having to create multiple factory methods for each variation.
    static withMissingEmail(): User{
        return {...UserFactory.default(), email: ''};
    }
    static withInvalidEmail(): User{
        return {... UserFactory.default(), email: 'not-a-valid-email'};
    }
    static withMissingPassword(): User{
        return {...UserFactory.default(), password: ''};
    }

}

export class UserFactoryBuilder {
    private user: User = UserFactory.default();

    // withName(name:string): UserFactoryBuilder{
    //     this.user.name = name;
    //     return this;
    // }

    // without build method, if we only use these below methods then we will npt be able to get the full object of user with the given attributes, as it would return a builder object instead of user object, so we need to call build method to get the final user object with the given attributes.
    withCountry(country:string): UserFactoryBuilder{
        this.user.country = country;
        return this;
    }
    withEmail(email:string): UserFactoryBuilder{
        this.user.email = email;
        return this;
    }
    withPassword(password:string): UserFactoryBuilder{
        this.user.password = password;
        return this;
    }   
    withCity(city:string): UserFactoryBuilder{
        this.user.city = city;
        return this;
    }
    withTitle(title:'Mr' | 'Mrs' | 'Miss'): UserFactoryBuilder{
        this.user.title = title;
        return this;
    }
    // here the need of using build method is within the test case we can create user object with different combinations of attributes using the builder pattern and then call build method to get the final user object which can be used in the test case. This approach allows us to create user objects with different combinations of attributes without having to create multiple factory methods for each combination.
    build(): User{
        return this.user
    }
}
