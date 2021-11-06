import unittest
import requests
class TestPhotoApi(unittest.TestCase):
    url = 'http://127.0.0.1:5000/api/photos/1'

    post_data = {
        "url": "https://www.test.com/testimg.jpg",
        'camera': "Sony a6000",
        "focal_length": 200,
        "aperture": 2.8,
        "iso": 100,
        "shutter_speed": "1/200"
    }

    data_should_return = {
        "id": 1,
        "url": "https://www.test.com/testimg.jpg",
        "camera": "Sony a6000",
        "focal_length": 200,
        "aperture": 2.8,
        "iso": 100,
        "shutter_speed": "1/200"
    }

    def test_1_post_photo(self):
        response = requests.post(self.url, data=self.post_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        self.assertEqual(response.json(), self.data_should_return, "Data should be equal.")

    def test_2_get_photo(self):
        response = requests.get(self.url)
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")
        self.assertEqual(response.json(), self.data_should_return, "Data should be equal.")


    def test_2_put_photo(self):
        data = {
            "aperture": 4.0,
        }

        response = requests.put(self.url, data=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_4_delete_photo(self):
        response = requests.delete(self.url)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

class TestUserApi(unittest.TestCase):
    url = 'http://127.0.0.1:5000/api/users/1'

    post_data = {
        "username": "Hypezz12",
        'country_id': 1,
        "email": "jacoballen785@gmail.com",
        "avatar_url": "test.testags",
        "bio": "MEME",
        "is_admin": True
    }

    data_should_return = {
        "id": 1,
        "username": "Hypezz12",
        'country_id': 1,
        "email": "jacoballen785@gmail.com",
        "avatar_url": "test.testags",
        "bio": "MEME",
        "is_admin": True
    }

    # A country must exist with the id of 1 for the test to pass. This is because it is a foreign key.
    def test_1_post_user(self):
        response = requests.post(self.url, data=self.post_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        self.assertEqual(response.json(), self.data_should_return, "Data should be equal.")

    def test_2_get_user(self):
        response = requests.get(self.url)
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")
        self.assertEqual(response.json(), self.data_should_return, "Data should be equal.")

    def test_3_put_user(self):
        data = {
            "username": "Billy1234",
            "bio": "THIS IS BILLY",
        }

        response = requests.put(self.url, data=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 201.")

    def test_4_delete_user(self):
        response = requests.delete(self.url)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

if __name__ == '__main__':
    unittest.main()
