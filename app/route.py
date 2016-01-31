from collections import namedtuple
from geopy import Point, distance

API_KEY = 'AIzaSyCeo86HIGUtpWaPOpOA6pbNQhHDe3-26ko'
MAX_STEPS = 5

FROM = (40.728833, -74.000852)
TO = (40.735012, -73.979333)
MOCKED_WAYPOINTS = [((40.72223320000001, -73.9874291), 4),
                    ((40.7324849, -74.00259299999999), 7),
                    ((40.7356354, -74.006691), 9),
                    ((40.742975, -73.98927599999999), 3),
                    ((40.73139849999999, -74.0024617), 4),
                    ((40.73686, -73.991384), 2),
                    ((40.7290258, -73.98712069999999), 6),
                    ((40.7327507, -74.0029358), 5)]


class Waypoint(namedtuple('Waypoint', 'pt area')):
    def closest(self, graph):
        valid_nodes = self.closer_nodes(graph)
        best_dist = None
        best = None
        for other in valid_nodes:
            dist = distance.distance(self.pt, other.pt).meters
            if not best_dist or dist < best_dist:
                best_dist = dist
                best = other
        return best

    def closer_nodes(self, graph):
        lats = sorted([self.area[0].latitude, self.area[1].latitude])
        lngs = sorted([self.area[0].longitude, self.area[1].longitude])

        def within(pt):
            return ((lats[0]-0.01 <= pt.latitude <= lats[1]+0.01) and
                    (lngs[0]-0.01 <= pt.longitude <= lngs[1]+0.01))

        nodes = [node for node in graph if within(node.pt)]
        return nodes


def best_path(nodes, origin, dest):
    # import pdb; pdb.set_trace()
    # I'll convert my own damn parameters.
    nodes = [Point(lat, lng) for lat, lng in nodes]
    origin = Point(origin)
    dest = Point(dest)

    waypoints = [Waypoint(origin, (origin, dest))]
    waypoints += [Waypoint(node, (origin, dest)) for node in nodes]
    to = Waypoint(dest, (origin, dest))
    waypoints.append(to)

    start, remaining = waypoints[0], waypoints[1:]
    path = []
    for i in range(MAX_STEPS):
        closer = start.closest(remaining)
        if closer is None:
            break
        path.append(closer)
        remaining = [pt for pt in remaining if pt != closer]
        start = closer

    # check to see if destination is in path
    if to in path:
        path.remove(to)
    return '|'.join(["via:{},{}".format(pt.pt.latitude, pt.pt.longitude) for pt in path])


def main():
    lat_longs = [Point(pt[0]) for pt in MOCKED_WAYPOINTS]
    path = best_path(lat_longs, Point(FROM), Point(TO))
    print(path)

if __name__ == '__main__':
    main()
