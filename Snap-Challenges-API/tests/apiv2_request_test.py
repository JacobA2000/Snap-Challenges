#region: IMPORTS
from datetime import datetime
import unittest
import requests
#endregion

#region: TEST DATA
country_endpoint = 'http://127.0.0.1:5000/api/countries'
country_data = {
    "name": "United Kingdom",
    "code": "GB",
    "flag_url": "test"
}
country_id = ''

user_endpoint = 'http://127.0.0.1:5000/api/users'
user_data = {
    "username": "Hypezz12",
    "password": "password",
    "country_id": "",
    "email": "jacoballen785@gmail.com",
    "avatar_url": "test.testags",
    "bio": "test",
    "is_admin": True
}
user_public_id = ''

photo_endpoint = 'http://127.0.0.1:5000/api/photos'
photo_data = {
    "url": "test.testags",
    "camera": "Sony A7IV",
    "focal_length": 400,
    "aperture": 0.95,
    "iso": 400,
    "shutter_speed": "1/200",
    "location": "test",
    "date_taken": datetime(2020,1,1,0,0,0).isoformat("T","seconds"),
}
photo_id = None
#endregion
#endregion

# SOME TEST REQUIRE OTHERS TO COMPLETE AND WILL FAIL IF RAN INDIVIDUALLY
#region: TESTS

class TestSequence1AUTHENTICATION(unittest.TestCase):
    def test_1_login(self):
        global user_public_id
        response = requests.post(user_endpoint, json=user_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        user_public_id = response.json()['public_id']

class TestSequence2POSTRequests(unittest.TestCase):
    def test_1_photo(self):
        global photo_id
        response = requests.post(photo_endpoint, json=photo_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        photo_id = response.json()['id']

    def test_2_country(self):
        global country_id
        response = requests.post(country_endpoint, json=country_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        country_id = response.json()['id']
        user_data['country_id'] = country_id

    def test_3_user(self):
        global user_public_id
        response = requests.post(user_endpoint, json=user_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        user_public_id = response.json()['public_id']

class TestSequence3GETRequests(unittest.TestCase):
    def test_1_photo(self):
        global photo_id
        response = requests.get(f"{photo_endpoint}/{photo_id}")
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")

    def test_2_country(self):
        global country_id
        response = requests.get(f"{country_endpoint}/{country_id}")
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")

    def test_3_user(self):
        global user_public_id

        response = requests.get(f"{user_endpoint}/{user_public_id}")
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")

class TestSequence4PUTRequests(unittest.TestCase):

    def test_1_photo(self):
        global photo_id

        data = {
            "url": "dataupdated"
        }

        response = requests.put(f"{photo_endpoint}/{photo_id}", json=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_2_country(self):
        global country_id

        data = {
            "flag_url": "dataupdated"
        }

        response = requests.put(f"{country_endpoint}/{country_id}", json=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_3_user(self):
        global user_public_id

        data = {
            "username": "Billy1234",
            "bio": "THIS IS BILLY",
        }

        response = requests.put(f"{user_endpoint}/{user_public_id}", json=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 201.")

    
class TestSequence5DELETERequests(unittest.TestCase):
    
    def test_1_user(self):
        global user_public_id

        response = requests.delete(f"{user_endpoint}/{user_public_id}")
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_2_country(self):
        global country_id

        response = requests.delete(f"{country_endpoint}/{country_id}")
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")
    
    def test_3_photo(self):
        global photo_id

        response = requests.delete(f"{photo_endpoint}/{photo_id}")
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")
#endregion

if __name__ == '__main__':
    unittest.main()
