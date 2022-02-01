# Using flask to build and run the webserver
from email.policy import default
from flask import Flask, request, jsonify, make_response

# DB
from shared.db import db
# DB MODELS
from shared.dbmodels.photo import PhotoModel
from shared.dbmodels.post import PostModel
from shared.dbmodels.user import UserModel, UserHasBadgesModel, UserHasChallengesModel, UserHasPostsModel
from shared.dbmodels.badge import BadgeModel
from shared.dbmodels.challenge import ChallengeModel, ChallengeHasPostsModel
from shared.dbmodels.country import CountryModel

# SECURITY
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

# PYTHON BUILT-IN IMPORTS
from functools import wraps
import configparser
from os import path
import uuid
import datetime
import time
import json

APACHE_WEB_SERVER_URL = 'localhost'

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
app.app_context().push()

# DB APP INITIALIZATION
db.init_app(app)
# DB CREATION - IF RAN MAY OVERWRITE EXISTING DB 
# db.create_all()

@app.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

#IF COUNTRIES ARENT ALREADY ON THE DB
countries_file_path = path.join(thisfolder, "countries.json")
if CountryModel.query.count() == 0:
    with open(countries_file_path) as f:
        countries = json.load(f)
        for country in countries:
            country_model = CountryModel(
                name=country["Name"],
                code=country["Code"],
            )
            db.session.add(country_model)
        db.session.commit()

#region: API

#region: TOKEN VALIDATOR DECORATOR
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

#region: PHOTO API ENDPOINTS
@app.route('/api/photos/<int:photo_id>', methods=['GET'])
@token_required
def get_photo(current_user, photo_id):
    photo = PhotoModel.query.filter_by(id=photo_id).first()

    if not photo:
        return jsonify({'message': 'No photo found'}), 404

    return jsonify(photo.serialize()), 200

@app.route('/api/photos', methods=['POST'])
@token_required
def create_photo(current_user):
    """
    This function creates a new photo.
    """
    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    # Create the user
    photo = PhotoModel(
        url=data['url'],
        camera=data['camera'],
        focal_length=data['focal_length'],
        aperture=data['aperture'],
        iso=data['iso'],
        shutter_speed=data['shutter_speed'],
        location=data['location'],
        date_taken=data['date_taken'],
    )

    # Add the user to the database
    db.session.add(photo)
    db.session.commit()

    # Return the user
    return jsonify(photo.serialize()), 201

@app.route("/api/photos/<int:photo_id>", methods=["PUT"])
@token_required
def update_photo(current_user, photo_id):
    """
    This function updates an existing photo.
    """

    # Query the database for the user
    photo = PhotoModel.query.filter_by(id=photo_id).first()

    # Check if the user exists
    if photo is None:
        return jsonify({"message": "Photo not found."}), 404

    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    # Update the user
    photo.url = data["url"] if ("url" in data.keys()) and (data["url"] != None) else photo.url
    photo.camera = data["camera"] if "camera" in data.keys() else photo.camera
    photo.focal_length = data["focal_length"] if "focal_length" in data.keys() else photo.focal_length
    photo.aperture = data["aperture"] if "aperture" in data.keys() else photo.aperture
    photo.iso = data["iso"] if "iso" in data.keys() else photo.iso
    photo.shutter_speed = data["shutter_speed"] if "shutter_speed" in data.keys() else photo.shutter_speed
    photo.location = data["location"] if "location" in data.keys() else photo.location
    photo.date_taken = data["date_taken"] if "date_taken" in data.keys() else photo.date_taken
    
    # Add the user to the database
    db.session.commit()

    # Return the user
    return jsonify(photo.serialize()), 204

@app.route('/api/photos/<int:photo_id>', methods=['DELETE'])
@token_required
def delete_photo(current_user, photo_id):
    """
    This function deletes an existing photo.
    """

    # Query the database for the user
    photo = PhotoModel.query.filter_by(id=photo_id).first()

    # Check if the user exists
    if photo is None:
        return jsonify({"message": "photo not found."}), 404

    # Delete the user
    db.session.delete(photo)
    db.session.commit()

    # Return a success code
    return "", 204

#endregion

#region: POST API ENDPOINTS
@app.route("/api/posts/<int:post_id>", methods=["GET"])
@token_required
def get_single_post(current_user, post_id):
    """
    This function returns a single post.
    """

    # Query the database for the user
    post = PostModel.query.filter_by(id=post_id).first()

    # Check if the user exists
    if post is None:
        return jsonify({"message": "Post not found."}), 404

    # Return the user
    return jsonify(post.serialize()), 200

@app.route("/api/posts", methods=["POST"])
@token_required
def create_post(current_user):
    """
    This function creates a new user.
    """
    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    post = PostModel(
        photo_id=data['photo_id'],
        desc = data['desc'],
        #posted_at = data['posted_at'],
        upvotes = 0,
        downvotes = 0
    )

    # Add the post to the database
    db.session.add(post)
    db.session.commit()

    # Return the post
    return jsonify(post.serialize()), 201

@app.route("/api/posts/<int:post_id>", methods=["PUT"])
@token_required
def update_post(current_user, post_id):
    """
    This function updates an existing post.
    """

    # Query the database for the post
    post = PostModel.query.filter_by(id=post_id).first()

    # Check if the post exists
    if post is None:
        return jsonify({"message": "Post not found."}), 404

    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    # Update the post
    post.desc = data["desc"] if "desc" in data.keys() else post.desc
    post.upvotes = data["upvotes"] if "upvotes" in data.keys() else post.upvotes
    post.downvotes = data["downvotes"] if "downvotes" in data.keys() else post.downvotes

    # Add the post to the database
    db.session.commit()

    # Return the post
    return jsonify(post.serialize()), 204

@app.route("/api/posts/<int:post_id>", methods=["DELETE"])
@token_required
def delete_post(current_user, post_id):
    """
    This function deletes an existing post.
    """

    # Query the database for the post
    post = PostModel.query.filter_by(id=post_id).first()

    # Check if the post exists
    if post is None:
        return jsonify({"message": "Post not found."}), 404

    # Delete the post
    db.session.delete(post)
    db.session.commit()

    # Return a success code
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
    if "password" in data.keys() and data["password"] != None:
        user.password = generate_password_hash(data["password"], method='sha256')
    else:
        user.password = user.password

    user.email = data["email"] if ("email" in data.keys()) and (data["email"] != None) else user.email
    user.country_id = data["country_id"] if "country_id" in data.keys() else user.country_id
    user.given_name = data["given_name"] if ("given_name" in data.keys()) and (data["given_name"] != None) else user.given_name
    user.family_name = data["email"] if ("family_name" in data.keys()) and (data["family_name"] != None) else user.family_name
    user.date_of_birth = data["date_of_birth"] if ("date_of_birth" in data.keys()) and (data["date_of_birth"] != None) else user.date_of_birth
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
#endregion

#region: REGISTER API ENDPOINT
@app.route("/api/register", methods=["POST"])
def register():
    """
    This function creates a new user.
    """
    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    # Check if the username already exists
    user = UserModel.query.filter_by(username=data["username"]).first()
    if user:
        return jsonify({"message": "User already exists."}), 400

    hashed_password = generate_password_hash(data["password"], method='sha256')

    ts = time.time()
    timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

    # Create the user
    user = UserModel(
        public_id=str(uuid.uuid4()),
        username = data["username"],
        password = hashed_password,  
        email = data["email"],
        registered_at = timestamp,

        country_id = data["country_id"],
        given_name = data["given_name"],
        family_name = data["family_name"],
        date_of_birth = data["date_of_birth"],

        avatar_url = f"{APACHE_WEB_SERVER_URL}/assets/images/static/default-avatar.png",
        is_admin = False
    )

    # Add the user to the database
    db.session.add(user)
    db.session.commit()

    # Return the user
    return jsonify(user.serialize()), 201
#endregion

#region: LOGIN TOKEN ENDPOINT
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
        
        ts = time.time()
        timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
        user.last_login = timestamp

        db.session.commit()

        return jsonify({'token' : token.decode('utf-8')}), 200

    return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
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

@app.route("/api/countries/code/<string:country_code>", methods=["GET"])
def get_country_by_code(country_code):
    country = CountryModel.query.filter_by(code=country_code).first()
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
        code=data["code"]
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

#region: CHALLENGE API ENDPOINT
@app.route("/api/challenges", methods=["GET"])
@token_required
def get_active_challenges(current_user):
    """
    Returns a list of all challenges.
    """
    challenges = ChallengeModel.query.all().filter_by(ChallengeModel.end_date >= datetime.datetime.now())
    return jsonify(challenges=[challenge.serialize() for challenge in challenges]), 200

@app.route("/api/challenges/<int:challenge_id>", methods=["GET"])
@token_required
def get_challenge(current_user, challenge_id):
    """
    Returns a challenge with a specific id.
    """
    challenge = ChallengeModel.query.get(challenge_id)
    return jsonify(challenge.serialize()), 200

@app.route("/api/challenges", methods=["POST"])
@token_required
def create_challenge(current_user):
    """
    This function creates a new challenge.
    """
    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    # Create the challenge
    challenge = ChallengeModel(
        title=data["title"],
        description=data["description"],
        start_date=data["start_date"],
        end_date=data["end_date"],
        times_completed=0
    )

    # Add the challenge to the database
    db.session.add(challenge)
    db.session.commit()

    # Return the challenge
    return jsonify(challenge.serialize()), 201

@app.route("/api/challenges/<int:challenge_id>", methods=["PUT"])
@token_required
def increment_times_completed(current_user, challenge_id):
    """
    This function increments the times completed of a challenge.
    """
    # Get the challenge
    challenge = ChallengeModel.query.get(challenge_id)

    # Increment the times completed
    challenge.times_completed += 1

    # Add the challenge to the database
    db.session.commit()

    # Return the challenge
    return jsonify(challenge.serialize()), 204

@app.route("/api/challenges/<int:challenge_id>", methods=["DELETE"])
@token_required
def delete_challenge(current_user, challenge_id):
    """
    This function deletes a challenge.
    """

    if current_user.is_admin:
        # Get the challenge
        challenge = ChallengeModel.query.get(challenge_id)

        # Delete the challenge
        db.session.delete(challenge)
        db.session.commit()

        # Return a success message
        return "", 204

    else :
        return jsonify({"message": "You are not authorized to delete this challenge."}), 401
#endregion

#endregion

if __name__ == "__main__":
    app.run(debug=True)
