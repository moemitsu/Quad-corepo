# __init__.py
from .db import Base
from .models import Stakeholder, User, Payments, TimeShareRecords

Models = [Stakeholder, User, Payments, TimeShareRecords]
