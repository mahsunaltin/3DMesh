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
    blue_points = points.tolist()  # All points
    red_points = hull.points[hull.vertices, :].tolist()  # Vertices of the convex hull

    # Filter out red points from blue points
    blue_points = [p for p in blue_points if p not in red_points]

    # Prepare JSON data
    data = {
        "blue_points": blue_points,
        "red_points": red_points,
        "faces": [np.array(face).tolist() for face in faces_simplified]
    }
    return data