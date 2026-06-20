import { Response, NextFunction } from "express";
import Video from "../models/video.model";
import { ConflictError, BadRequestError } from "../utils/AppError";
import { AuthenticatedRequest } from "../types/User";
import { sendSuccess } from "../utils/response";

const extractYoutubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// GET /api/v1/videos
export const getVideos = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const videos = await Video.find()
      .populate("addedBy", "id name")
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, "Videos fetched successfully.", { videos });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/videos
export const createVideo = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { url, title, description } = req.body as {
      url: string;
      title?: string;
      description?: string;
    };

    const youtubeId = extractYoutubeId(url);
    if (!youtubeId) {
      throw BadRequestError("Invalid YouTube URL");
    }

    const existingVideo = await Video.findOne({ url });
    if (existingVideo) {
      throw ConflictError("This video has already been added.");
    }

    const video = await Video.create({
      url,
      youtubeId,
      title: title || null,
      description: description || null,
      addedBy: req.user?.id || null,
    });

    const populatedVideo = await Video.findById(video._id).populate("addedBy", "id name");

    sendSuccess(res, 201, "Video added successfully.", { video: populatedVideo });
  } catch (error) {
    next(error);
  }
};
