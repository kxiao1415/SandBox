from django.http import HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.shortcuts import render, get_object_or_404
from forms import UploadFileForm, CountryForm, StateForm
from models import UploadFile,Country,State


def home(request):
    country = Country.objects.all()

    if request.method == 'POST':
        form = CountryForm(request.POST)
        if form.is_valid():
            newCountry=form.save()
            return HttpResponseRedirect(reverse('uploadimage:state',args=(newCountry.pk,)))
    else:
        form = CountryForm()

    return render(request, 'index.html', {'form': form, 'country': country})

def state(request, country_id):

    country = get_object_or_404(Country, pk=country_id)
    state = State.objects.filter(country__pk = country_id)

    if request.method == 'POST':
        form = StateForm(request.POST)
        if form.is_valid():
            newState=form.save()
            return HttpResponseRedirect(reverse('uploadimage:upload',args=(country_id,newState.pk,)))

    else:
        form = StateForm({'country':country})

    return render(request, 'state.html', {'form': form,'country_id': country_id, 'state': state})

def upload(request, country_id, state_id):
    country = get_object_or_404(Country, pk=country_id)
    state = get_object_or_404(State, pk=state_id)
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            new_file = form.save()
            #new_file = UploadFile(country = form.instanct.country, state=form.instance.state,file = request.FILES['file'])
            #new_file.save()
            return HttpResponseRedirect(reverse('uploadimage:upload',args=(country_id,state_id,)))
    else:
        form = UploadFileForm()

    return render(request,'upload.html', {'form':form, 'country_id':country_id,'state_id':state_id})

def image(request, country_id, state_id):

    stateImageForm=[]
    image = UploadFile.objects.filter(country_id = country_id, state_id=state_id)

    for i in image:
        stateImageForm.append(UploadFileForm(instance=i))

    if request.method == 'POST':
        postAction = request.POST['action']
        if postAction != 'delete':
            imageToEdit =  get_object_or_404(UploadFile,pk = postAction)
            form = UploadFileForm(request.POST, instance=imageToEdit)
            if form.is_valid():
                form.save()
                return HttpResponseRedirect(reverse('uploadimage:image',args=(country_id, state_id,)))
    else:
        return render(request, 'images.html', {'image': stateImageForm,'country_id': country_id,'state_id':state_id})


def remove(request, country_id, state_id, UploadFile_id):
    UploadFile_id = int(UploadFile_id)
    image = get_object_or_404(UploadFile, pk=UploadFile_id)

    if request.method == 'POST':
        form = UploadFileForm(request.POST, instance=image)
        if form.is_valid():
            image.delete()
            return HttpResponseRedirect(reverse('uploadimage:image', args=(country_id,state_id,)))

    return HttpResponse('haha')





'''
def edit(request, UploadFile_id):
    image = get_object_or_404(UploadFile, pk=UploadFile_id)
    if request.method == 'POST':
        form = UploadFileForm(request.POST, instance=image)
        if form.is_valid():
            form.save()
            return redirect('/image/')
    else:
        form = UploadFileForm(instance=image)
    return render(request, 'edit.html', {'form': form})'''
