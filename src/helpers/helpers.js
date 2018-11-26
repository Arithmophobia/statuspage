const azureServices = ['Virtual Machines', 'Cloud Services', 'Functions']
const azureLocations = ['East US', 'East US 2', 'North Europe']
const dataDogServices = ['Alerting Engine', 'Event Pipeline']

export function determineAddress(serviceProvider) {
  switch (serviceProvider) {
    case 'Azure':
      return 'https://azurecomcdn.azureedge.net/en-us/status/feed/'
    case 'DataDog':
      return 'https://status.datadoghq.com/index.json'
    // default should probably return error.. fix later
    default:
      return 'https://status.datadoghq.com/index.json'
  }
}

function parseDataDog(data) {
  var json = JSON.parse(data)
  var filtered = json.components.filter(obj => dataDogServices.includes(obj.name))
  var objects = []
  filtered.forEach(function (component) {
    var status = component.status === 'operational' ? "OK" : "BAD"
    objects.push({
      name: component.name,
      status: status
    })
  })
  return objects
}

function textToXML(text) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(text, "text/xml");
  return xmlDoc
}

// only rss available?
// rss example:
// https://www.reddit.com/r/AZURE/comments/4tnj7x/azure_status_rss_fields/d5kr8gj/
function parseAzure(data) {
  var xml = textToXML(data)
  var items = xml.getElementsByTagName("item")
  var objects = []
  azureServices.forEach(function (service) {
    var locations = []
    azureLocations.forEach(function (location) {
      locations.push({
        name: location,
        status: 'OK'
      })
    })
    objects.push({
      name: service,
      locations: locations
    })
  })

  // below only happens when there are incidents = items
  for (var i = 0; i < items.length; i++) {
    var text = items[i].textContent
    text = text.toLowerCase()
    for (var i2 = 0; i2 < azureServices.length; i2++) {
      var service = azureServices[i2]
      if (text.indexOf(service.toLowerCase()) !== -1) {
        for (var i3 = 0; i3 < azureLocations.length; i3++) {
          var location = azureLocations[i3]
          if (text.indexOf(location.toLowerCase()) !== -1) {
            objects[i2].locations[i3].status = 'BAD'
          }
        }
      }
    }
  }
  return objects
}

export function parseStatus(data, serviceProvider) {
  switch (serviceProvider) {
    case 'Azure':
      return parseAzure(data)
    case 'DataDog':
      return parseDataDog(data)
    // default should probably return error.. fix later  
    default:
      return parseDataDog(data)
  }
}