import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tripDetails: Object,
    generatedItinerary: Object,
    sharedWith: {
        type: [
            {
                email: { type: String, required: true },
                permission: {
                    type: String,
                    enum: ['view', 'edit'],
                    default: 'view'
                }
            }
        ],
        default: []
    },
    createdAt: { type: Date, default: Date.now },
});

TripSchema.index({ userId: 1, createdAt: -1 });

export const TripModel = mongoose.model('Trip', TripSchema);

export const createNewTrip = async (userId: string, tripDetails: Record<string, any>, generatedItinerary: Record<string, any>) => {
    const trip = new TripModel({ userId, tripDetails, generatedItinerary });
    return trip.save();
};

export const updateTripItinerary = async (tripId: string, generatedItinerary: Record<string, any>) => {
    const trip = await TripModel.findById(tripId);
    if (!trip) throw new Error('Trip not found');

    trip.generatedItinerary = generatedItinerary.generatedItinerary ?? generatedItinerary;
    trip.markModified('generatedItinerary');
    return trip.save();
};

export const getTripById = async (tripId: string) => {
    return TripModel.findById(tripId);
};

export const getUserTrips = async (userId: string, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [trips, total] = await Promise.all([
        TripModel.find({ userId })
            .select('-generatedItinerary')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        TripModel.countDocuments({ userId }),
    ]);
    return { trips, total, page, limit, totalPages: Math.ceil(total / limit) };
};
