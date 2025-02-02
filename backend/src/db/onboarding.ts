import mongoose from 'mongoose';


const OnboardingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currentStep: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started'
    },
    completedSteps: [{
        type: Number
    }],
    temporaryPreferences: {
        type: Object,
        default: {
            pace: '',
            activities: [],
            activityLevel: '',
            startTime: '',
            foodApproach: '',
            diningStyles: [],
            avoidances: []
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const OnboardingModel = mongoose.model('Onboarding', OnboardingSchema);

export const startOnboarding = async (userId: mongoose.Schema.Types.ObjectId) => {
    try {
        return await OnboardingModel.create({
            userId,
            status: 'in_progress'
        });
    } catch (error) {
        throw new Error(error);
    }
}
