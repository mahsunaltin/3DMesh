from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from backend.src.utils.calculate_data import calculate_data
from backend.src.utils.synthetic_data_generator import (
    generate_points_data, 
    generate_synthetic_time_series, 
    generate_animated_scaled_sphere_point_cloud, 
    scale_min_func, 
    scale_max_func, 
    generate_custom_scaled_sphere_point_cloud
)

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Scenario 1: Random Scaled Point Generation
class RandomScaledPointsRequest(BaseModel):
    num_points: int                     # Number of points to generate in each frame
    scale: float                        # Scaling factor for the points
    num_frames: Optional[int] = 100     # Number of frames to generate; defaults to 100

    class Config:
        schema_extra = {
            "example": {
                "num_points": 50,
                "scale": 1.5,
                "num_frames": 10
            }
        }

@app.post("/generate_random_scaled_points", summary="Generate Random Scaled Points")
async def generate_random_scaled_points(request: RandomScaledPointsRequest):
    """
    Generates a series of 3D point clouds with random scales.
    
    Each point cloud consists of a specified number of points, scaled by a given factor.
    This endpoint returns a series of point clouds, each generated with the specified scale.
    
    Args:
        request (RandomScaledPointsRequest): The request parameters.
        
        - `num_points`: Number of points to generate in each frame.
        - `scale`: Scaling factor for the points.
        - `num_frames`: Number of frames to generate; defaults to 100.

    Returns:
        JSONResponse: A list of point clouds, each containing a specified number of randomly scaled points.
    """
    frames_data = [generate_points_data(request.num_points, request.scale) for _ in range(request.num_frames)]
    data = [calculate_data(points) for points in frames_data]
    return JSONResponse(content=jsonable_encoder(data))

# Scenario 2: Time Series with Noise and Anomalies
class TimeSeriesNoiseAnomaliesRequest(BaseModel):
    num_frames: int            # Number of frames in the time series
    num_points_per_frame: int  # Number of points in each frame
    noise_level: float = 0.1   # Standard deviation of the random noise
    anomaly_level: float = 0.5 # Ratio of points that are anomalies

    class Config:
        schema_extra = {
            "example": {
                "num_frames": 20,
                "num_points_per_frame": 100,
                "noise_level": 0.1,
                "anomaly_level": 0.2
            }
        }

@app.post("/generate_time_series_noise_anomalies", summary="Generate Time Series with Noise and Anomalies")
async def generate_time_series_noise_anomalies(request: TimeSeriesNoiseAnomaliesRequest):
    """
    Generates a synthetic time series dataset with noise and anomalies.

    Each time frame in the series contains a set of points, with added noise and anomalies,
    simulating a real-world time series dataset with irregularities.
    
    Args:
        request (TimeSeriesNoiseAnomaliesRequest): The request parameters including number of frames, points per frame, noise level, and anomaly level.

        - `num_frames`: Number of frames in the time series.
        - `num_points_per_frame`: Number of points in each frame.
        - `noise_level`: Standard deviation of the random noise.
        - `anomaly_level`: Ratio of points that are anomalies.

    Returns:
        JSONResponse: A list of time series data, each frame containing points with added noise and anomalies.
    """
    frames_data = generate_synthetic_time_series(request.num_frames, request.num_points_per_frame, request.noise_level, request.anomaly_level)
    data = [calculate_data(points) for points in frames_data]
    return JSONResponse(content=jsonable_encoder(data))

# Scenario 3: Animated Scaled Sphere Point Cloud
class AnimatedSphereRequest(BaseModel):
    num_points: int             # Number of points to generate in each frame
    num_frames: int             # Number of frames to generate
    scale_min: float = 0.1      # Minimum scale value for the points
    scale_max: float = 1.0      # Maximum scale value for the points
    num_cycles: int = 1         # Number of cycles for the oscillation

    class Config:
        schema_extra = {
            "example": {
                "num_points": 500,
                "num_frames": 30,
                "scale_min": 0.5,
                "scale_max": 2.0,
                "num_cycles": 5
            }
        }

@app.post("/generate_animated_scaled_sphere", summary="Generate Animated Scaled Sphere Point Cloud")
async def generate_animated_scaled_sphere(request: AnimatedSphereRequest):
    """
    Generates an animated series of scaled 3D sphere point clouds.

    This endpoint creates a sequence of frames, each containing a point cloud of a sphere.
    The scale of the sphere oscillates sinusoidally between the minimum and maximum scale values over the specified number of cycles.
    
    Args:
        request (AnimatedSphereRequest): The request parameters including number of points, frames, scaling range, and number of cycles.

        - `num_points`: Number of points to generate in each frame.
        - `num_frames`: Number of frames to generate.
        - `scale_min`: Minimum scale value for the points.
        - `scale_max`: Maximum scale value for the points.
        - `num_cycles`: Number of cycles for the oscillation.

    Returns:
        JSONResponse: A list of point clouds representing an animated scaled sphere.
    """
    frames_data = generate_animated_scaled_sphere_point_cloud(
        request.num_points, 
        request.num_frames, 
        lambda frame: scale_min_func(frame, request.num_frames, request.num_cycles, request.scale_min, request.scale_max), 
        lambda frame: scale_max_func(frame, request.num_frames, request.num_cycles, request.scale_min, request.scale_max)
    )
    data = [calculate_data(points) for points in frames_data]
    return JSONResponse(content=jsonable_encoder(data))

# Scenario 4: Custom Scaled Hollow Sphere Point Cloud
class CustomScaledHollowSphereRequest(BaseModel):
    num_points: int             # Number of points to generate in each frame
    num_frames: int             # Number of frames to generate
    scale_min: float = 0.1      # Minimum scale value for the points
    scale_max: float = 1.0      # Maximum scale value for the points
    num_cycles: int = 1         # Number of cycles for the oscillation

    class Config:
        schema_extra = {
            "example": {
                "num_points": 300,
                "num_frames": 20,
                "scale_min": 0.2,
                "scale_max": 1.5,
                "num_cycles": 3
            }
        }

@app.post("/generate_custom_scaled_hollow_sphere", summary="Generate Custom Scaled Hollow Sphere Point Cloud")
async def generate_custom_scaled_hollow_sphere(request: CustomScaledHollowSphereRequest):
    """
    Generates a custom series of scaled 3D hollow sphere point clouds.

    This endpoint creates a sequence of frames, each containing a point cloud of a hollow sphere.
    The scale of the hollow sphere is customized for each frame, oscillating sinusoidally between the minimum and maximum scale values over the specified number of cycles.
    
    Args:
        request (CustomScaledHollowSphereRequest): The request parameters including number of points, frames, scaling range, and number of cycles.
    
        - `num_points`: Number of points to generate in each frame.
        - `num_frames`: Number of frames to generate.
        - `scale_min`: Minimum scale value for the points.
        - `scale_max`: Maximum scale value for the points.
        - `num_cycles`: Number of cycles for the oscillation.
    
    Returns:
        JSONResponse: A list of point clouds representing a custom scaled hollow sphere.
    """
    frames_data = generate_custom_scaled_sphere_point_cloud(
        request.num_points, request.num_frames, request.scale_min, request.scale_max, request.num_cycles)
    data = [calculate_data(points) for points in frames_data]
    return JSONResponse(content=jsonable_encoder(data))
