from shared.db import db

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
    location = db.Column(db.String(50), nullable=True)
    date_taken = db.Column(db.Date, nullable=True)

    def __repr__(self) -> str:
        """
        The __repr__ method is used to print the object.
        """
        return f"<PhotoModel(id={self.id}, url={self.url}, camera={self.camera}, focal_length={self.focal_length}, aperture={self.aperture}, iso={self.iso}, shutter_speed={self.shutter_speed}, location={self.location}, date_taken={self.date_taken})>"

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
            "location": self.location,
            "date_taken": self.date_taken
        }