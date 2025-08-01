import mongoose, {Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema({
    videoFile: {
        type: String,    //cloudinary url
        required: true
    },
    thumbnail: {
        type: String,    //cloudinary url
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,   //cloudinary url
    },
    views: {
        type: Number,   //cloudinary url
        required: true,
        default: 0
    },
    isPublished: {
        type: Number,   //cloudinary url
        required: true,
        default: 0
    },
    owner: {
        type:Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

videoSchema.plugin(mongooseAggregatePaginate);


export const Video = mongoose.model("Video", videoSchema)