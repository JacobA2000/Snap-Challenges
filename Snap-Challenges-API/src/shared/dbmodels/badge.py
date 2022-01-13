from shared.db import db

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
