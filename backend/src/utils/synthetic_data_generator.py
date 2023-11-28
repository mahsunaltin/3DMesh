import numpy as np

def generate_points_data(num_points, scale):
    return np.random.rand(num_points, 3) * scale
