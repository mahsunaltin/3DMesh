from sklearn.cluster import DBSCAN
import numpy as np

def detect_anomalies(point_cloud_points, eps=1.0, min_samples=2):
    """
    Detect anomalies in a 3D point cloud using DBSCAN clustering.

    Parameters:
    point_cloud_points (list): A list containing 3D points of a frame.
    eps (float): The maximum distance between two samples for one to be considered as in the neighborhood of the other.
    min_samples (int): The number of samples in a neighborhood for a point to be considered as a core point.

    Returns:
    list: A list containing the anomalies detected in the point cloud.
    """
    db = DBSCAN(eps=eps, min_samples=min_samples).fit(np.array(point_cloud_points))
    labels = db.labels_
    anomalies = np.array(point_cloud_points)[labels == -1]
    return anomalies.tolist()  # Convert to list