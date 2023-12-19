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
def apply_sinusoidal_transformation_with_noise_and_anomalies(base_points, frame, num_frames, scale_min, scale_max, num_waves, noise_level, anomaly_percentage, distortion_coefficient):
    """
    Apply a sinusoidal transformation to a set of 3D points, with added noise and anomalies.
    
    Parameters:
    base_points (np.array): The base set of 3D points.
    frame (int): The current frame number.
    num_frames (int): The total number of frames.
    scale_min (float): The minimum scale value.
    scale_max (float): The maximum scale value.
    num_waves (int): The number of sinusoidal waves.
    noise_level (float): The standard deviation of the noise.
    anomaly_percentage (float): The percentage of points to be anomalies.
    distortion_coefficient (float): The distortion coefficient for anomaly points.
    
    Returns:
    np.array: A numpy array of shape (N, 3) representing the transformed 3D points, where N <= num_points.
    """
    # Compute the base scaling factor with sinusoidal wave
    base_scale = scale_min + (scale_max - scale_min) * (np.sin(frame / num_frames * 2 * np.pi * num_waves) + 1) / 2

    # Add Gaussian noise to the scaling factor
    noisy_scale = base_scale + np.random.normal(0, noise_level, base_points.shape[0])

    # Ensure the noisy scale is within some reasonable limits (optional)
    noisy_scale = np.clip(noisy_scale, scale_min, scale_max)

    # Apply scaling to each point
    transformed_points = base_points * noisy_scale[:, np.newaxis]

    # Determine the number of anomaly points
    num_anomaly_points = int(anomaly_percentage * base_points.shape[0])

    # Select anomaly points randomly
    anomaly_indices = np.random.choice(base_points.shape[0], num_anomaly_points, replace=False)

    # Apply distortion to anomaly points
    for index in anomaly_indices:
        transformed_points[index] *= distortion_coefficient

    return transformed_points



def generate_filled_sphere_point_cloud(num_points, radius=1):
    """
    Generate a filled 3D point cloud of a sphere shape.

    Parameters:
    num_points (int): The number of points to generate in the point cloud.
    radius (float): The radius of the sphere.

    Returns:
    np.array: A numpy array of shape (N, 3) representing the 3D points, where N <= num_points.
    """

    points = []
    while len(points) < num_points:
        # Generate a point inside a cube from -radius to radius
        x, y, z = np.random.uniform(-radius, radius, 3)

        # Check if the point is inside the sphere
        if x**2 + y**2 + z**2 <= radius**2:
            points.append([x, y, z])

    return np.array(points)
###############################################################################################
# Generate a scaled 3D point cloud of a sphere shape filled with points with sinusoidal wave. #  -   END
###############################################################################################

# ************************************************************************************************************** #

###################################################################################
# Generate a scaled 3D point cloud of a hallow sphere shape with sinusoidal wave. #  -   START
###################################################################################
def generate_hallow_sphere_point_cloud(num_points):
    """
    Generate a hallow 3D point cloud of a sphere shape.

    Parameters:
    num_points (int): The number of points to generate in the point cloud.
    
    Returns:
    np.array: A numpy array of shape (num_points, 3) representing the 3D points.
    """
    # Generate spherical coordinates
    phi = np.random.uniform(0, np.pi, num_points)
    theta = np.random.uniform(0, 2*np.pi, num_points)

    # Convert to Cartesian coordinates
    x = np.sin(phi) * np.cos(theta)
    y = np.sin(phi) * np.sin(theta)
    z = np.cos(phi)

    return np.vstack((x, y, z)).T
###################################################################################
# Generate a scaled 3D point cloud of a hallow sphere shape with sinusoidal wave. #  -   END
###################################################################################

