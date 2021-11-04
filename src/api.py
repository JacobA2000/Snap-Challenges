# IMPORTS
from datetime import datetime
from flask import Flask
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
import configparser
from os import path

# CREATING THE FLASK APP
app = Flask(__name__)
# CREATING THE API
api = Api(app)

# READING THE CONFIG FILE
config_parser = configparser.RawConfigParser()   
thisfolder = path.dirname(path.abspath(__file__))
config_file = path.join(thisfolder, 'config.cfg')
config_parser.read(config_file)

# DATABSE HANDLINING
DB_SERVER = config_parser.get("mysql-database", "DB_SERVER")
DB_NAME = config_parser.get("mysql-database", "DB_NAME")
DB_USER = config_parser.get("mysql-database", "DB_USER")
DB_PASSWORD = config_parser.get("mysql-database", "DB_PASSWORD")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_SERVER}/{DB_NAME}"
db = SQLAlchemy(app)

# DATABASE MODELS
class PhotoModel(db.Model):
    __tablename__ = "photos"

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(200), nullable=False)
    camera = db.Column(db.String(50), nullable=True)
    focal_length = db.Column(db.Integer, nullable=True)
    aperture = db.Column(db.Float, nullable=True)
    iso = db.Column(db.Integer, nullable=True)
    shutter_speed = db.Column(db.String(15), nullable=True)
    date_taken = db.Column(db.DateTime, nullable=True)

    def __repr__(self) -> str:
        return f"Photo(url={self.url}, camera={self.camera}, focal_length={self.focal_length}, aperture={self.aperture}, iso={self.iso}, shutter_speed={self.shutter_speed}, date_taken={self.date_taken})"

class PostModel(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    photo_id = db.Column(db.Integer, db.ForeignKey("photos.id"), nullable=False)
    desc = db.Column(db.String(280), nullable=True)
    posted_at = db.Column(db.DateTime, nullable=False)
    upvotes = db.Column(db.Integer, nullable=False)
    downvotes = db.Column(db.Integer, nullable=False)

    def __repr__(self) -> str:
        return f"Post(photo_id={self.photo_id}, desc={self.desc}, posted_at={self.posted_at}, upvotes={self.upvotes}, downvotes={self.downvotes})"


# IF RAN WILL OVERWRITE EXISTING DB 
db.create_all()

# REQPARSE ARGUMENTS
# PHOTO PUT
photo_put_args = reqparse.RequestParser()
photo_put_args.add_argument('url', type=str, required=True, help="url is required")
photo_put_args.add_argument('camera', type=str, help="camera must be type string")
photo_put_args.add_argument('focal_length', type=int, help="focal_length must be type int")
photo_put_args.add_argument('aperture', type=float, help="aperture must be type float")
photo_put_args.add_argument('iso', type=int, help="iso must be type int")
photo_put_args.add_argument('shutter_speed', type=str, help="shutter_speed must be type string")
photo_put_args.add_argument('taken_at', type=datetime, help="taken_at must be type datetime")

# RESOURCE FIELDS FOR PHOTO
photo_resource_fields= {
    "id": fields.Integer,
    "url": fields.String,
    "camera": fields.String,
    "focal_length": fields.Integer,
    "aperture": fields.Float,
    "iso": fields.Integer,
    "shutter_speed": fields.String,
    "date_taken": fields.DateTime
}

class Photo(Resource):
    @marshal_with(photo_resource_fields)
    def get(self, photo_id) -> dict:
        """
        Handles GET requests sent to the api for photos.
        """
        result = PhotoModel.query.filter_by(id=photo_id).first()
        return result
    
    @marshal_with(photo_resource_fields)
    def put(self, photo_id) -> dict:
        """
        Handles PUT requests sent to the api for photos.
        """
        args = photo_put_args.parse_args()

        photo = PhotoModel(
            id=photo_id, 
            url=args['url'], 
            camera=args['camera'], 
            focal_length=args['focal_length'], 
            aperture=args['aperture'], 
            iso=args['iso'], 
            shutter_speed=args['shutter_speed'], 
            date_taken=args['taken_at']
        )

        db.session.add(photo)
        db.session.commit()

        return photo, 201
    
    def delete(self, photo_id) -> str:
        """
        Handles DELETE requests sent to the api for photos.
        """

        #CODE TO HANDLE DELETING A PHOTO RECORD FROM THE DATABASE GOES HERE

        return '', 204
    
api.add_resource(Photo, "/photos/<int:photo_id>")

if __name__ == "__main__":
    app.run(debug=True)
