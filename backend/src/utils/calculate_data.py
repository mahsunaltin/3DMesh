from scipy.spatial import ConvexHull
from backend.src.features.faces import Faces
from backend.src.features.ads_techniques import detect_anomalies
import numpy as np

def calculate_data(points):
    hull = ConvexHull(points)
    simplices = hull.simplices
    org_triangles = [points[s] for s in simplices]

    f = Faces(org_triangles)
    faces_simplified = f.simplify()

    # Convert NumPy arrays to lists for JSON serialization
    all_points = points.tolist()  # All points
    inner_points = points.tolist()  # All points will be excluded from outermost points
    outermost_points = hull.points[hull.vertices, :].tolist()  # Vertices of the convex hull
    anomaly_points = detect_anomalies(points.tolist())  # Anomalies
    
    # Filter out outermost points from inner points
    inner_points = [p for p in inner_points if p not in outermost_points]

    # Prepare JSON data
    data = {
        "all_points": all_points,
        "inner_points": inner_points,
        "outermost_points": outermost_points,
        "anomaly_points": anomaly_points,
        "faces": [np.array(face).tolist() for face in faces_simplified]
    }
    
    return data