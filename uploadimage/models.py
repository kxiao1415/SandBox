from django.db import models
from datetime import datetime
from uuidfield import UUIDField
from django.utils.safestring import mark_safe
from django_thumbs.db.models import ImageWithThumbsField
from smart_selects.db_fields import ChainedForeignKey

class Country(models.Model):
    uuid = UUIDField(auto=True)
    name = models.CharField(max_length = 60, unique = True)
    lat = models.DecimalField(max_digits=12,decimal_places=8)
    lng = models.DecimalField(max_digits=12,decimal_places=8)


    def __unicode__(self):
        return self.name

class State(models.Model):
    uuid = UUIDField(auto=True)
    country = models.ForeignKey(Country)
    name = models.CharField (max_length = 60)
    lat = models.DecimalField(max_digits=12,decimal_places=8)
    lng = models.DecimalField(max_digits=12,decimal_places=8)

    class Meta:
        unique_together=(('country','name'),)

    def __unicode__(self):
        return self.name

class City(models.Model):
    uuid = UUIDField(auto=True)
    country = models.ForeignKey(Country)
    #used for smart selects
    #'chained_field' refers to 'country' field in this model,
    #'chained_model_field' refers to the 'country' field of the State model
    state = ChainedForeignKey(
        State,
        chained_field = 'country',
        chained_model_field='country',
        show_all=False,
        auto_choose=True
    )
    name = models.CharField (max_length = 60)
    lat = models.DecimalField(max_digits=12,decimal_places=8)
    lng = models.DecimalField(max_digits=12,decimal_places=8)

    class Meta:
        unique_together=(('country','state','name'),)

    def __unicode__(self):
        return self.name


def UploadHandler(instance, filename):
    ext=filename.split('.')[-1]
    filename = datetime.now().strftime("%m-%d-%yat%H_%M_%S_%f")+"."+ext
    return filename
    #To save the files into different folders on upload
    #return '/'.join(['./photo', instance.country.name, instance.state.name, filename])

class UploadFile(models.Model):
    uuid = UUIDField(auto=True)
    country = models.ForeignKey(Country)
    #see City model for explanation
    state = ChainedForeignKey(
        State,
        chained_field = 'country',
        chained_model_field='country',
        show_all=False,
        auto_choose=True
    )
    #see City model explanation
    city = ChainedForeignKey(
        City,
        chained_field = 'state',
        chained_model_field='state',
        show_all=False,
        auto_choose=True
    )
    file = ImageWithThumbsField(upload_to = UploadHandler, sizes = ((65,41),(115,78)))
    date = models.DateField(auto_now_add=True,blank=True,null=True)
    lat = models.DecimalField(max_digits=14,decimal_places=10,blank=True,null=True, default = -999)
    lng = models.DecimalField(max_digits=14,decimal_places=10,blank=True,null=True, default = -999)
    description = models.TextField(blank=True,null=True)
    parentfileuuid = models.CharField (max_length = 100,blank=True,null=True)

    def thumb (self):
        if self.file:
            return mark_safe('<img src = "%s"/>' %(self.file.url_65x41))
        else:
            return 'No image file found'
    def isSubPhoto(self):
        if self.parentfileuuid == str(self.uuid):
            return mark_safe('<a href="dropzone/parentuuid=%s"><button type="button">add sub photos</button></a>'%(self.uuid))
        else:
            return 'Y'

    def save(self, *args, **kwargs):
        add = not self.uuid
        super(UploadFile, self).save(*args, **kwargs)
        if add and not self.parentfileuuid:
            self.parentfileuuid = str(self.uuid)
            kwargs['force_insert'] = False # create() uses this, which causes error.
            super(UploadFile, self).save(*args, **kwargs)



