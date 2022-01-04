# TODO - ADD VALIDATION TO API REQUESTS

#region: IMPORTS
# Using flask to build and run the webserver
import datetime

from flask import Flask, request, jsonify, make_response

# Using SQLAlchemy to handle database and control SQL queries. 
# It will sanitizes the queries by default
from flask_sqlalchemy import SQLAlchemy

# SECURITY
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps

import configparser

from os import path

import uuid
#endregion

#region: Initialization
# READING THE CONFIG FILE
config_parser = configparser.RawConfigParser()   
thisfolder = path.dirname(path.abspath(__file__))
config_file = path.join(thisfolder, 'config.cfg')
config_parser.read(config_file)

# CREATING THE FLASK APP
app = Flask(__name__)
app.config['SECRET_KEY'] = config_parser.get('flask-api', 'secret_key')
#endregion

#region: Database Handling
# DATABSE HANDLINING
DB_SERVER = config_parser.get("mysql-database", "DB_SERVER")
DB_NAME = config_parser.get("mysql-database", "DB_NAME")
DB_USER = config_parser.get("mysql-database", "DB_USER")
DB_PASSWORD = config_parser.get("mysql-database", "DB_PASSWORD")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_SERVER}/{DB_NAME}"
db = SQLAlchemy(app)

# DATABASE MODELS
# POST DATA RELATED MODELS
class PhotoModel(db.Model):
    """
    The PhotoModel class is the model for the database table 'photos'.
    """
    __tablename__ = "photos"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    url = db.Column(db.String(200), nullable=False)
    camera = db.Column(db.String(50), nullable=True)
    focal_length = db.Column(db.Integer, nullable=True)
    aperture = db.Column(db.Float, nullable=True)
    iso = db.Column(db.Integer, nullable=True)
    shutter_speed = db.Column(db.String(15), nullable=True)

    def __repr__(self) -> str:
        """
        The __repr__ method is used to print the object.
        """
        return f"Photo(id='{self.id}', url='{self.url}', camera='{self.camera}', focal_length='{self.focal_length}', aperture='{self.aperture}', iso='{self.iso}', shutter_speed='{self.shutter_speed}', date_taken='{self.date_taken}')"

    def serialize(self) -> dict:
        """
        The serialize method is used to serialize the object into a dictionary.
        """
        return {
            "id": self.id,
            "url": self.url,
            "camera": self.camera,
            "focal_length": self.focal_length,
            "aperture": self.aperture,
            "iso": self.iso,
            "shutter_speed": self.shutter_speed,
            "date_taken": self.date_taken
        }

class PostModel(db.Model):
    """
    The PostModel class is the model for the database table 'posts'.
    """
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    photo_id = db.Column(db.Integer, db.ForeignKey("photos.id"), nullable=False)
    desc = db.Column(db.String(280), nullable=True)
    posted_at = db.Column(db.DateTime, nullable=False)
    upvotes = db.Column(db.Integer, nullable=False)
    downvotes = db.Column(db.Integer, nullable=False)

    def __repr__(self) -> str:
        return f"Post(photo_id={self.photo_id}, desc={self.desc}, posted_at={self.posted_at}, upvotes={self.upvotes}, downvotes={self.downvotes})"

    def serialize(self) -> dict:
        """
        The serialize method is used to serialize the object into a dictionary.
        """
        return {
            "id": self.id,
            "photo_id": self.photo_id,
            "desc": self.desc,
            "posted_at": self.posted_at,
            "upvotes": self.upvotes,
            "downvotes": self.downvotes
        }

# CHALLENGE DATA RELATED MODELS
class ChallengeModel(db.Model):
    """
    The ChallengeModel class is the model for the database table 'challenges'.
    """
    __tablename__ = "challenges"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(280), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    times_completed = db.Column(db.Integer, nullable=False)

    def __repr__(self) -> str:
        return f"Challenge(title={self.title}, desc={self.desc}, start_date={self.start_date}, end_date={self.end_date}, times_completed={self.times_completed})"

    def serialize(self) -> dict:
        """
        The serialize method is used to serialize the object into a dictionary.
        """
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "times_completed": self.times_completed
        }

class ChallengeHasPostsModel(db.Model):
    """
    The ChallengeHasPostsModel class is the model for the database table 'challenges_has_posts'.
    """
    __tablename__ = "challenges_has_posts"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    challenge_id = db.Column(db.Integer, db.ForeignKey("challenges.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)

    def __repr__(self) -> str:
        return f"ChallengeHasPosts(challenge_id={self.challenge_id}, post_id={self.post_id})"

    def serialize(self) -> dict:
        """
        The serialize method is used to serialize the object into a dictionary.
        """
        return {
            "id": self.id,
            "challenge_id": self.challenge_id,
            "post_id": self.post_id
        }

# USER DATA RELATED MODELS
class UserModel(db.Model):
    """
    The UserModel class is the model for the database table 'users'.
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    public_id = db.Column(db.String(50), nullable=False, unique=True)
    username = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(256), nullable=False)
    country_id = db.Column(db.Integer, db.ForeignKey("countries.id"), nullable=False)
    email = db.Column(db.String(320), nullable=False)
    avatar_url = db.Column(db.String(200), nullable=True)
    bio = db.Column(db.String(280), nullable=True)
    is_admin = db.Column(db.Boolean, nullable=False)

    def __repr__(self) -> str:
        return f"User(username={self.username}, country_id={self.country_id}, email={self.email}, avatar_url={self.avatar_url}, is_admin={self.is_admin})"

    def serialize(self) -> dict:
        """
        The serialize method is used to serialize the object into a dictionary.
        """
        return {
            "id": self.id,
            "public_id": self.public_id,
            "username": self.username,
            "country_id": self.country_id,
            "email": self.email,
            "avatar_url": self.avatar_url,
            "bio": self.bio,
            "is_admin": self.is_admin
        }

class CountryModel(db.Model):
    """
    The CountryModel class is the model for the database table 'countries'.
    """
    __tablename__ = "countries"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(56), nullable=False)
    code = db.Column(db.String(2), nullable=False) # ISO 3166-2 code
    flag_url = db.Column(db.String(200), nullable=False)

    def __repr__(self) -> str:
        return f"Country(name={self.name}, iso3166_2_code={self.code}, flag_url={self.flag_url})"

    def serialize(self) -> dict:
        """
        The serialize method is used to serialize the object into a dictionary.
        """
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "flag_url": self.flag_url
        }

class BadgeModel(db.Model):
    """
    The BadgeModel class is the model for the database table 'badges'.
    """
    __tablename__ = "badges"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    desc = db.Column(db.String(280), nullable=False)
    icon_url = db.Column(db.String(200), nullable=False)

    def __repr__(self) -> str:
        return f"Badge(name={self.name}, desc={self.desc}, icon_url={self.icon_url})"

    def serialize(self) -> dict:
        """
        The serialize method is used to serialize the object into a dictionary.
        """
        return {
            "id": self.id,
            "name": self.name,
            "desc": self.desc,
            "icon_url": self.icon_url
        }

class UserHasBadgesModel(db.Model):
    """
    The UserHasBadgesModel class is the model for the database table 'user_has_badges'.
    """
    __tablename__ = "user_has_badges"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey("badges.id"), nullable=False)

    def __repr__(self) -> str:
        return f"UserHasBadges(user_id={self.user_id}, badge_id={self.badge_id})"

    def serialize(self) -> dict:
        """
        The serialize method is used to serialize the object into a dictionary.
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "badge_id": self.badge_id
        }

class UserHasChallengesModel(db.Model):
    """
    The UserHasChallengesModel class is the model for the database table 'user_has_challenges'.
    """
    __tablename__ = "user_has_challenges"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    challenge_id = db.Column(db.Integer, db.ForeignKey("challenges.id"), nullable=False)

    def __repr__(self) -> str:
        return f"UserHasChallenges(user_id={self.user_id}, challenge_id={self.challenge_id})"

    def serialize(self) -> dict:
        """
        The serialize method is used to serialize the object into a dictionary.
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "challenge_id": self.challenge_id
        }

class UserHasPostsModel(db.Model):
    """
    The UserHasPostsModel class is the model for the database table 'user_has_posts'.
    """
    __tablename__ = "user_has_posts"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)

    def __repr__(self) -> str:
        return f"UserHasPosts(user_id={self.user_id}, post_id={self.post_id})"

    def serialize(self) -> dict:
        """
        The serialize method is used to serialize the object into a dictionary.
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id
        }

# IF RAN MAY OVERWRITE EXISTING DB 
#db.create_all()

#endregion

#region: API

#region: TOKEN VALIDATOR WRAPPER
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = UserModel.query.filter_by(public_id=data['public_id']).first()
        except:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)
    
    return decorated
#endregion

#region: COUNTRY API ENDPOINT
@app.route("/api/countries", methods=["GET"])
@token_required
def get_countries(current_user):
    """
    Returns a list of all countries.
    """
    countries = CountryModel.query.all()
    return jsonify(countries=[country.serialize() for country in countries]), 200

@app.route("/api/countries/<int:country_id>", methods=["GET"])
@token_required
def get_country(current_user, country_id):
    """
    Returns a country with a specific id.
    """
    country = CountryModel.query.get(country_id)
    return jsonify(country.serialize()), 200

@app.route("/api/countries", methods=["POST"])
@token_required
def create_country(current_user):
    """
    This function creates a new country.
    """
    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    # Create the country
    country = CountryModel(
        name=data["name"],
        code=data["code"],
        flag_url=data["flag_url"]
    )

    # Add the country to the database
    db.session.add(country)
    db.session.commit()

    # Return the country
    return jsonify(country.serialize()), 201

@app.route("/api/countries/<int:country_id>", methods=["PUT"])
@token_required
def update_country(current_user, country_id):
    """
    This function updates a country.
    """
    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    # Get the country
    country = CountryModel.query.get(country_id)

    # Update the country
    country.name = data["name"] if ("name" in data.keys()) and (data["name"] != None) else country.name
    country.code = data["code"] if ("code" in data.keys()) and (data["code"] != None) else country.code
    country.flag_url = data["flag_url"] if ("flag_url" in data.keys()) and (data["flag_url"] != None) else country.flag_url
    
    # Add the country to the database
    db.session.commit()

    # Return the country
    return jsonify(country.serialize()), 204

@app.route("/api/countries/<int:country_id>", methods=["DELETE"])
@token_required
def delete_country(current_user, country_id):
    """
    This function deletes a country.
    """
    # Get the country
    country = CountryModel.query.get(country_id)

    # Delete the country
    db.session.delete(country)
    db.session.commit()

    # Return a success message
    return "", 204

#endregion
#region: USER API ENDPOINT
@app.route("/api/users", methods=["GET"])
@token_required
def get_users(current_user):
    """
    Returns a list of all users.
    """
    if not current_user.is_admin:
        return jsonify({"message": "Cannot perform that function!"}), 401

    users = UserModel.query.all()
    return jsonify(users=[user.serialize() for user in users]), 200

@app.route("/api/users/<string:user_public_id>", methods=["GET"])
@token_required
def get_single_user(current_user, user_public_id):
    """
    This function returns a single user.
    """

    # Query the database for the user
    user = UserModel.query.filter_by(public_id=user_public_id).first()

    # Check if the user exists
    if user is None:
        return jsonify({"message": "User not found."}), 404

    # Return the user
    return jsonify(user.serialize()), 200

@app.route("/api/users", methods=["POST"])
@token_required
def create_user(current_user):
    """
    This function creates a new user.
    """
    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    hashed_password = generate_password_hash(data["password"], method='sha256')

    # Create the user
    user = UserModel(
        public_id=str(uuid.uuid4()),
        username = data["username"],
        password = hashed_password,
        country_id = data["country_id"],
        email = data["email"],
        avatar_url = data["avatar_url"],
        bio = data["bio"],
        is_admin = False
    )

    # Add the user to the database
    db.session.add(user)
    db.session.commit()

    # Return the user
    return jsonify(user.serialize()), 201

@app.route("/api/users/<string:user_public_id>", methods=["PUT"])
@token_required
def update_user(current_user, user_public_id):
    """
    This function updates an existing user.
    """

    # Query the database for the user
    user = UserModel.query.filter_by(public_id=user_public_id).first()

    # Check if the user exists
    if user is None:
        return jsonify({"message": "User not found."}), 404

    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    # Update the user
    user.username = data["username"] if ("username" in data.keys()) and (data["username"] != None) else user.username
    user.country_id = data["country_id"] if ("country_id" in data.keys()) and (data["country_id"] != None) else user.country_id
    user.email = data["email"] if ("email" in data.keys()) and (data["email"] != None) else user.email
    user.avatar_url = data["avatar_url"] if "avatar_url" in data.keys() else user.avatar_url
    user.bio = data["bio"] if "bio" in data.keys() else user.bio
    user.is_admin = data["is_admin"] if ("is_admin" in data.keys()) and (data["is_admin"] != None) else user.is_admin

    # Add the user to the database
    db.session.commit()

    # Return the user
    return jsonify(user.serialize()), 204

@app.route("/api/users/<string:user_public_id>", methods=["DELETE"])
@token_required
def delete_user(current_user, user_public_id):
    """
    This function deletes an existing user.
    """

    # Query the database for the user
    user = UserModel.query.filter_by(public_id=user_public_id).first()

    # Check if the user exists
    if user is None:
        return jsonify({"message": "User not found."}), 404

    # Delete the user
    db.session.delete(user)
    db.session.commit()

    # Return a success code
    return "", 204

#LOGIN TOKEN ENDPOINT
@app.route("/api/login")
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    user = UserModel.query.filter_by(username=auth.username).first()

    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    if check_password_hash(user.password, auth.password):
        token = jwt.encode({'public_id' : user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])

        return jsonify({'token' : token.decode('utf-8')})

    return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

#endregion
#endregion

if __name__ == "__main__":
    app.run(debug=True)
