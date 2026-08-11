import os
import sys
from fastapi import FastAPI, HTTPException
from sentry_sdk.envelope import Item

# Create an instance of the class for FastAPI
app = FastAPI()

items = []

# Now define a basic route
@app.get("/") # This is the default "home" route (I think)
def read_root():
    return{"Message": "Hello World"}

@app.post("/items")
def create_item(item: str):
    items.append(item)
    return items

@app.get("/items/{item_id}")
def read_item(item_id: int) -> str:
    try:
        item = items[item_id]
        return item
    except IndexError:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")