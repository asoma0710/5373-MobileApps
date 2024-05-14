from fastapi.testclient import TestClient
from app import app

# Initialize the test client
client = TestClient(app)

# Define test cases for each API endpoint

def test_docs_redirect():
    # Test the base route that redirects to the documentation
    response = client.get("/")
    assert response.status_code == 307  # Expected redirect status code

def test_list_all_candies():
    # Test the route to list all candies
    response = client.get("/candies")
    assert response.status_code == 200  # Expected success status code
    assert response.json()  # Check if response has JSON content

def test_candies_by_category():
    # Test the route to get candies by category
    response = client.get("/candies/category/chocolate")
    assert response.status_code == 200  # Expected success status code
    assert response.json()  # Check if response has JSON content

def test_get_candy_by_id():
    # Test the route to get candy by ID
    response = client.get("/candies/id/123456")
    assert response.status_code == 200  # Expected success status code
    assert response.json()  # Check if response has JSON content

def test_get_image():
    # Test the route to get an image by its ID
    response = client.get("/image/123456")
    assert response.status_code == 200  # Expected success status code
    assert response.headers["content-type"] == "image/jpeg"  # Check if response has correct content type

def test_register():
    # Test the route to register a new user
    response = client.post("/register", json={"first": "John", "last": "Doe", "email": "john.doe@example.com", "password": "password123"})
    assert response.status_code == 200  # Expected success status code

def test_add_new_candy():
    # Test the route to add a new candy
    new_candy_data = {"id": "123456", "name": "Test Candy", "prod_url": "http://example.com", "img_url": "http://example.com/image.jpg", "price": 1.99, "desc": "Test candy description", "category": "Test", "category_id": 1}
    response = client.post("/candies", json=new_candy_data)
    assert response.status_code == 200  # Expected success status code

def test_update_candy_info():
    # Test the route to update candy information
    updated_candy_data = {"name": "Updated Candy Name", "price": 2.99, "desc": "Updated candy description"}
    response = client.put("/candies/123456", json=updated_candy_data)
    assert response.status_code == 200  # Expected success status code

def test_list_my_candies():
    # Test the route to list candies based on filters
    response = client.get("/candies/search?min_price=1.0&max_price=2.0&name=test&description=test&category=test")
    assert response.status_code == 200  # Expected success status code
    assert response.json()  # Check if response has JSON content
