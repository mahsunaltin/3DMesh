import numpy as np

######################################################################
# Generate a synthetic time series dataset with scale input.         #   -   START
######################################################################
def generate_points_data(num_points, scale):
    return np.random.rand(num_points, 3) * scale
######################################################################
# Generate a synthetic time series dataset with scale input.         #   -   END
######################################################################

# ************************************************************************************************************** #

######################################################################
# Generate a synthetic time series dataset with noise and anomalies. #   -   START
######################################################################
def generate_synthetic_time_series(num_times, num_points_per_time, noise_level=0.5, anomaly_ratio=0.1):
    """
    Generate a synthetic time series dataset with enhanced periodic patterns.

    :param num_times: Number of different times in the time series.
    :param num_points_per_time: Number of points for each time.
    :param noise_level: Standard deviation of the random noise.
    :param anomaly_ratio: Ratio of points that are anomalies.
    :return: A list of lists of lists containing the synthetic time series data.
    """
    num_features = 3  # Number of features
    amplitude = 1  # Amplitude of the sine waves
    all_times_data = []

    for t in range(num_times):
        baseline = np.zeros((num_points_per_time, num_features))

        for i in range(num_features):
            baseline[:, i] = amplitude * np.sin(np.linspace(0, 10, num_points_per_time) + np.pi / num_features * i)

        # Add noise
        baseline += np.random.randn(num_points_per_time, num_features) * noise_level

        # Introduce anomalies
        num_anomalies = int(num_points_per_time * anomaly_ratio)
        anomaly_indices = np.random.choice(num_points_per_time, num_anomalies, replace=False)
        baseline[anomaly_indices] += np.random.randn(num_anomalies, num_features) * 3

        all_times_data.append(np.array(baseline.tolist()))

    return all_times_data
######################################################################
# Generate a synthetic time series dataset with noise and anomalies. #  -   END
######################################################################

# ************************************************************************************************************** #

###############################################################################################
# Generate a scaled 3D point cloud of a sphere shape filled with points with sinusoidal wave. #  -   START
###############################################################################################
def generate_scaled_sphere_point_cloud(num_points, scale_min, scale_max):
    """
    Generate a scaled 3D point cloud of a sphere shape.

    Parameters:
    num_points (int): The number of points to generate in the point cloud.
    scale_min (float): The minimum scale value for the points.
    scale_max (float): The maximum scale value for the points.

    Returns:
    np.array: A numpy array of shape (num_points, 3) representing the scaled 3D points.
    """

    # Generate spherical coordinates
    phi = np.random.uniform(0, np.pi, num_points)  # azimuthal angle
    theta = np.random.uniform(0, 2*np.pi, num_points)  # polar angle

    # Random scaling for each point
    scale = np.random.uniform(scale_min, scale_max, num_points)

    # Convert to Cartesian coordinates and apply scaling
    x = scale * np.sin(phi) * np.cos(theta)
    y = scale * np.sin(phi) * np.sin(theta)
    z = scale * np.cos(phi)

    return np.vstack((x, y, z)).T

def generate_animated_scaled_sphere_point_cloud(num_points, num_frames, scale_min_func, scale_max_func):
    """
    Generate a series of scaled 3D point clouds of a sphere shape, with scaling varying according to provided functions.

    Parameters:
    num_points (int): The number of points in each point cloud.
    num_frames (int): The number of different point clouds to generate.
    scale_min_func (function): A function to compute the minimum scale value for each frame.
    scale_max_func (function): A function to compute the maximum scale value for each frame.

    Returns:
    List[np.array]: A list of numpy arrays, each representing a scaled 3D point cloud.
    """

    point_clouds = []
    for frame in range(num_frames):
        scale_min = scale_min_func(frame)
        scale_max = scale_max_func(frame)

        # Generate scaled point cloud for the current frame
        scaled_points = generate_scaled_sphere_point_cloud(num_points, scale_min, scale_max)
        point_clouds.append(scaled_points)

    return point_clouds

def scale_min_func(frame, num_frames, num_cycles, scale_min, scale_max):
    """ Oscillates between 0 and 1 over a specified number of cycles. """
    return scale_min + (scale_max - scale_min) * 0.5 * (1 + np.sin(frame / num_frames * num_cycles * 2 * np.pi))

def scale_max_func(frame, num_frames, num_cycles, scale_min, scale_max):
    """ Oscillates between 1.5 and 2 over a specified number of cycles. """
    return scale_max + (scale_max - scale_min) * 0.5 * (1 + np.sin(frame / num_frames * num_cycles * 2 * np.pi))
###############################################################################################
# Generate a scaled 3D point cloud of a sphere shape filled with points with sinusoidal wave. #  -   END
###############################################################################################

# ************************************************************************************************************** #

###################################################################################
# Generate a scaled 3D point cloud of a hallow sphere shape with sinusoidal wave. #  -   START
###################################################################################
def generate_custom_scaled_sphere_point_cloud(num_points, num_frames, scale_min, scale_max, num_cycles):
    """
    Generate a series of scaled 3D point clouds of a sphere shape, with custom scaling range and sinusoidal variation.

    Parameters:
    num_points (int): The number of points in each point cloud.
    num_frames (int): The number of different point clouds to generate.
    scale_min (float): The minimum scale value.
    scale_max (float): The maximum scale value.
    num_cycles (int): The number of sinusoidal cycles over the frames.

    Returns:
    List[np.array]: A list of numpy arrays, each representing a scaled 3D point cloud.
    """
    point_clouds = []
    for frame in range(num_frames):
        current_scale = sinusoidal_scale_func(frame, scale_min, scale_max, num_frames, num_cycles)
        scaled_points = generate_scaled_sphere_point_cloud(num_points, current_scale, current_scale)
        point_clouds.append(scaled_points)

    return point_clouds

def sinusoidal_scale_func(frame, scale_min, scale_max, num_frames, num_cycles):
    """
    Sinusoidal scaling function that oscillates between scale_min and scale_max.
    """
    scale_range = scale_max - scale_min
    return scale_min + (scale_range / 2) * (np.sin(frame / num_frames * num_cycles * 2 * np.pi) + 1)
###################################################################################
# Generate a scaled 3D point cloud of a hallow sphere shape with sinusoidal wave. #  -   END
###################################################################################