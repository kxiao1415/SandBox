from django import forms

from models import UploadFile, Country, State


class UploadFileForm(forms.ModelForm):

    class Meta:
        model = UploadFile

class CountryForm(forms.ModelForm):

    class Meta:
        model = Country

class StateForm(forms.ModelForm):

    class Meta:
        model = State