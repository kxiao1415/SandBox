from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
	url(r'^$', 'uploadimage.views.home', name='home'),
    url(r'^(?P<country_id>\d+)/$', 'uploadimage.views.state', name='state'),
    url(r'^(?P<country_id>\d+)/(?P<state_id>\d+)/$', 'uploadimage.views.upload', name='upload'),

    #url(r'^(?P<country_id>\d+)/(?P<state_id>\d+)/remove/(?P<UploadFile_id>\d+)/$', 'uploadimage.views.remove', name='remove'),
    url(r'^(?P<country_id>\d+)/(?P<state_id>\d+)/image/$', 'uploadimage.views.image', name='image'),
)