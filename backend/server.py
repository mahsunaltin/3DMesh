from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import torch
import shutil
import uuid
import os
import json
import numpy as np

from backend.src.utils.calculate_data import calculate_data
from backend.src.utils.synthetic_data_generator import (
    generate_points_data, 
    generate_synthetic_time_series, 
    apply_sinusoidal_transformation_with_noise_and_anomalies,
    generate_hallow_sphere_point_cloud,
    generate_filled_sphere_point_cloud
)
from backend.src.utils.data_generator_from_video import (
    load_model,
    video_to_point_clouds
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
    ready_data: str                     # The ready data to be processed
    start_index: Optional[int] = 0      # Index of the first frame to generate; defaults to 0
    end_index: Optional[int] = 100      # Index of the last frame to generate; defaults to 100

    class Config:
        schema_extra = {
            "example": {
                "ready_data": "SMD_pca",
                "scale": 0,
                "num_frames": 100
            }
        }

@app.post("/generate_ready_dataset_points", summary="Generate Ready Dataset Points")
async def generate_ready_dataset_points(request: RandomScaledPointsRequest):
    """
    Generates a list of point clouds from a ready dataset.
        
    Args:
        request (RandomScaledPointsRequest): The request parameters.
        
        - `ready_data`: The ready data to be processed.
        - `start_index`: Index of the first frame to generate; defaults to 0.
        - `end_index`: Index of the last frame to generate; defaults to 100.

    Returns:
        JSONResponse: A list of point clouds.
    """
    
    if request.ready_data == "serverMachineDatasetPca":
        dataset_folder_name = "serverMachineDataset"
        dataset_name = "SMD_pca"
        anomaly_dataset_name = "SMD_anomaly_pca"
    elif request.ready_data == "serverMachineDatasetUmap":
        dataset_folder_name = "serverMachineDataset"
        dataset_name = "SMD_umap"
        anomaly_dataset_name = "SMD_anomaly_umap"
    elif request.ready_data == "serverMachineDatasetTsne":
        dataset_folder_name = "serverMachineDataset"
        dataset_name = "SMD_tsne"
        anomaly_dataset_name = "SMD_anomaly_tsne"
    elif request.ready_data == "serverMachineDatasetAutoencoder":
        dataset_folder_name = "serverMachineDataset"
        dataset_name = "SMD_autoencoder"
        anomaly_dataset_name = "SMD_anomaly_autoencoder"
    
    # Read the JSON file
    with open('./backend/data/' + dataset_folder_name + '/' + dataset_name + '.json', 'r') as file:
        pca_list = json.load(file)
        
    with open('./backend/data/' + dataset_folder_name + '/' + anomaly_dataset_name + '.json', 'r') as file:
        anomaly_points_list = json.load(file)

    # Convert each sublist into a NumPy array
    frames_data = [np.array(sublist) for sublist in pca_list[request.start_index:request.end_index]]
        
    data = [calculate_data(points) for points in frames_data]
    
    # Iterate through enumarated data to add anomaly points
    for index, frame in enumerate(data):
        selected_anomaly_points_list = anomaly_points_list[request.start_index:request.end_index]
        frame["anomaly_points"] = selected_anomaly_points_list[index]["anomaly_points"]
        
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
    noise_level: float = 0.1    # Standard deviation of the random noise
    anomaly_percentage: float = 0.1 # Percentage of points that are anomalies
    distortion_coefficient: float = 0.5 # Distortion coefficient for anomaly points

    class Config:
        schema_extra = {
            "example": {
                "num_points": 500,
                "num_frames": 30,
                "scale_min": 0.5,
                "scale_max": 2.0,
                "num_cycles": 5,
                "noise_level": 0.1,
                "anomaly_percentage": 0.2,
                "distortion_coefficient": 0.5
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
        - `noise_level`: Standard deviation of the random noise.
        - `anomaly_percentage`: Percentage of points that are anomalies.
        - `distortion_coefficient`: Distortion coefficient for anomaly points.

    Returns:
        JSONResponse: A list of point clouds representing an animated scaled sphere.
    """
    # Generate the base point cloud
    base_point_cloud = generate_filled_sphere_point_cloud(request.num_points)
    
    # Generate the animated point clouds
    frames_data = [
        apply_sinusoidal_transformation_with_noise_and_anomalies(
                base_point_cloud, frame, 
                request.num_frames, request.scale_min, request.scale_max, 
                request.num_cycles, request.noise_level, 
                request.anomaly_percentage, request.distortion_coefficient
            ) 
        for frame in range(request.num_frames)
    ]
    
    data = [calculate_data(points) for points in frames_data]
    return JSONResponse(content=jsonable_encoder(data))

# Scenario 4: Custom Scaled Hollow Sphere Point Cloud
class CustomScaledHollowSphereRequest(BaseModel):
    num_points: int             # Number of points to generate in each frame
    num_frames: int             # Number of frames to generate
    scale_min: float = 0.1      # Minimum scale value for the points
    scale_max: float = 1.0      # Maximum scale value for the points
    num_cycles: int = 1         # Number of cycles for the oscillation
    noise_level: float = 0.1    # Standard deviation of the random noise
    anomaly_percentage: float = 0.1 # Percentage of points that are anomalies
    distortion_coefficient: float = 0.5 # Distortion coefficient for anomaly points

    class Config:
        schema_extra = {
            "example": {
                "num_points": 300,
                "num_frames": 20,
                "scale_min": 0.2,
                "scale_max": 1.5,
                "num_cycles": 3,
                "noise_level": 0.1,
                "anomaly_percentage": 0.2,
                "distortion_coefficient": 0.5
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
        - `noise_level`: Standard deviation of the random noise.
        - `anomaly_percentage`: Percentage of points that are anomalies.
        - `distortion_coefficient`: Distortion coefficient for anomaly points.
    
    Returns:
        JSONResponse: A list of point clouds representing a custom scaled hollow sphere.
    """
    # Generate the base point cloud
    base_point_cloud = generate_hallow_sphere_point_cloud(request.num_points)
    
    # Generate the animated point clouds
    frames_data = [
        apply_sinusoidal_transformation_with_noise_and_anomalies(
                base_point_cloud, frame, 
                request.num_frames, request.scale_min, request.scale_max, 
                request.num_cycles, request.noise_level, 
                request.anomaly_percentage, request.distortion_coefficient
            ) 
        for frame in range(request.num_frames)
    ]
    
    data = [calculate_data(points) for points in frames_data]
    return JSONResponse(content=jsonable_encoder(data))

# Scenario 5: Upload a Video to Generate a Time Series Point Cloud
processed_data = {} # Temporary storage for processed data
@app.post("/uploadvideo/")
async def create_upload_file(file: UploadFile = File(...), num_points_per_frame: int = Form(...)):
    """
    Endpoint to upload a video and process it to generate point clouds.
    """
    # Load Monodepth2 model
    model_name = "mono+stereo_640x192"
    model_path = "./backend/src/models/monodepth2/" + model_name
    encoder_path = model_path + "/encoder.pth"
    depth_decoder_path = model_path + "/depth.pth"

    # Load the model onto CPU
    encoder, depth_decoder = load_model(encoder_path, depth_decoder_path, device=torch.device("cpu"))
    
    # Save temporary video file
    temp_video_path = "temp_video.mp4"
    with open(temp_video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process the video
    point_clouds = video_to_point_clouds(temp_video_path, encoder, depth_decoder, num_points_per_frame=num_points_per_frame)

    # Clean up: remove the temporary file
    os.remove(temp_video_path)

    # Calculate data for each point cloud    
    data = [calculate_data(points) for points in point_clouds]

    # Generate a unique ID for this data
    data_id = str(uuid.uuid4())
    processed_data[data_id] = data

    # Return the unique ID as reference
    return {"data_id": data_id}

@app.get("/retrieve_data/{data_id}")
async def retrieve_data(data_id: str):
    """
    Endpoint to retrieve processed data using a unique ID.
    """
    if data_id in processed_data:
        return JSONResponse(content=jsonable_encoder(processed_data[data_id]))
    else:
        return JSONResponse(content={"error": "Data not found"}, status_code=404)

