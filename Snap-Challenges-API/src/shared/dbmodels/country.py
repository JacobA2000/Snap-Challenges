from shared.db import db

class CountryModel(db.Model):
    """
    The CountryModel class is the model for the database table 'countries'.
    """
    __tablename__ = "countries"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(56), nullable=False)
    code = db.Column(db.String(2), nullable=False) # ISO 3166-2 code

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
        }