import mongoose from "mongoose";

// Clear any cached model
if (mongoose.models.Workflow) {
  delete mongoose.models.Workflow;
}

const workflowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    nodes: mongoose.Schema.Types.Mixed,
    edges: mongoose.Schema.Types.Mixed,
    isActive: {
      type: Boolean,
      default: false,
    },
    executionLogs: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["success", "failure", "running"],
        },
        message: String,
        error: String,
      },
    ],
  },
  { timestamps: true, strict: false, versionKey: false }
);

export default mongoose.model("Workflow", workflowSchema);
