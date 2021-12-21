
class User { 
    // Constructor
    constructor(id, username, familyName, givenName, email, avatar_url, bio, country_id, is_admin) {
        this.id = id;
        this.username = username;
        this.familyName = familyName;
        this.givenName = givenName;
        this.email = email;
        this.avatar_url = avatar_url;
        this.bio = bio;
        this.country_id = country_id;
        this.is_admin = is_admin;
    }

    // Getters
    getId() { return this.id; }
    getUsername() { return this.username; }
    getFamilyName() { return this.familyName; }
    getGivenName() { return this.givenName; }
    getEmail() { return this.email; }
    getBio() { return this.bio; }
    getCountryId() { return this.country_id; }
    getIsAdmin() { return this.is_admin; }

    // Setters
    setId(id) { this.id = id; }
    setUsername(username) { this.username = username; }
    setFamilyName(familyName) { this.familyName = familyName; }
    setGivenName(givenName) { this.givenName = givenName; }
    setEmail(email) { this.email = email; }
    setBio(bio) { this.bio = bio; }
    setCountryId(country_id) { this.country_id = country_id; }
    setIsAdmin(is_admin) { this.is_admin = is_admin; }

    // To String
    toString() { return "User: " + this.id + " " + this.username + " " + this.familyName + " " + this.givenName + " " + this.email + " " + this.bio + " " + this.country_id + " " + this.is_admin; }
}