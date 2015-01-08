"""
Django settings for mysite project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
TEMPLATE_DIRS = (os.path.join(BASE_DIR, 'templates').replace('\\','/'), )


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'pe5xb1qu46$wmu#++%zxh6ur582gtj-xxboaur64hja^0s+xmj'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'books',
    'uploadimage',
    'smart_selects',
    'admin_reorder',
    'storages',
)


MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'admin_reorder.middleware.ModelAdminReorder',
)

ADMIN_REORDER = (
    # Keep original label and models
    'sites',

    # Rename app
    {'app': 'auth', 'label': 'Authorisation'},

    # Reorder app models
    {'app': 'uploadimage', 'models': ('uploadimage.Country', 'uploadimage.State','uploadimage.City','uploadimage.UploadFile')},

    # Exclude models
    #{'app': 'auth', 'models': ('auth.User', )},

    # Cross-linked models
    #{'app': 'auth', 'models': ('auth.User', 'sites.Site')},

    # models with custom name
    #{'app': 'auth', 'models': (
    #    'auth.Group',
    #    {'model': 'auth.User', 'label': 'Staff'},
    #)},
)

ROOT_URLCONF = 'mysite.urls'

WSGI_APPLICATION = 'mysite.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        'USER':'',
        'PASSWORD':'',
        'HOST':'',
        'PORT':'',
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'EST'

USE_I18N = True

USE_L10N = True

USE_TZ = True


#Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

#MEDIA_ROOT = os.path.join(BASE_DIR, "media").replace('\\','/')
MEDIA_URL = '/media/'

#below is for deployment on heroku

# Parse database configuration from $DATABASE_URL

import dj_database_url
DATABASES['default'] =  dj_database_url.config()

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

# Static asset configuration
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

STATIC_ROOT = 'staticfiles'

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, '..', 'static'),
)


#upload media files to s3
AWS_QUERYSTRING_AUTH = False
AWS_ACCESS_KEY_ID = 'AKIAIP63WIG5BHXFMISQ'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'myitinerary'
MEDIA_URL = 'http://%s.s3.amazonaws.com/' % AWS_STORAGE_BUCKET_NAME
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
