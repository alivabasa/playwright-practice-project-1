export interface User{
        name:        string;
        email:       string;
        password:    string;
        title:       'Mr' | 'Mrs' | 'Miss';
        firstName:   string;
        lastName:    string;
        birthDate:   string;
        birthMonth:  string;
        birthYear:   string;
        company:     string;
        address1:    string;
        address2:    string;
        country:     string;
        zipcode:     string;
        state:       string;
        city:        string;
        mobileNumber: string;
}

export interface UserDetailResponse {
    responseCode: number;
    user: {
      id:          number;
      name:        string;
      email:       string;
      title:       string;
      birth_date:  string;
      birth_month: string;
      birth_year:  string;
      first_name:  string;
      last_name:   string;
      company:     string;
      address1:    string;
      address2:    string;
      country:     string;
      zipcode:     string;
      state:       string;
      city:        string;
      mobile_number: string;
    };
  }
  
  export interface ApiMessageResponse {
    responseCode: number;
    message:      string;
  }