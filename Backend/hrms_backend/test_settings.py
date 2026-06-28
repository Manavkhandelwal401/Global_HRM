# test_settings.py
"""Django settings for runtime verification tests.
Overrides the default database to use a local SQLite file to avoid touching production data.
"""
import os
from .settings import *

# Override DATABASES to use SQLite in the workspace directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'test_db.sqlite3'),
    }
}

# Ensure DEBUG is True for testing
DEBUG = True
