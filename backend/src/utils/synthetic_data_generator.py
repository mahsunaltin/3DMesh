import numpy as np

def generate_points_data(num_points, scale):
    return np.random.rand(num_points, 3) * scale

def generate_synthetic_time_series(num_times, num_points_per_time, amplitude=1, noise_level=0.5):
    """
    Generate a synthetic time series dataset with enhanced periodic patterns.

    :param num_times: Number of different times in the time series.
    :param num_points_per_time: Number of points for each time.
    :param amplitude: Amplitude of the sine wave.
    :param noise_level: Standard deviation of the random noise.
    :return: A list of lists of lists containing the synthetic time series data.
    """
    num_features = 3  # Number of features
    anomaly_ratio = 0  # Ratio of anomalies per time

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
