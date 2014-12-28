from django.contrib import admin
from uploadimage.models import Country, State, City, UploadFile
from django.http import HttpResponseRedirect, HttpResponse
from django.conf.urls import patterns, include, url
from forms import UploadFileForm, CountryForm, StateForm
from django.shortcuts import render
from django.core.urlresolvers import reverse
import uuid
# Register your models here.

class CountryAdmin(admin.ModelAdmin):
    change_form_template = 'admin/uploadimage/Country/change_form.html'
    readonly_fields = ('uuid',)
    list_display = ('name','lat','lng')

class StateAdmin(admin.ModelAdmin):
    change_form_template = 'admin/uploadimage/State/change_form.html'
    readonly_fields = ('uuid',)
    list_display = ('country','name','lat','lng')

class CityAdmin(admin.ModelAdmin):
    change_form_template = 'admin/uploadimage/City/change_form.html'
    readonly_fields = ('uuid',)
    list_display = ('country','state','name','lat','lng')

class UploadFileAdmin(admin.ModelAdmin):
    change_form_template = 'admin/uploadimage/UploadFile/change_form.html'
    readonly_fields = ('uuid',)
    list_display = ('country','state','city','date','lat','lng','description','thumb','parentfileuuid','isSubPhoto')

    #add r'dropzone/parentuuid = (\w*)'$ as an admin link
    def get_urls(self):
        urls = super(UploadFileAdmin, self).get_urls()
        my_urls = [
            url(r'^dropzone/parentuuid=(\w*)$', self.admin_site.admin_view(self.dropzone))
        ]
        return my_urls + urls

    def dropzone(self,request, parentuuid):
        parentuuid = uuid.UUID(parentuuid).hex
        parentFile = UploadFile.objects.get(uuid = parentuuid)

        if request.method == 'POST':
            form = UploadFileForm(request.POST, request.FILES)
            if form.is_valid():
                new_file = form.save(commit=False)
                #need to default all the fields.  ValuesQuerySetToDict function in view.py cannot take null values
                new_file.parentfileuuid = parentuuid
                new_file.save()
                #calling reverse with the pattern "<namespace>:<app>_<model>_changelist"
                #in this case <namespace> is admin
                return HttpResponseRedirect(reverse('admin:uploadimage_uploadfile_changelist'))
        else:
            form = UploadFileForm(initial={'country': parentFile.country,'state': parentFile.state,'city':parentFile.city})
            form.fields['country'].widget.attrs['disabled'] = 'disabled'
            form.fields['state'].widget.attrs['disabled'] = 'disabled'
            form.fields['city'].widget.attrs['disabled'] = 'disabled'
        return render(request,'upload.html', {'form':form})

admin.site.register(Country,CountryAdmin)
admin.site.register(State, StateAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(UploadFile,UploadFileAdmin)