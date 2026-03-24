import Activity from './models/Activity';
import connectToDatabase from './mongodb';

export const logActivity = async (
  user: string,
  action: string,
  details: string,
  type: string,
  organizationId: string | null = null,
  franchiseId: string | null = null
) => {
  try {
    await connectToDatabase();
    await Activity.create({
      user,
      action,
      details,
      type,
      organizationId,
      franchiseId,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
