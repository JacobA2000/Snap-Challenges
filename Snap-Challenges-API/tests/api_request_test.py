#region: IMPORTS
import unittest
import requests
from datetime import datetime
#endregion

#region: TEST DATA
photo_endpoint = 'http://127.0.0.1:5000/api/photo/1'
photo_data = {
    "url": "https://www.test.com/testimg.jpg",
    "camera": "Sony a6000",
    "focal_length": 200,
    "aperture": 2.8,
    "iso": 100,
    "shutter_speed": "1/200"
}

country_endpoint = 'http://127.0.0.1:5000/api/country/1'
country_data = {
    "name": "United Kingdom",
    "code": "GB",
    "flag_url": "test"
}

user_endpoint = 'http://127.0.0.1:5000/api/user/1'
user_data = {
    "username": "Hypezz12",
    'country_id': 1,
    "email": "jacoballen785@gmail.com",
    "avatar_url": "test.testags",
    "bio": "test",
    "is_admin": True
}

challenge_endpoint = 'http://127.0.0.1:5000/api/challenge/1'
challenge_data = {
    "title": "test challenge",
    "description": "test description",
    "start_date": datetime(2020,1,1,0,0,0).isoformat("T","seconds"),
    "end_date": datetime(2020,1,1,0,0,0).isoformat("T","seconds"),
    "times_completed": 1
}

post_endpoint = 'http://127.0.0.1:5000/api/post/1'
post_data = {
    "photo_id": 1,
    "desc": "test description",
    "posted_at": datetime(2020,1,1,0,0,0).isoformat("T","seconds"),
    "upvotes": 0,
    "downvotes": 0
}

badge_endpoint = 'http://127.0.0.1:5000/api/badge/1'
badge_data = {
    "name": "test badge",
    "desc": "test description",
    "icon_url": "asggas"
}
#endregion

# SOME TEST REQUIRE OTHERS TO COMPLETE AND WILL FAIL IF RAN INDIVIDUALLY
#region: TESTS
class TestSequence1POSTRequests(unittest.TestCase):
    def test_1_photo(self):
        response = requests.post(photo_endpoint, json=photo_data)
        self.assertEqual(response.status_code, 201, "Status code should be 201 CREATED.")
        self.assertEqual(response.json(), {"id":1, **photo_data}, "Data should be equal.")
    
    def test_2_country(self):
        response = requests.post(country_endpoint, data=country_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        self.assertEqual(response.json(), {"id":1, **country_data}, "Data should be equal.")

    def test_3_user(self):
        response = requests.post(user_endpoint, data=user_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        self.assertEqual(response.json(), {"id":1, **user_data}, "Data should be equal.")
    
    def test_4_challenge(self):
        response = requests.post(challenge_endpoint, data=challenge_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        self.assertEqual(response.json(), {"id":1, **challenge_data}, "Data should be equal.")

    def test_5_post(self):
        response = requests.post(post_endpoint, data=post_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        self.assertEqual(response.json(), {"id":1, **post_data}, "Data should be equal.")

    def test_6_badge(self):
        response = requests.post(badge_endpoint, data=badge_data)
        self.assertEqual(response.status_code, 201, "URL should respond with code 201.")
        self.assertEqual(response.json(), {"id":1, **badge_data}, "Data should be equal.")

class TestSequence2GETRequests(unittest.TestCase):
    def test_1_photo(self):
        response = requests.get(photo_endpoint)
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")
        self.assertEqual(response.json(), {"id":1, **photo_data}, "Data should be equal.")

    def test_2_country(self):
        response = requests.get(country_endpoint)
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")
        self.assertEqual(response.json(), {"id":1, **country_data}, "Data should be equal.")

    def test_3_user(self):
        response = requests.get(user_endpoint)
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")
        self.assertEqual(response.json(), {"id":1, **user_data}, "Data should be equal.")
    
    def test_4_challenge(self):
        response = requests.get(challenge_endpoint)
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")
        self.assertEqual(response.json(), {"id":1, **challenge_data}, "Data should be equal.")

    def test_5_post(self):
        response = requests.get(post_endpoint)
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")
        self.assertEqual(response.json(), {"id":1, **post_data}, "Data should be equal.")

    def test_6_badge(self):
        response = requests.get(badge_endpoint)
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")
        self.assertEqual(response.json(), {"id":1, **badge_data}, "Data should be equal.")

class TestSequence3PUTRequests(unittest.TestCase):
    def test_1_photo(self):
        data = {
            "aperture": 4.0,
        }

        response = requests.put(photo_endpoint, data=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_2_country(self):
        data = {
            "flag_url": "dataupdated"
        }

        response = requests.put(country_endpoint, data=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_3_user(self):
        data = {
            "username": "Billy1234",
            "bio": "THIS IS BILLY",
        }

        response = requests.put(user_endpoint, data=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 201.")

    def test_4_challenge(self):
        data = {
            "title": "updated title",
            "description": "updated description",
        }

        response = requests.put(challenge_endpoint, data=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_5_post(self):
        data = {
            "desc": "updated description",
        }

        response = requests.put(post_endpoint, data=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")
    
    def test_6_badge(self):
        data = {
            "name": "updated name",
            "desc": "updated description",
            "icon_url": "updated icon url"
        }

        response = requests.put(badge_endpoint, data=data)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")
class TestSequence4DELETERequests(unittest.TestCase):
    
    def test_1_user(self):
        response = requests.delete(user_endpoint)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_2_country(self):
        response = requests.delete(country_endpoint)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_3_challenge(self):
        response = requests.delete(challenge_endpoint)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_4_post(self):
        response = requests.delete(post_endpoint)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_5_photo(self):
        response = requests.delete(photo_endpoint)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_6_badge(self):
        response = requests.delete(badge_endpoint)
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")
#endregion

if __name__ == '__main__':
    unittest.main()
