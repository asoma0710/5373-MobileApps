# Libraries for FastAPI
from fastapi import FastAPI, Query, Path, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, Response, FileResponse
from mongoManager import MongoManager
from pydantic import BaseModel
from typing import List
import uvicorn
import requests
from typing import List, Optional
from fastapi import Query

# Define the Candy model
class Candy(BaseModel):
    id: str
    name: str
    prod_url: str
    img_url: str
    price: float
    desc: str
    category: str
    category_id: int


# Define the Person model
class Person(BaseModel):
    first: str
    last: str 
    email: str
    password: str 


# Initialize the MongoDB Manager
mm = MongoManager(db='candy_store')
mm.setDb('candy_store')


# Initialize the FastAPI instance
app = FastAPI(
    title="KidsInVans.Fun🤡",
    version="0.0.1",
    description="""🤡
(This description is totally satirical and does not represent the views of any real person alive or deceased. 
And even though the topic is totally macabre, I would love to make anyone who abuses children very much deceased.
However, the shock factor of my stupid candy store keeps you listening to my lectures. If anyone is truly offended
please publicly or privately message me and I will take it down immediately.)🤡

## Description:
Sweet Nostalgia Candies brings you a delightful journey through time with its extensive collection of 
candies. From the vibrant, trendy flavors of today to the cherished, classic treats of yesteryear, 
our store is a haven for candy lovers of all ages (but mostly kids). Step into a world where every shelf and corner 
is adorned with jars and boxes filled with colors and tastes that evoke memories and create new ones. 
Whether you're seeking a rare, retro candy from your childhood or the latest sugary creation, Sweet 
Nostalgia Candies is your destination. Indulge in our handpicked selection and experience a sweet 
escape into the world of confectionery wonders! And don't worry! We will watch your kids!! (😉)

#### Contact Information:

- **Address:** 101 Candy Lane, Alcatraz Federal Penitentiary, San Francisco, CA 94123.
- **Phone:** (123) 968-7378 [or (123 you-perv)]
- **Email:** perv@kidsinvans.com
- **Website:** www.kidsinvans.fun""",
    terms_of_service="http://www.kidsinvans.fun/worldleterms/",
    contact={
        "name": "KidsInVans.Fun",
        "url": "http://www.kidsinvans.fun/worldle/contact/",
        "email": "perv@www.kidsinvans.fun",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)


# Base route to redirect to docs
@app.get("/")
async def docs_redirect():
    """API's base route that redirects to the documentation."""
    return RedirectResponse(url="/docs")


# Route to list all candies
@app.get("/candies")
def list_all_candies():
    """Retrieve a list of all candies available in the store."""
    mm.setCollection('candies')
    result = mm.get()
    return result


# Route to get candies by category
@app.get("/candies/category/{category}")
def candies_by_category(category: str):
    """Search for candies based on a query string (e.g., name, category, flavor)."""
    mm.setCollection('candies')
    result = mm.get(
        query={'category': category},
        filter={"_id": 0, "name": 1, "count": 1})
    return result


# Route to get candy by ID
@app.get("/candies/id/{id}")
def get_candy_by_id(id: str):
    """Get detailed information about a specific candy."""
    mm.setCollection('candies')
    result = mm.get(
        query={'id': id})
    return result


@app.get("/image/{image_id}")
async def get_image(image_id: str):
    """Retrieve an image by its ID."""
    mm.setCollection('candies')
    result = mm.get(query={'id': image_id}, filter={"img_url": 1})
    print("url is: ", result)
    try:
        if result.get("success", False) and result.get("data", []):
            img_url = result["data"][0].get("img_url")
            if img_url:
                image_data = requests.get(img_url).content
                headers = {"Content-Type": "image/jpeg"}  # Adjust content-type as per your image type
                return Response(content=image_data, headers=headers)
    except Exception as e:
        print(f"Error fetching image: {e}")
    raise HTTPException(status_code=404, detail="Image not found")

# Route to register a new user
@app.post("/register")
def register(person: Person):
    """Register a new user."""
    mm.setCollection("users")
    # Hash the password before storing it
    person.password = hash_password(person.password)
    mm.post(person.dict())


# Route to add a new candy
@app.post("/candies")
def add_new_candy(candy: Candy):
    """Add a new candy to the store's inventory."""
    mm.setCollection('candies')
    mm.post(candy.dict())

@app.put("/candies/{candy_id}")
def update_candy_info(candy_id: str, candy: Candy):
    """Update information about an existing candy."""

    mm.setCollection('candies')
    # Convert candy data to dictionary
    candy_data = candy.dict()

    # Update candy information in the collection using the put method from MongoManager
    result = mm.put(filter_query={"id": candy_id}, update_data=candy_data)

    # Check if any candy was updated
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Candy not found")

    return {"message": "Candy information updated successfully"}




from fastapi import Query
from typing import List, Optional

from fastapi import Query
from typing import List, Optional

@app.get("/candies/search", response_model=List[Candy])
def list_my_candies(
    min_price: Optional[float] = Query(None, description="Minimum price of the candy"),
    max_price: Optional[float] = Query(None, description="Maximum price of the candy"),
    name: Optional[str] = Query(None, description="Name of the candy"),
    description: Optional[str] = Query(None, description="Description of the candy"),
    category: Optional[str] = Query(None, description="Category of the candy")
):
    """Retrieve a list of candies based on price, name, description, and category."""
    mm.setCollection('candies')
    query = {}

    # Apply filters if provided
    if min_price is not None and max_price is not None:
        query['price'] = {"$gte": min_price, "$lte": max_price}
    elif min_price is not None:
        query['price'] = {"$gte": min_price}
    elif max_price is not None:
        query['price'] = {"$lte": max_price}

    if name:
        query['name'] = {"$regex": name, "$options": "i"}  # Case-insensitive regex match

    if description:
        description_words = description.split()
        # Construct a regex pattern to match at least one word from the description
        description_regex = "|".join(description_words)
        query['desc'] = {"$regex": description_regex, "$options": "i"}  # Case-insensitive regex match

    if category:
        query['category'] = {"$regex": category, "$options": "i"}  # Case-insensitive regex match

    try:
        results = mm.collection.find(query)
        candies = [Candy(**candy_data) for candy_data in results]
        return candies
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")





# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="24.199.96.243",  # Use 0.0.0.0 to bind to all network interfaces
        port=8084,  # Standard HTTPS port
        log_level="debug",
        reload=True
    )
