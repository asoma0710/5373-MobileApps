from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient
from bson import ObjectId
import hashlib
import uvicorn
import pymongo.errors


# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['Mobile_App']  # Database name: Mobile_App

user_collection = db['users']
location_collection = db['locations']
image_collection=db['profile_images']
candy_collection = client['candy_store']['candies']  # Database: candy_store, Collection: candies
category_collection=client['candy_store']['categories']





class User(BaseModel):
    first_name: str
    last_name: str
    username: Optional[str] = None
    email: str
    password: str


class ProfileImage(BaseModel):
    image_url: str



class Location(BaseModel):
    username:str
    lon: float
    lat: float

class Candy(BaseModel):
    id: str
    name: str
    prod_url: str
    img_url: str
    price: float
    desc: str
    category: str
    category_id: int

def check_exists(collection, key, value):
    item = collection.find_one({key: value})
    return item is not None

app = FastAPI()

@app.get("/")
async def docs_redirect():
    """Redirect to the documentation page."""
    return RedirectResponse(url="/docs")



@app.get("/users_location", response_model=List[Location])
async def list_users():
    users = []
    for location in location_collection.find():
        users.append(Location(**location))
    return users

@app.get("/categories")
async def get_categories():
    categories = [category['name'] for category in category_collection.find({}, {'_id': 0})]
    return categories


from fastapi import FastAPI, File, UploadFile, HTTPException
import os


IMAGE_FOLDER = "images"  # Path to the folder where images are stored

BASE_URL = "http://24.199.96.243:8000/root/04-A04/candyAPI/images"  # Base URL of your server

@app.get("/profile_images/")
async def get_images():
    try:
        image_urls = []
        # List all files in the images folder
        for filename in os.listdir(IMAGE_FOLDER):
            if os.path.isfile(os.path.join(IMAGE_FOLDER, filename)):
                image_urls.append(BASE_URL + "/" + filename)
        if not image_urls:
            raise HTTPException(status_code=404, detail="No images found")
        return {"image_urls": image_urls}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch images")


@app.get("/print_images/")
async def get_images():
    try:
        images = []
        for filename in os.listdir(IMAGE_FOLDER):
            if os.path.isfile(os.path.join(IMAGE_FOLDER, filename)):
                image_path = os.path.join(IMAGE_FOLDER, filename)
                with open(image_path, "rb") as file:
                    image_data = file.read()
                images.append({"name": filename, "data": image_data})
        if not images:
            raise HTTPException(status_code=404, detail="No images found")

        # Create a response with the list of images
        content = b''.join(image["data"] for image in images)
        response = Response(content)
        response.headers["Content-Type"] = "jpeg"  # Set the appropriate content type

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch images")


@app.post("/profile_images/")
async def upload_image(image: UploadFile = File(...)):
    try:
        # Save the uploaded image to the images folder
        image_path = os.path.join(IMAGE_FOLDER, image.filename)
        with open(image_path, "wb") as buffer:
            buffer.write(await image.read())
        return {"message": "Image uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to upload image")



@app.get("/location")
async def get_location_by_firstname(search_param: str):
    """Get location data for a user by first name."""
    try:
        query = {"username": search_param}
        location = location_collection.find_one(query)
        if location:
            # Convert ObjectId to string
            location['_id'] = str(location['_id'])
            return location
        else:
            raise HTTPException(status_code=404, detail="User location not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from bson import ObjectId  # Import ObjectId from bson module

@app.get("/Users/{username}")
async def get_user_details(username: str):
    user = user_collection.find_one({"username": username})
    if user:
        # Convert ObjectId to string for serialization
        user['_id'] = str(user['_id'])
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")


@app.post("/register_location", tags=["Location"])
def post_user_location(location: Location):
    """Register a new user."""
    user_data = location.dict()
    user_id = location_collection.insert_one(user_data).inserted_id
    return {"user_id": str(user_id)}

@app.post("/register", tags=["User"])
def post_user(user: User):
    """Register a new user."""
    user_data = user.dict()
    user_data['password'] = hashlib.sha256(user.password.encode()).hexdigest()
    user_id = user_collection.insert_one(user_data).inserted_id
    return {"user_id": str(user_id)}

@app.post("/login", tags=["User"])
def post_login(login: User):
    """Login a user."""
    login_data = login.dict()
    password_hash = hashlib.sha256(login.password.encode()).hexdigest()
    user = user_collection.find_one({"username": login_data["username"], "password": password_hash})
    if user:
        return {"success": True}
    return {"success": False}




@app.get("/candies", response_model=List[Candy])
def list_my_candies(
    min_price: Optional[float] = Query(None, description="Minimum price of the candy"),
    max_price: Optional[float] = Query(None, description="Maximum price of the candy"),
    category: Optional[str] = Query(None, description="Category of the candy"),
    name: Optional[str] = Query(None, description="Name of the candy"),
    description: Optional[str] = Query(None, description="Description of the candy")
):
    """Retrieve a list of candies based on price, category, name, and description."""
    query = {}

    # Apply filters if provided
    if min_price is not None and max_price is not None:
        query['price'] = {"$gte": min_price, "$lte": max_price}
    elif min_price is not None:
        query['price'] = {"$gte": min_price}
    elif max_price is not None:
        query['price'] = {"$lte": max_price}
    
    if category:
        query['category'] = {"$regex": category, "$options": "i"}  # Case-insensitive regex match
    
    if name:
        query['name'] = {"$regex": name, "$options": "i"}  # Case-insensitive regex match
    
    if description:
        description_words = description.split()
        # Construct a regex pattern to match at least one word from the description
        description_regex = "|".join(description_words)
        query['desc'] = {"$regex": description_regex, "$options": "i"}  # Case-insensitive regex match

    try:
        results = candy_collection.find(query)
        candies = [Candy(**candy_data) for candy_data in results]
        return candies
    except pymongo.errors.PyMongoError as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")





if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="24.199.96.243",
        port=8000,
        reload=True,
    )

