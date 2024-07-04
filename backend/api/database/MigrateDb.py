from api.database.db import engine
import api.database.models as models

models.Base.metadata.create_all(bind=engine)