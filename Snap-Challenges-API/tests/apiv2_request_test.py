#region: IMPORTS
import unittest
import requests
from datetime import datetime
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
    "email": "jacoballen785@gmail.com",
    "avatar_url": "test.testags",
    "bio": "test",
    "is_admin": True
}
user_public_id = ''
#endregion

# SOME TEST REQUIRE OTHERS TO COMPLETE AND WILL FAIL IF RAN INDIVIDUALLY
#region: TESTS
class TestSequence1POSTRequests(unittest.TestCase):
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

class TestSequence2GETRequests(unittest.TestCase):
    def test_2_country(self):
        global country_id
        
        print(f"{country_endpoint}/{country_id}")

        response = requests.get(f"{country_endpoint}/{country_id}")
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")

    def test_3_user(self):
        global user_public_id

        response = requests.get(f"{user_endpoint}/{user_public_id}")
        self.assertEqual(response.status_code, 200, "URL should respond with code 200.")

class TestSequence3PUTRequests(unittest.TestCase):

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

    
class TestSequence4DELETERequests(unittest.TestCase):
    
    def test_1_user(self):
        global user_public_id

        response = requests.delete(f"{user_endpoint}/{user_public_id}")
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

    def test_2_country(self):
        global country_id

        response = requests.delete(f"{country_endpoint}/{country_id}")
        self.assertEqual(response.status_code, 204, "URL should respond with code 204.")

#endregion

if __name__ == '__main__':
    unittest.main()
