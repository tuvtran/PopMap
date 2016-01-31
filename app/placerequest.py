import urllib, json
from kmeans import kmean

AUTH_KEY = 'AIzaSyAG0fCOK8Qh9iODUjcK2TexVWVEBcw3MO4'

def FindRestaurants(origin, destination, newDirection=None):
		jsonData = FindDir(origin, destination)
		if (jsonData == "No Walking Path Found"):
			print(jsonData)
			return

		distance = jsonData["routes"][0]["legs"][0]["distance"]["value"]
		decodedPoly = decode(jsonData["routes"][0]["overview_polyline"]["points"])
		midPoint = decodedPoly[(int)(len(decodedPoly)/2)]
		radius = distance*(3/2)
		lat = midPoint[1]
		lng = midPoint[0]

		# run Google Places
		open_restaurants = GoogPlac(lat, lng, radius)
		latlong = []

		for restaurant in open_restaurants["results"]:
			latlong.append(PlaceDetails(restaurant["place_id"]))

		# doing k means clustering
		waypoints_limit = 23
		k = min(int(len(latlong)/3), waypoints_limit)
		centroids, clusters = kmean(latlong, k)
                return centroids

		# centroidString = ""
		# for centroid in centroids:
			# centroidString += str(centroid)+"|"
		# self.newDirection = NewDir(self.origin, self.destination, centroidString)


# find the shortest path between two points
def FindDir(origin, destination):
		MyUrl = ('https://maps.googleapis.com/maps/api/directions/json'
	           '?origin=place_id:%s'
	           '&destination=place_id:%s'
	           '&mode=walking'
	           '&key=%s') % (origin, destination, AUTH_KEY)
		#grabbing the JSON result
	  	response = urllib.urlopen(MyUrl)
	  	jsonRaw = response.read()
	  	jsonData = json.loads(jsonRaw)
	  	status = str((jsonData["status"]))
	  	no_results = "ZERO_RESULTS"
	  	if (status == no_results):
	  		return ("No Walking Path Found")
	  	return jsonData

# decode polyline
def decode(point_str):
    '''Decodes a polyline that has been encoded using Google's algorithm
    http://code.google.com/apis/maps/documentation/polylinealgorithm.html
    This is a generic method that returns a list of (latitude, longitude)
    tuples.
    :param point_str: Encoded polyline string.
    :type point_str: string
    :returns: List of 2-tuples where each tuple is (latitude, longitude)
    :rtype: list
    '''

    # sone coordinate offset is represented by 4 to 5 binary chunks
    coord_chunks = [[]]
    for char in point_str:

        # convert each character to decimal from ascii
        value = ord(char) - 63

        # values that have a chunk following have an extra 1 on the left
        split_after = not (value & 0x20)
        value &= 0x1F

        coord_chunks[-1].append(value)

        if split_after:
                coord_chunks.append([])

    del coord_chunks[-1]

    coords = []

    for coord_chunk in coord_chunks:
        coord = 0

        for i, chunk in enumerate(coord_chunk):
            coord |= chunk << (i * 5)

        #there is a 1 on the right if the coord is negative
        if coord & 0x1:
            coord = ~coord #invert
        coord >>= 1
        coord /= 100000.0

        coords.append(coord)

    # convert the 1 dimensional list to a 2 dimensional list and offsets to
    # actual values
    points = []
    prev_x = 0
    prev_y = 0
    for i in xrange(0, len(coords) - 1, 2):
        if coords[i] == 0 and coords[i + 1] == 0:
            continue

        prev_x += coords[i + 1]
        prev_y += coords[i]
        # a round to 6 digits ensures that the floats are the same as when
        # they were encoded
        points.append((round(prev_x, 6), round(prev_y, 6)))

    return points

# Get all the restaurants currently open within specified radius
def GoogPlac(lat,lng,radius):
	  LOCATION = str(lat) + "," + str(lng)
	  RADIUS = radius
	  MyUrl = ('https://maps.googleapis.com/maps/api/place/nearbysearch/json'
	           '?location=%s'
	           '&radius=%s'
	           '&types=restaurant'
			   '&opennow=true'
	           '&key=%s') % (LOCATION, RADIUS, AUTH_KEY)

	  #grabbing the JSON result
	  response = urllib.urlopen(MyUrl)
	  jsonRaw = response.read()
	  jsonData = json.loads(jsonRaw)
	  return jsonData

# get place details
def PlaceDetails(placeid):
		PLACEID = placeid
		MyUrl = ('https://maps.googleapis.com/maps/api/place/details/json'
				'?placeid=%s'
				'&key=%s') % (PLACEID, AUTH_KEY)
		#grabbing the JSON result
	  	response = urllib.urlopen(MyUrl)
	  	jsonRaw = response.read()
	  	jsonData = json.loads(jsonRaw)
	  	return jsonData["result"]["geometry"]["location"]["lat"], jsonData["result"]["geometry"]["location"]["lng"]

# calculate new directions with waypoints
def NewDir(origin, destination, centroidString):
	MyUrl = ('https://maps.googleapis.com/maps/api/directions/json'
	           '?origin=place_id:%s'
	           '&destination=place_id:%s'
	           '&mode=walking'
	           '&waypoints=optimize:true|%s'
	           '&key=%s') % (origin, destination, centroidString, AUTH_KEY)
	print MyUrl
	#grabbing the JSON result
  	response = urllib.urlopen(MyUrl)
  	jsonRaw = response.read()
  	jsonData = json.loads(jsonRaw)
  	status = str((jsonData["status"]))
  	no_results = "ZERO_RESULTS"
  	if (status == no_results):
  		return ("No Walking Path Found")
  	return jsonData


# print type(FindRestaurants('ChIJKcBHSE7GxokR8DA8BOQt8w4', 'ChIJjUMwJ1fGxokREkNf5LXR_Ak').newDirection)

# print PlaceDetails('ChIJKcBHSE7GxokR8DA8BOQt8w4')
