import models
from backend.api.database.db import engine

models.Base.metadata.create_all(bind=engine)