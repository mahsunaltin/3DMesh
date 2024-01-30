import cv2
import numpy as np
import open3d as o3d
import torch
from torchvision import transforms
from PIL import Image
from backend.src.models.monodepth2.networks import ResnetEncoder, DepthDecoder

def load_model(encoder_path, depth_decoder_path, device=torch.device("cpu")):
    """
    Load the Monodepth2 model with the weights mapped to the specified device (CPU by default).
    """
    # Create the model instances
    num_layers = 18  # Adjust based on your model
    encoder = ResnetEncoder(num_layers, False)
    depth_decoder = DepthDecoder(num_ch_enc=encoder.num_ch_enc)

    # Load the state dictionaries, ignoring unexpected keys
    encoder_state_dict = torch.load(encoder_path, map_location=device)
    encoder_state_dict = {k: v for k, v in encoder_state_dict.items() if k in encoder.state_dict()}
    encoder.load_state_dict(encoder_state_dict, strict=False)

    depth_decoder_state_dict = torch.load(depth_decoder_path, map_location=device)
    depth_decoder.load_state_dict(depth_decoder_state_dict, strict=False)

    # Set to evaluation mode
    encoder.eval()
    depth_decoder.eval()

    return encoder, depth_decoder

def process_image(image, encoder, depth_decoder):
    """
    Process an image and estimate depth.
    """
    # Preprocessing the image
    input_image = image.convert('RGB')
    original_width, original_height = input_image.size
    input_image = input_image.resize((640, 192), Image.LANCZOS)
    input_image = transforms.ToTensor()(input_image).unsqueeze(0)

    # Predict using the model
    with torch.no_grad():
        features = encoder(input_image)
        outputs = depth_decoder(features)

    disp = outputs[("disp", 0)]
    disp_resized = torch.nn.functional.interpolate(disp, (original_height, original_width), mode="bilinear", align_corners=False)

    # Saving depth images
    disp_resized_np = disp_resized.squeeze().cpu().numpy()
    vmax = np.percentile(disp_resized_np, 95)
    normalized_disp = cv2.normalize(disp_resized_np, None, beta=0, alpha=255, norm_type=cv2.NORM_MINMAX)
    normalized_disp = np.array(normalized_disp, dtype=np.uint8)
    depth_colormap = cv2.applyColorMap(normalized_disp, cv2.COLORMAP_MAGMA)

    return depth_colormap


def video_to_frames(video_path, frames_per_second=24):
    """
    Extract frames from the video at the specified rate.
    """
    cap = cv2.VideoCapture(video_path)
    frames = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
        if len(frames) == frames_per_second * 3:  # for 3 seconds of video
            break

    cap.release()
    return frames


def generate_point_cloud(rgb_image, depth_image, num_points=500, scale_factor=1000, depth_scale=1000.0, depth_trunc=3.0):
    """
    Generate a list of points from an RGB image and its corresponding depth image, 
    limiting the output to a specified number of points and scaling them up.

    Args:
    - rgb_image: The RGB image (as a numpy array).
    - depth_image: The depth image (as a numpy array).
    - num_points: The number of points to sample from the point cloud.
    - scale_factor: Factor to scale the point coordinates.
    - depth_scale: The scale factor for depth values.
    - depth_trunc: The maximum depth value to consider.

    Returns:
    - List of [x, y, z] coordinates representing the point cloud.
    """
    # Convert depth image to Open3D format
    depth_o3d = o3d.geometry.Image(depth_image)
    
    # Convert RGB image to Open3D format
    rgb_o3d = o3d.geometry.Image(cv2.cvtColor(rgb_image, cv2.COLOR_BGR2RGB))

    # Create an RGBD image
    rgbd_image = o3d.geometry.RGBDImage.create_from_color_and_depth(rgb_o3d, depth_o3d, depth_scale=depth_scale, depth_trunc=depth_trunc, convert_rgb_to_intensity=False)
    
    # Create point cloud
    pcd = o3d.geometry.PointCloud.create_from_rgbd_image(rgbd_image, o3d.camera.PinholeCameraIntrinsic(o3d.camera.PinholeCameraIntrinsicParameters.PrimeSenseDefault))

    # Uniformly sample points if the point cloud has more points than num_points
    if len(pcd.points) > num_points:
        choice_indices = np.random.choice(len(pcd.points), num_points, replace=False)
        sampled_points = np.asarray(pcd.points)[choice_indices]
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(sampled_points)

    # Scale point coordinates
    scaled_points = np.asarray(pcd.points) * scale_factor

    return scaled_points


def video_to_point_clouds(video_path, encoder, depth_decoder, num_points_per_frame=500):
    """
    Process a video file and convert each frame to a point cloud.

    Args:
    - video_path: Path to the video file.
    - encoder: The trained encoder model for depth estimation.
    - depth_decoder: The trained depth decoder model.
    - num_points_per_frame: Number of points to sample in each point cloud.

    Returns:
    - List of point clouds, one for each frame.
    """
    cap = cv2.VideoCapture(video_path)
    point_clouds = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Convert frame to PIL Image for processing
        frame_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        
        # Estimate depth
        depth_image = process_image(frame_pil, encoder, depth_decoder)
        
        # Generate point cloud
        point_cloud = generate_point_cloud(frame, depth_image, num_points=num_points_per_frame)
        point_clouds.append(point_cloud)

    cap.release()
    return point_clouds
