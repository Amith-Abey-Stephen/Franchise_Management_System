import Order from './models/Order';
import Franchise from './models/Franchise';
import connectToDatabase from './mongodb';

export const calculateCommission = async (franchiseId: string, month: string) => {
    await connectToDatabase();
    // Month format: 'YYYY-MM'
    const parts = month.split('-');
    const year = parseInt(parts[0]);
    const monthIndex = parseInt(parts[1]) - 1;

    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

    const orders = await Order.find({
        franchiseId,
        status: 'completed',
        createdAt: { $gte: startDate, $lte: endDate }
    });

    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const franchise = await Franchise.findById(franchiseId);
    if (!franchise) throw new Error('Franchise not found');

    const commissionAmount = (totalSales * (franchise.commissionPercentage || 10)) / 100;

    return { totalSales, commissionAmount };
};
