import { getOnboarding, saveOnboarding } from "../services/onboarding.service.js";
import { catchAsync } from "../utils/catch-async.js";

export const readOnboarding = catchAsync(async (req, res) => {
  const onboarding = await getOnboarding(req.user._id.toString());

  res.status(200).json({ onboarding });
});

export const upsertOnboarding = catchAsync(async (req, res) => {
  const onboarding = await saveOnboarding(req.user._id.toString(), req.body);

  res.status(200).json({
    message: "Onboarding saved",
    onboarding
  });
});
