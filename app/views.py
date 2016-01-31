from flask import render_template, make_response, request, current_app, jsonify
from app import app
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

	return jsonify(origin=origin, destination=destination)

@app.route('/_search2', methods=['GET'])
def search2():
	origin = request.args.get('origin', "", type=str)
	destination = request.args.get('destination', "", type=str)
	direction = FindRestaurants(origin, destination)

	return jsonify(FindRestaurants(origin, destination).newDirection)
