import { getDashboardSummary } from "../services/dashboard.service.js";
import { catchAsync } from "../utils/catch-async.js";

export const readDashboardSummary = catchAsync(async (req, res) => {
  const summary = await getDashboardSummary(req.user._id.toString());

  res.status(200).json({ summary });
});
