import os
import operator
import numpy as np
import math

# kmeans clustering algorithm
# data = set of data points
# k = number of clusters
# c = initial list of centroids (if provided)

MAX_ITERATIONS = 1000

def kmean(data, k):
    centroids = []

    centroids = randomize_centroids(data, centroids, k) 

    old_centroids = [[] for i in range(k)] 

    clusters = [[] for i in range(k)]
    iterations = 0
    
    while not (has_converged(centroids, old_centroids, iterations)):
        iterations += 1

        # assign data points to clusters
        clusters = euclidean_dist(data, centroids, clusters)

        # recalculate centroids
        index = 0
        for cluster in clusters:
            old_centroids[index] = centroids[index]
            centroids[index] = np.mean(cluster, axis=0).tolist()
            index += 1


    # print("The total number of data instances is: " + str(len(data)))
    # print("The total number of iterations necessary is: " + str(iterations))
    # print("The means of each cluster are: " + str(centroids))
    # print("The clusters are as follows:")
    # for cluster in clusters:
    #    print("Cluster with a size of " + str(len(cluster)) + " starts here:")
    #    print(np.array(cluster).tolist())
    #    print("Cluster ends here.")

    return (centroids, clusters)

    

# Calculates euclidean distance between
# a data point and all the available cluster
# centroids.      
def euclidean_dist(data, centroids, clusters):
    for instance in data:  
        minDistance = float("inf")
        index = 0
        for centroid in centroids:
            distance = math.sqrt((centroid[0]-instance[0])*(centroid[0]-instance[0]) + (centroid[1]-instance[1])*(centroid[1]-instance[1]))
            if (distance < minDistance): 
                minDistance = distance
                cenindex = index
            index += 1
        clusters[cenindex].append(instance)


    # If any cluster is empty then assign one point
    # from data set randomly so as to not have empty
    # clusters and 0 means.        
    for cluster in clusters:
        if not cluster:
            cluster.append(data[np.random.randint(0, len(data), size=1)])

    return clusters


# randomize initial centroids
def randomize_centroids(data, centroids, k):
    for cluster in range(0, k):
    	random_number = np.random.randint(0, len(data), size=1)
        centroids.append(data[random_number])
    return centroids

# check if clusters have converged    
def has_converged(centroids, old_centroids, iterations):
    
    if iterations > MAX_ITERATIONS:
        return True
    return old_centroids == centroids


# newarray = [(41.05697139999999, -85.2262476), (41.1332568, -85.13837439999999), (40.8402191, -84.9384738), (41.1400838, -85.163483), (41.1563116, -85.162003), (41.0723728, -85.1931535), (41.1028765, -85.1635915), (41.06759469999999, -85.15279079999999), (41.1156857, -85.1263666), (41.096711, -85.133332), (41.0545999, -85.224715), (41.0718276, -85.1934083), (41.0830943, -85.1366568), (41.1266086, -85.15521129999999), (41.131909, -85.161056), (40.9622519, -85.3736651), (41.1000921, -85.0582149), (41.1317586, -85.15599379999999), (41.116586, -85.1378189), (41.0433605, -85.23864010000001)]
# kmean(newarray, 5)
