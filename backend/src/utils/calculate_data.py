from scipy.spatial import ConvexHull
from backend.src.features.faces import Faces
import numpy as np

def calculate_data(points):
    hull = ConvexHull(points)
    simplices = hull.simplices
    org_triangles = [points[s] for s in simplices]

    f = Faces(org_triangles)
    faces_simplified = f.simplify()

    # Convert NumPy arrays to lists for JSON serialization
    inner_points = points.tolist()  # All points
    outermost_points = hull.points[hull.vertices, :].tolist()  # Vertices of the convex hull

    # Filter out outermost points from inner points
    inner_points = [p for p in inner_points if p not in outermost_points]

    # Prepare JSON data
    data = {
        "inner_points": inner_points,
        "outermost_points": outermost_points,
        "faces": [np.array(face).tolist() for face in faces_simplified]
    }
    return data