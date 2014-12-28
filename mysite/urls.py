from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings
from mysite.views import *
from books import views
from contact.views import contact
from uploadimage.views import *
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^itinerary/$', myItinerary),
    url(r'^puzzle1/$', puzzle1),
    url(r'^galleria/country=(\w*)&state=(\w*)&city=(\w*)&parentfileuuid=([a-zA-Z0-9]*)&show=(\d*)/$', galleria),
    url(r'^itinerary/ajax/country=(\w*)&state=(\w*)&city=(\w*)/$',ajax),
    url(r'^dropzone/parentuuid=(\w*)', include('uploadimage.urls', namespace="uploadimage")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^meta/', display_meta),
    url(r'^search/$', views.search),
    url(r'^tree/$', tree),
    url(r'^twocars/$', twocars),
    url(r'^contact/$', contact),
    url(r'^chaining/', include('smart_selects.urls')),

) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


#for heroku to serve static files
urlpatterns += patterns('',
    (r'^static/(?P.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
)

