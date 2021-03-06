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

APACHE_WEB_SERVER_URL = 'http://localhost'

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
    header['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Access-Token'
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
            #Get the scope from the token data
            scope = data['scope']

            #Check if the scope is valid
            if scope == 'user':
                current_user = UserModel.query.filter_by(public_id=data['public_id']).first()
            else:
                return jsonify({'message': 'Invalid scope'}), 401

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

#region: POST VOTES API ENDPOINTS
@app.route("/api/posts/<int:post_id>/increment_upvotes", methods=["PUT"])
@token_required
def increment_post_upvotes(current_user, post_id):
    """
    This function increments an existing posts upvotes.
    """
    
    # Query the database for the post
    post = PostModel.query.filter_by(id=post_id).first()

    # Check if the post exists
    if post is None:
        return jsonify({"message": "Post not found."}), 404

    # Increment the post's upvotes
    post.upvotes += 1

    # Add the post to the database
    db.session.commit()

    # Return the post
    return jsonify(post.serialize()), 204

@app.route("/api/posts/<int:post_id>/decrement_upvotes", methods=["PUT"])
@token_required
def decrement_post_upvotes(current_user, post_id):
    """
    This function decrements an existing posts upvotes.
    """
        
    # Query the database for the post
    post = PostModel.query.filter_by(id=post_id).first()

    # Check if the post exists
    if post is None:
        return jsonify({"message": "Post not found."}), 404

    # Decrement the post's upvotes
    post.upvotes -= 1

    # Add the post to the database
    db.session.commit()

    # Return the post
    return jsonify(post.serialize()), 204

@app.route("/api/posts/<int:post_id>/increment_downvotes", methods=["PUT"])
@token_required
def increment_post_downvotes(current_user, post_id):
    """
    This function increments an existing posts downvotes.
    """
    
    # Query the database for the post
    post = PostModel.query.filter_by(id=post_id).first()

    # Check if the post exists
    if post is None:
        return jsonify({"message": "Post not found."}), 404

    # Increment the post's upvotes
    post.downvotes += 1

    # Add the post to the database
    db.session.commit()

    # Return the post
    return jsonify(post.serialize()), 204

@app.route("/api/posts/<int:post_id>/decrement_downvotes", methods=["PUT"])
@token_required
def decrement_post_downvotes(current_user, post_id):
    """
    This function decrements an existing posts downvotes.
    """
        
    # Query the database for the post
    post = PostModel.query.filter_by(id=post_id).first()

    # Check if the post exists
    if post is None:
        return jsonify({"message": "Post not found."}), 404

    # Decrement the post's upvotes
    post.downvotes -= 1

    # Add the post to the database
    db.session.commit()

    # Return the post
    return jsonify(post.serialize()), 204
#endregion

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

# GET CURRENT USER
@app.route("/api/users/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    """
    This function returns the current user.
    """
    return jsonify(current_user.serialize()), 200

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

#region: USER POSTS API ENDPOINT
@app.route("/api/users/<string:user_public_id>/posts", methods=["GET"])
@token_required
def get_user_posts(current_user, user_public_id):
    """
    This function returns a list of all posts for a user.
    """

    # Query the user_has_posts_table for the user
    user_posts = UserHasPostsModel.query.filter_by(user_id=user_public_id).all()

    # Check if there are any posts
    if user_posts is None:
        return jsonify({"message": "No posts found."}), 404

    # Sort the posts by date posted
    user_posts = sorted(user_posts, key=lambda k: k.post_id, reverse=True)

    # Return the posts
    return jsonify(posts=[post.serialize() for post in user_posts]), 200

@app.route("/api/users/me/posts", methods=["GET"])
@token_required
def get_current_user_posts(current_user):
    """
    This function returns a list of all posts for the current user.
    """

    # Query the user_has_posts_table for the user
    user_posts = UserHasPostsModel.query.filter_by(user_id=current_user.public_id).all()

    # Check if there are any posts
    if user_posts is None:
        return jsonify({"message": "No posts found."}), 404

    # Return the posts
    return jsonify(posts=[post.serialize() for post in user_posts]), 200

@app.route("/api/users/posts/<int:post_id>", methods=["GET"])
@token_required
def get_user_from_post_id(current_user, post_id):
    """
    This function returns the user that posted a post.
    """

    # Query the user_has_posts_table for the user
    user_posts = UserHasPostsModel.query.filter_by(post_id=post_id).first()

    user = UserModel.query.filter_by(public_id=user_posts.user_id).first()

    # Check if there are any posts
    if user is None:
        return jsonify({"message": "No user found."}), 404

    # Return the posts
    return jsonify(user.serialize()), 200

@app.route("/api/users/me/posts", methods=["POST"])
@token_required
def create_user_post(current_user):
    """
    This function creates a post for a user.
    """

    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    # Create the post
    post = UserHasPostsModel(
        user_id=current_user.public_id,
        post_id=data["post_id"]
    )

    # Add the post to the database
    db.session.add(post)
    db.session.commit()

    # Return the post
    return jsonify(post.serialize()), 201
#endregion

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
        token = jwt.encode(
            {
                'public_id' : user.public_id,
                'scope' : 'user',
                'exp' : datetime.datetime.utcnow() + datetime.timedelta(days=12)
            }, 
            app.config['SECRET_KEY']
        )
        
        refresh_token = jwt.encode(
            {
                'public_id' : user.public_id, 
                'scope' :  'refresh',
                'exp' : datetime.datetime.utcnow() + datetime.timedelta(days=60)
            }, 
            app.config['SECRET_KEY']
        )

        ts = time.time()
        timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
        user.last_login = timestamp

        db.session.commit()

        return jsonify({'token' : token.decode('utf-8'), 'refreshToken': refresh_token.decode('utf-8')}), 200

    return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
#endregion

#region: REFRESH TOKEN ENDPOINT

# REFERSH AN OLD JWT TOKEN
@app.route("/api/refreshtoken")
def refresh():
    # GET OLD TOKEN FROM HEADERS
    token = request.headers["X-Access-Token"]

    # VALIDATE THE TOKEN
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'])
    except:
        return jsonify({"message": "Token is invalid."}), 401

    # GENERATE A NEW TOKEN
    new_token = jwt.encode(
        {
            'public_id' : data['public_id'], 
            'scope' : 'user', 
            'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, 
        app.config['SECRET_KEY']
    )

    # RETURN THE NEW TOKEN
    return jsonify({'token' : new_token.decode('utf-8')}), 200
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

#endregion

#region: CHALLENGE API ENDPOINT
@app.route("/api/challenges", methods=["GET"])
@token_required
def get_active_challenges(current_user):
    """
    Returns a list of all challenges.
    """
    #get all the challenges thats end date is greater than now
    challenges = ChallengeModel.query.filter(ChallengeModel.end_date > datetime.datetime.now()).all()

    #sort the challenges by start date
    challenges = sorted(challenges, key=lambda x: x.start_date)

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

#region: CHALLENGE HAS POSTS API ENDPOINT
@app.route("/api/challenges/<int:challenge_id>/posts", methods=["GET"])
@token_required
def get_challenge_posts(current_user, challenge_id):
    """
    Returns a list of all posts of a challenge.
    """
    #get all the posts of a challenge
    posts = ChallengeHasPostsModel.query.filter_by(challenge_id=challenge_id).all()

    #sort the posts by id
    posts = sorted(posts, key=lambda x: x.post_id, reverse=True)

    return jsonify(posts=[post.serialize() for post in posts]), 200

@app.route("/api/challenges/<int:challenge_id>/posts", methods=["POST"])
@token_required
def create_challenge_post(current_user, challenge_id):
    """
    This function creates a new post of a challenge.
    """
    # Get the data from the request
    data = request.get_json()

    # Check if the data is valid
    if not data:
        return jsonify({"message": "No data provided."}), 400

    # Create the post
    post = ChallengeHasPostsModel(
        challenge_id=challenge_id,
        post_id=data["post_id"]
    )

    # Add the post to the database
    db.session.add(post)
    db.session.commit()

    # UPDATE THE CAHALLENGE TIMES COMPLETED
    # Get the challenge
    challenge = ChallengeModel.query.get(challenge_id)

    # Increment the times completed
    challenge.times_completed += 1

    # Add the challenge to the database
    db.session.commit()

    # Return the post
    return jsonify(post.serialize()), 201

@app.route("/api/challenges/<int:challenge_id>/posts/<int:post_id>", methods=["DELETE"])
@token_required
def delete_challenge_post(current_user, challenge_id, post_id):
    """
    This function deletes a post of a challenge.
    """

    if current_user.is_admin:
        # Get the post
        post = ChallengeHasPostsModel.query.get((challenge_id, post_id))

        # Delete the post
        db.session.delete(post)
        db.session.commit()

        # Return a success message
        return "", 204

    else :
        return jsonify({"message": "You are not authorized to delete this post."}), 401

#endregion

#endregion

#endregion

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
