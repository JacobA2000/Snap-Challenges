#region: IMPORTS
# Using flask to build and run the webserver
from datetime import datetime
from flask import Flask
# Using flask_restful to create the API
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with, inputs
# Using SQLAlchemy to handle database and control SQL queries. 
# It will sanitizes the queries by default
from flask_sqlalchemy import SQLAlchemy
import configparser
from os import path
#endregion

#region: Initialization
# CREATING THE FLASK APP
app = Flask(__name__)
# CREATING THE API
api = Api(app)

# READING THE CONFIG FILE
config_parser = configparser.RawConfigParser()   
thisfolder = path.dirname(path.abspath(__file__))
config_file = path.join(thisfolder, 'config.cfg')
config_parser.read(config_file)
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
# USER DATA RELATED MODELS
class UserModel(db.Model):
    """
    The UserModel class is the model for the database table 'users'.
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(20), nullable=False)
    country_id = db.Column(db.Integer, db.ForeignKey("countries.id"), nullable=False)
    email = db.Column(db.String(320), nullable=False)
    avatar_url = db.Column(db.String(200), nullable=True)
    bio = db.Column(db.String(280), nullable=True)
    is_admin = db.Column(db.Boolean, nullable=False)

    def __repr__(self) -> str:
        return f"User(username={self.username}, country_id={self.country_id}, email={self.email}, avatar_url={self.avatar_url}, is_admin={self.is_admin})"
class CountryModel(db.Model):
    """
    The CountryModel class is the model for the database table 'countries'.
    """
    __tablename__ = "countries"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    code = db.Column(db.String(2), nullable=False) # ISO 3166-2 code
    flag_url = db.Column(db.String(200), nullable=False)

    def __repr__(self) -> str:
        return f"Country(name={self.name}, iso3166_2_code={self.code}, flag_url={self.flag_url})"
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

# IF RAN WILL OVERWRITE EXISTING DB 
# db.create_all()

#endregion

#region: API
#region: PHOTO API ENDPOINT
# REQPARSE ARGUMENTS
#POST ARGS
photo_post_args = reqparse.RequestParser()
photo_post_args.add_argument('url', type=str, required=True, help="url is required")
photo_post_args.add_argument('camera', type=str, required=False, help="camera must be type string")
photo_post_args.add_argument('focal_length', type=int, required=False, help="focal_length must be type int")
photo_post_args.add_argument('aperture', type=float, required=False, help="aperture must be type float")
photo_post_args.add_argument('iso', type=int, required=False, help="iso must be type int")
photo_post_args.add_argument('shutter_speed', type=str, required=False, help="shutter_speed must be type string")

# PUT ARGS
photo_put_args = reqparse.RequestParser()
photo_put_args.add_argument('url', type=str, required=False, help="url must be type str")
photo_put_args.add_argument('camera', type=str, required=False, help="camera must be type string")
photo_put_args.add_argument('focal_length', type=int, required=False, help="focal_length must be type int")
photo_put_args.add_argument('aperture', type=float, required=False, help="aperture must be type float")
photo_put_args.add_argument('iso', type=int, required=False, help="iso must be type int")
photo_put_args.add_argument('shutter_speed', required=False, type=str, help="shutter_speed must be type string")

# RESOURCE FIELDS FOR PHOTO
photo_resource_fields= {
    "id": fields.Integer,
    "url": fields.String,
    "camera": fields.String,
    "focal_length": fields.Integer,
    "aperture": fields.Float,
    "iso": fields.Integer,
    "shutter_speed": fields.String
}

class Photo(Resource):
    @marshal_with(photo_resource_fields)
    def get(self, photo_id) -> dict:
        """
        Handles GET requests sent to the api for photos.
        Used to retrieve data from the server.
        """
        photo = PhotoModel.query.filter_by(id=photo_id).one_or_none()
        if photo is None:
            abort(404, message=f"Photo {photo_id} doesn't exist".format(photo_id))
        else:
            return photo, 200
    
    @marshal_with(photo_resource_fields)
    def post(self, photo_id) -> dict:
        """
        Handles POST requests sent to the api for photos.
        Used to create data on the server.
        """
        args = photo_post_args.parse_args()
        
        photo = PhotoModel(
            id=photo_id, 
            **args
        )

        db.session.add(photo)
        db.session.commit()

        # Return the newly created photo and http code 201 to indicate success.
        return photo, 201

    @marshal_with(photo_resource_fields)
    def put(self, photo_id) -> dict:
        """
        Handles PUT requests sent to the api for photos.
        Used to update data on the server.
        """
        args = photo_put_args.parse_args()

        # Get the photo info sent to the api.
        updated_photo = PhotoModel(
            id=photo_id, 
            **args
        )
        
        photo = PhotoModel.query.filter_by(id=photo_id).one_or_none()

        if photo is None:
            abort(404, message=f"Photo with id: {photo_id} not found")
        else:
            # Update the photo in the database.
            photo.url = updated_photo.url if updated_photo.url != None else photo.url
            photo.camera = updated_photo.camera 
            photo.focal_length = updated_photo.focal_length
            photo.aperture = updated_photo.aperture 
            photo.iso = updated_photo.iso 
            photo.shutter_speed = updated_photo.shutter_speed

            db.session.commit()
            # Return the 204 HTTP Code to indicate that the resource has been updated.
            return '', 204
    
    def delete(self, photo_id) -> str:
        """
        Handles DELETE requests sent to the api for photos.
        Used to delete data from the server.
        """
        photo = PhotoModel.query.filter_by(id=photo_id).one_or_none()

        if photo is None:
            abort(404, message=f"Photo with id: {photo_id} not found")
        else:
            db.session.delete(photo)
            db.session.commit()
            # Return the 204 HTTP Code to indicate that the resource has been deleted.
            return '', 204

api.add_resource(Photo, "/api/photo/<int:photo_id>")
#endregion
#region: USER API ENDPOINT
user_post_args = reqparse.RequestParser()
user_post_args.add_argument("username", type=str, required=True, help="username is required")
user_post_args.add_argument("country_id", type=int, required=True, help="country_id is required")
user_post_args.add_argument("email", type=str, required=True, help="email is required")
user_post_args.add_argument("avatar_url", type=str, required=False, help="avatar_url must be type string")
user_post_args.add_argument("bio", type=str, required=False, help="bio must be type string")
user_post_args.add_argument("is_admin", type=bool, required=True, help="is_admin is required and must be type bool")

user_put_args = reqparse.RequestParser()
user_put_args.add_argument("username", type=str, required=False, help="username must be type str")
user_put_args.add_argument("country_id", type=int, required=False, help="country_id must be type int")
user_put_args.add_argument("email", type=str, required=False, help="email must be type str")
user_put_args.add_argument("avatar_url", type=str, required=False, help="avatar_url must be type string")
user_put_args.add_argument("bio", type=str, required=False, help="bio must be type string")
user_put_args.add_argument("is_admin", type=bool, required=False, help="is_admin must be type bool")

# RESOURCE FIELDS FOR USER
user_resource_fields= {
    "id": fields.Integer,
    "username": fields.String,
    "country_id": fields.Integer,
    "email": fields.String,
    "avatar_url": fields.String,
    "bio": fields.String,
    "is_admin": fields.Boolean
}
class User(Resource):
    @marshal_with(user_resource_fields)
    def get(self, user_id) -> dict:
        """
        Handles GET requests sent to the api for users.
        """
        user = UserModel.query.filter_by(id=user_id).first()
        return user, 200
    
    @marshal_with(user_resource_fields)
    def post(self, user_id) -> dict:
        """
        Handles POST requests sent to the api for photos.
        Used to create data on the server.
        """
        args = user_post_args.parse_args()
        
        user = UserModel(
            id=user_id, 
            **args
        )

        db.session.add(user)
        db.session.commit()

        # Return the newly created photo and http code 201 to indicate success.
        return user, 201

    @marshal_with(user_resource_fields)
    def put(self, user_id) -> dict:
        """
        Handles PUT requests sent to the api for users.
        Used to update data on the server.
        """
        args = user_put_args.parse_args()

        # Get the photo info sent to the api.
        updated_user = UserModel(
            id=user_id, 
            **args
        )
        
        user = UserModel.query.filter_by(id=user_id).one_or_none()

        if user is None:
            abort(404, message=f"User with id: {user_id} not found")
        else:
            # Update the photo in the database.
            user.username = updated_user.username if updated_user.username != None else user.username
            user.country_id = updated_user.country_id if updated_user.country_id != None else user.country_id
            user.email = updated_user.email if updated_user.email != None else user.email
            user.avatar_url = updated_user.avatar_url
            user.bio = updated_user.bio
            user.is_admin = updated_user.is_admin if updated_user.is_admin != None else user.is_admin

            db.session.commit()
            # Return the 204 HTTP Code to indicate that the resource has been updated.
            return '', 204

    def delete(self, user_id) -> str:
        """
        Handles DELETE requests sent to the api for users.
        """

        user = UserModel.query.filter_by(id=user_id).one_or_none()
        if user is None:
            abort(404, message=f"User with id: {user_id} not found")
        else:
            db.session.delete(user)
            db.session.commit()
            # Return the 204 HTTP Code to indicate that the resource has been deleted.
            return '', 204

api.add_resource(User, "/api/user/<int:user_id>")
#endregion
#region: COUNTRY API ENDPOINT
country_post_args = reqparse.RequestParser()
country_post_args.add_argument("name", type=str, required=True, help="name is required")
country_post_args.add_argument("code", type=str, required=True, help="code is required")
country_post_args.add_argument("flag_url", type=str, required=True, help="flag_url is required")

country_put_args = reqparse.RequestParser()
country_put_args.add_argument("name", type=str, required=False, help="name must be type str")
country_put_args.add_argument("code", type=str, required=False, help="code must be type str")
country_put_args.add_argument("flag_url", type=str, required=False, help="flag_url must be type str")

country_resource_fields= {
    "id": fields.Integer,
    "name": fields.String,
    "code": fields.String,
    "flag_url": fields.String
}

class Country(Resource):
    @marshal_with(country_resource_fields)
    def get(self, country_id) -> dict:
        """
        Handles GET requests sent to the api for countries.
        """
        country = CountryModel.query.filter_by(id=country_id).first()
        return country, 200
    
    @marshal_with(country_resource_fields)
    def post(self, country_id) -> dict:
        """
        Handles POST requests sent to the api for countries.
        Used to create data on the server.
        """
        args = country_post_args.parse_args()
        
        country = CountryModel(
            id=country_id, 
            **args
        )

        db.session.add(country)
        db.session.commit()

        # Return the newly created photo and http code 201 to indicate success.
        return country, 201

    @marshal_with(country_resource_fields)
    def put(self, country_id) -> dict:
        """
        Handles PUT requests sent to the api for countries.
        Used to update data on the server.
        """
        args = country_put_args.parse_args()

        # Get the photo info sent to the api.
        updated_country = CountryModel(
            id=country_id, 
            **args
        )
        
        country = CountryModel.query.filter_by(id=country_id).one_or_none()

        if country is None:
            abort(404, message=f"Country with id: {country_id} not found")
        else:
            # Update the photo in the database.
            country.name = updated_country.name if updated_country.name != None else country.name
            country.code = updated_country.code if updated_country.code != None else country.code
            country.flag_url = updated_country.flag_url if updated_country.flag_url != None else country.flag_url

            db.session.commit()
            # Return the 204 HTTP Code to indicate that the resource has been updated.
            return '', 204

    def delete(self, country_id) -> str:
        """
        Handles DELETE requests sent to the api for countries.
        """

        country = CountryModel.query.filter_by(id=country_id).one_or_none()
        if country is None:
            abort(404, message=f"Country with id: {country_id} not found")
        else:
            db.session.delete(country)
            db.session.commit()
            # Return the 204 HTTP Code to indicate that the resource has been deleted.
            return '', 204

api.add_resource(Country, "/api/country/<int:country_id>")
#endregion
#region: CHALLENGE API ENDPOINT
challenge_post_args = reqparse.RequestParser()
challenge_post_args.add_argument("title", type=str, required=True, help="title is required")
challenge_post_args.add_argument("description", type=str, required=True, help="description is required")
challenge_post_args.add_argument("start_date", type=inputs.datetime_from_iso8601, required=True, help="start_date is required")
challenge_post_args.add_argument("end_date", type=inputs.datetime_from_iso8601, required=True, help="end_date is required")
challenge_post_args.add_argument("times_completed", type=int, required=True, help="times_completed is required")

challenge_put_args = reqparse.RequestParser()
challenge_put_args.add_argument("title", type=str, required=False, help="title must be type str")
challenge_put_args.add_argument("description", type=str, required=False, help="description must be type str")
challenge_put_args.add_argument("start_date", type=datetime, required=False, help="start_date must be type str")
challenge_put_args.add_argument("end_date", type=datetime, required=False, help="end_date must be type str")
challenge_put_args.add_argument("times_completed", type=int, required=False, help="times_completed must be type int")

challenge_resource_fields= {
    "id": fields.Integer,
    "title": fields.String,
    "description": fields.String,
    "start_date": fields.DateTime(dt_format='iso8601'),
    "end_date": fields.DateTime(dt_format='iso8601'),
    "times_completed": fields.Integer
}

class Challenge(Resource):
    @marshal_with(challenge_resource_fields)
    def get(self, challenge_id) -> dict:
        """
        Handles GET requests sent to the api for challenges.
        """
        challenge = ChallengeModel.query.filter_by(id=challenge_id).first()
        return challenge, 200
    
    @marshal_with(challenge_resource_fields)
    def post(self, challenge_id) -> dict:
        """
        Handles POST requests sent to the api for challenges.
        Used to create data on the server.
        """
        args = challenge_post_args.parse_args()
        
        challenge = ChallengeModel(
            id=challenge_id, 
            **args
        )

        db.session.add(challenge)
        db.session.commit()

        # Return the newly created photo and http code 201 to indicate success.
        return challenge, 201

    @marshal_with(challenge_resource_fields)
    def put(self, challenge_id) -> dict:
        """
        Handles PUT requests sent to the api for challenges.
        Used to update data on the server.
        """
        args = challenge_put_args.parse_args()

        # Get the photo info sent to the api.
        updated_challenge = ChallengeModel(
            id=challenge_id, 
            **args
        )
        
        challenge = ChallengeModel.query.filter_by(id=challenge_id).one_or_none()

        if challenge is None:
            abort(404, message=f"Challenge with id: {challenge_id} not found")
        else:
            # Update the photo in the database.
            challenge.title = updated_challenge.title if updated_challenge.title != None else challenge.title
            challenge.description = updated_challenge.description if updated_challenge.description != None else challenge.description
            challenge.start_date = updated_challenge.start_date if updated_challenge.start_date != None else challenge.start_date
            challenge.end_date = updated_challenge.end_date if updated_challenge.end_date != None else challenge.end_date
            challenge.times_completed = updated_challenge.times_completed if updated_challenge.times_completed != None else challenge.times_completed
        
            db.session.commit()
            # Return the 204 HTTP Code to indicate that the resource has been updated.
            return '', 204

    def delete(self, challenge_id):
        """
        Handles DELETE requests sent to the api for challenges.
        """

        challenge = ChallengeModel.query.filter_by(id=challenge_id).one_or_none()
        if challenge is None:
            abort(404, message=f"Challenge with id: {challenge_id} not found")
        else:
            db.session.delete(challenge)
            db.session.commit()
            # Return the 204 HTTP Code to indicate that the resource has been deleted.
            return '', 204

api.add_resource(Challenge, "/api/challenge/<int:challenge_id>")

#endregion
#region: POST API ENDPOINT
post_post_args = reqparse.RequestParser()
post_post_args.add_argument("photo_id", type=int, required=True, help="photo_id is required")
post_post_args.add_argument("desc", type=str, required=False, help="desc must be string")
post_post_args.add_argument("posted_at", type=inputs.datetime_from_iso8601, required=True, help="posted_at is required")
post_post_args.add_argument("upvotes", type=int, required=True, help="upvotes is required")
post_post_args.add_argument("downvotes", type=int, required=True, help="downvotes is required")

post_put_args = reqparse.RequestParser()
post_put_args.add_argument("photo_id", type=int, required=False, help="photo_id must be int")
post_put_args.add_argument("desc", type=str, required=False, help="desc must be string")
post_put_args.add_argument("posted_at", type=inputs.datetime_from_iso8601, required=False, help="posted_at must be datetime")
post_put_args.add_argument("upvotes", type=int, required=False, help="upvotes must be int")
post_put_args.add_argument("downvotes", type=int, required=False, help="downvotes must be int")

post_resource_fields = {
    "id": fields.Integer,
    "photo_id": fields.Integer,
    "desc": fields.String,
    "posted_at": fields.DateTime(dt_format='iso8601'),
    "upvotes": fields.Integer,
    "downvotes": fields.Integer
}

class Post(Resource):
    @marshal_with(post_resource_fields)
    def get(self, post_id) -> dict:
        """
        Handles GET requests sent to the api for posts.
        """
        post = PostModel.query.filter_by(id=post_id).first()
        return post, 200
    
    @marshal_with(post_resource_fields)
    def post(self, post_id) -> dict:
        """
        Handles POST requests sent to the api for posts.
        Used to create data on the server.
        """
        args = post_post_args.parse_args()
        
        post = PostModel(
            id=post_id, 
            **args
        )

        db.session.add(post)
        db.session.commit()

        # Return the newly created photo and http code 201 to indicate success.
        return post, 201

    @marshal_with(post_resource_fields)
    def put(self, post_id) -> dict:
        """
        Handles PUT requests sent to the api for posts.
        Used to update data on the server.
        """
        args = post_put_args.parse_args()

        # Get the photo info sent to the api.
        updated_post = PostModel(
            id=post_id, 
            **args
        )
        
        post = PostModel.query.filter_by(id=post_id).one_or_none()

        if post is None:
            abort(404, message=f"Post with id: {post_id} not found")
        else:
            # Update the photo in the database.
            post.photo_id = updated_post.photo_id if updated_post.photo_id != None else post.photo_id
            post.desc = updated_post.desc 
            post.posted_at = updated_post.posted_at if updated_post.posted_at != None else post.posted_at
            post.upvotes = updated_post.upvotes if updated_post.upvotes != None else post.upvotes
            post.downvotes = updated_post.downvotes if updated_post.downvotes != None else post.downvotes
        
            db.session.commit()
            # Return the 204 HTTP Code to indicate that the resource has been updated.
            return '', 204

    def delete(self, post_id):
        """
        Handles DELETE requests sent to the api for posts.
        """
        post = PostModel.query.filter_by(id=post_id).one_or_none()
        if post is None:
            abort(404, message=f"Post with id: {post_id} not found")
        else:
            db.session.delete(post)
            db.session.commit()
            # Return the 204 HTTP Code to indicate that the resource has been deleted.
            return '', 204

api.add_resource(Post, "/api/post/<int:post_id>")
#endregion
#endregion

if __name__ == "__main__":
    app.run(debug=True)
