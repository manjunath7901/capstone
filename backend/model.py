from pydantic import BaseModel, validator
from typing import List,Dict


# Define the model
class UserData(BaseModel):
    name: str
    email: str
    password:str
    dob:str = "None"    

