import unittest
import requests
from datetime import datetime
from order_tests import load_ordered_tests

# This orders the tests to be run in the order they were declared.
# It uses the unittest load_tests protocol.
load_tests = load_ordered_tests

class TestPhotoApi(unittest.TestCase):
    url = 'http://127.0.0.1:5000/photos/1'

    def test_put_photo(self):
        data = {
            "url": "https://www.test.com/testimg.jpg",
            'camera': "sony",
            "focal_length": 200,
            "aperture": 2.8,
            "iso": 100,
            "shutter_speed": "1/200"
        }

        response = requests.put(self.url, data=data)

        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")

    def test_get_photo(self):
        response = requests.get(self.url)
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")

    def test_delete_photo(self):
        response = requests.delete(self.url)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

class TestUserApi(unittest.TestCase):
    url = 'http://127.0.0.1:5000/users/1'

    # A country must exist with the id of 1 for the test to pass. This is because it is a foreign key.
    def test_put_user(self):
        data = {
            "username": "Hypezz12",
            'country_id': 1,
            "email": "jacoballen785@gmail.com",
            "avatar_url": "test.testags",
            "bio": "MEME",
            "is_admin": True
        }

        response = requests.put(self.url, data=data)

        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")

    def test_get_user(self):
        response = requests.get(self.url)
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")

    def test_delete_user(self):
        response = requests.delete(self.url)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

if __name__ == '__main__':
    unittest.main()
