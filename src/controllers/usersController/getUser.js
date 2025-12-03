import { asyncHandler } from "#middlewares/asyncHandler.js";
import { HTTP_STATUS } from "#utils/statusCodes.js";

export const getUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data: user
  });
});