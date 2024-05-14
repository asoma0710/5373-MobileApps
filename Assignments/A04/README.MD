# Candy Store API with FastAPI and MongoDB

### Files

| #   | File                                 | Description                                             |
| :-: | -----------------------------------  | ------------------------------------------------------- |
| 1   | [api.py](./api.py)                   | Candy Store API made with FastAPI.                      |
| 2   | [loadMongo.py](./loadMongo.py)       | Script for loading JSON data into database.             |
| 3   | [mongoManager.py](./mongoManager.py) | Wrapper class for CRUD operations on MongoDB.           |
| 4   | [categoryJson](./categoryJson)       | Contains JSON files with candy information.             |
| 5   | [A04.service](./A04.service)         | Service file to register and manage the API service.    |
| 6   | [candyDB.json](./candyDB.json)       | JSON file containing candy data to populate the database.|
| 7   | [test-A04.py](./test-A04.py)         | Script to test API routes.                              |
| 8   | [myvenv](./myvenv)                   | Virtual environment directory with installed packages.  |
| 9  | [requirements.txt](./requirements.txt) | Lists all the required packages needed for the project. |

---

## Description
I have created various routes to fetch data from mongodb. 

## Setup and Installation
1.source myvenv/bin/activate
2.python3 mongomanager.py
3.python3 loadMongo.py 2
4.mongosh (check for your database and list the populated candies)
5.python3 api.py

## API Endpoints
1.Categories 2.Images based on Candy_Id etc

## Testing
gave test cases for all the routes
