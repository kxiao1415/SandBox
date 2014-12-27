from django.shortcuts import render
from django.http import HttpResponse
import datetime
from django.shortcuts import render_to_response
from django.core import serializers
from uploadimage.models import UploadFile, Country, State,City
import json

def ValuesQuerySetToDict(vqs):
    data = []
    for i in vqs:
        if i.lat and i.lng:
            data += [{'parentfileuuid':str(i.parentfileuuid),'lat':float(i.lat),'lng':float(i.lng),'description':str(i.description),'file':str(i.file.url_115x78)}]
        else:
            data += [{'parentfileuuid':str(i.parentfileuuid),'lat':-999,'lng':-999,'description':str(i.description),'file':str(i.file.url_115x78)}]
    return data

def home(request):
    return render(request,'index.html')


def myItinerary(request):

    dataCountries = []
    dataStates = []
    dataCities = []

    countries = Country.objects.all()
    for i in countries:
        dataCountries +=[{'country':i.name,'lat':float(i.lat),'lng':float(i.lng)}]
    jsonCountries = json.dumps(dataCountries)

    states = State.objects.all()
    for i in states:
        dataStates +=[{'country':i.country.name,'state':i.name,'lat':float(i.lat),'lng':float(i.lng)}]
    jsonStates = json.dumps(dataStates)

    cities = City.objects.all()
    for i in cities :
        dataCities +=[{'country':i.country.name,'state':i.state.name,'city':i.name, 'lat':float(i.lat),'lng':float(i.lng)}]
    jsonCities = json.dumps(dataCities)

    treeData = {'name':'COUNTRIES','entity':'root','children':[{'name':i['country'],'lat':i['lat'],'lng':i['lng'],'entity':'country'}for i in dataCountries]}

    for i in treeData['children']:
        stateList =[]
        for j in dataStates:
            if j['country'] == i['name']:
                stateList +=[{'name':j['state'],'lat':j['lat'],'lng':j['lng'],'entity':'state'}]
        if stateList:
            i['children'] = stateList

    for i in treeData['children']:
        if 'children' in i:
            for j in i['children']:
                cityList=[]
                for k in dataCities:
                    if k['country'] == i['name'] and k['state'] == j['name']:
                        cityList +=[{'name':k['city'],'lat':k['lat'],'lng':k['lng'],'entity':'city'}]
                if cityList:
                    j['children'] = cityList
    jsonTree = json.dumps(treeData)

    return render(request, 'myItinerary.html', {'countries':jsonCountries,'states':jsonStates, 'cities': jsonCities, 'treeData':jsonTree})

def puzzle1(request):
    return render(request, 'puzzle1.html')

def galleria(request, countryName, stateName, cityName,parentfileuuid,show):
    country = Country.objects.filter(name=countryName)
    cityPhotos = UploadFile.objects.filter(country = country)

    if stateName:
        state = State.objects.filter(name=stateName)
        cityPhotos = cityPhotos.filter(state = state)
    if cityName:
        city = City.objects.filter(name=cityName)
        cityPhotos = cityPhotos.filter(city = city)
    if parentfileuuid:
        cityPhotos = cityPhotos.filter(parentfileuuid = parentfileuuid)

    return render(request, 'galleria.html',{'photos':cityPhotos,'show':show})

def ajax(request,countryName,stateName,cityName):
    country = Country.objects.filter(name=countryName)
    allPhotos = UploadFile.objects.filter(country = country)

    if stateName:
        state = State.objects.filter(name=stateName)
        allPhotos = allPhotos.filter(state = state)
    if cityName:
        city = City.objects.filter(name=cityName)
        allPhotos = allPhotos.filter(city = city)

    data_dict = ValuesQuerySetToDict(allPhotos)

    return HttpResponse(json.dumps(data_dict), content_type="application/json")

def twocars(request):
    return render(request, 'twocars.html')

def display_meta(request):
    values = request.META.items()
    values.sort()
    html = []
    for k, v in values:
        html.append('<tr><td>%s</td><td>%s</td></tr>' % (k, v))
    return HttpResponse('<table>%s</table>' % '\n'.join(html))

def tree(request):
    treeData={
    "name": "flare",
    "children": [{
        "name": "analytics",
        "children": [{
            "name": "cluster",
            "children": [{
                "name": "AgglomerativeCluster",
                "size": 3938
            }, {
                "name": "CommunityStructure",
                "size": 3812
            }, {
                "name": "HierarchicalCluster",
                "size": 6714
            }, {
                "name": "MergeEdge",
                "size": 743
            }]
        }, {
            "name": "graph",
            "children": [{
                "name": "BetweennessCentrality",
                "size": 3534
            }, {
                "name": "LinkDistance",
                "size": 5731
            }, {
                "name": "MaxFlowMinCut",
                "size": 7840
            }, {
                "name": "ShortestPaths",
                "size": 5914
            }, {
                "name": "SpanningTree",
                "size": 3416
            }]
        }, {
            "name": "optimization",
            "children": [{
                "name": "AspectRatioBanker",
                "size": 7074
            }]
        }]
    }]}
    data=json.dumps(treeData)
    return render(request, 'tree.html',{'data': data})

