from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from typing import Optional

from backend.src.utils.calculate_data import calculate_data
from backend.src.utils.synthetic_data_generator import generate_points_data, generate_synthetic_time_series

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


class PointsRequest(BaseModel):
    num_points: int
    scale: float
    num_frames: Optional[int] = 100

@app.post("/generate_points")
async def generate_points(request: PointsRequest):
    frames_data = [generate_points_data(request.num_points, request.scale) for _ in range(request.num_frames)]
    #frames_data = generate_synthetic_time_series(request.num_frames, request.num_points)
    data = [calculate_data(points) for points in frames_data]
    return JSONResponse(content=jsonable_encoder(data))
