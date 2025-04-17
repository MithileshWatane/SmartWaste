from pymongo import MongoClient

MONGO_URI = "mongodb+srv://root:root@cluster0.ik1za.mongodb.net/SmartWaste"  # Replace with your actual MongoDB URL

def get_db():
    client = MongoClient(MONGO_URI)
    db = client["garbage_detection"]  # Database name
    return db
