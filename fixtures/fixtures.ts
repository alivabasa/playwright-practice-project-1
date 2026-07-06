// fixtures/fixtures.ts
import { test as base, expect } from '@playwright/test';
import { ApiTests } from '../pages/api/ApiTests';
import { LoginPage } from '../pages/ui/LoginTests';
import { SignUpPage } from '../pages/ui/SignUpTests';
import { UserFactory } from '../factories/UserFactory';
import { User } from '../models/User';

type Fixtures = {
  apiTests: ApiTests;
  loginPage: LoginPage;
  signUpPage: SignUpPage;
  testUser: User;
};

export const test = base.extend<Fixtures>({
  apiTests: async ({ request }, use) => {
    await use(new ApiTests(request));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },

  // creates a fresh user via API before the test, deletes it after —
  // teardown runs even if the test fails or throws
  testUser: async ({ apiTests }, use) => {
    const user = UserFactory.default();
    const response = await apiTests.createAccount(user);

    if (response.responseBody.message !== "User created!") {
      throw new Error("User creation failed, cannot proceed with test");
    }

    await use(user);              // <- test runs here

    await apiTests.deleteAccount(user.email, user.password); // teardown
  },
});

export { expect };