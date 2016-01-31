from flask import render_template, make_response, request, current_app, jsonify
from app import app
import route
from placerequest import *

@app.route('/')
def index():
	return render_template('index.html', title="PopMap")

@app.route('/_search1', methods=['GET'])
def search1():
	origin = request.args.get('origin', "", type=str)
	destination = request.args.get('destination', "", type=str)

	originGeo = PlaceDetails(origin)
	destinationGeo = PlaceDetails(destination)

	restaurants = FindRestaurants(origin, destination)
	waypoints = route.best_path(restaurants, originGeo, destinationGeo)
	print 'waypoints: ' + str(waypoints)
	directions = NewDir(origin, destination, waypoints)
	print 'directions: ' + str(directions)

	return jsonify(directions)

@app.route('/_search2', methods=['GET'])
def search2():
	origin = request.args.get('origin', "", type=str)
	destination = request.args.get('destination', "", type=str)
	direction = FindRestaurants(origin, destination)

	return jsonify(FindRestaurants(origin, destination).newDirection)
