from api.database.db import engine
import api.database.Models as models

models.Base.metadata.create_all(bind=engine)