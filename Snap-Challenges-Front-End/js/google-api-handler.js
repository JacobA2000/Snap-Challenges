export class GoogleApi {

    // construtor
    constructor(accessToken) {
        this.accessToken = accessToken
    };

    async getUserData() {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${this.accessToken}`);
        const user_data = await response.json();
        return user_data;
    };
}