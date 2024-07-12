export const ErrorMessages = {
    /**
     * User authentication and registration errors.
     */
    E_P_R_REQUIRED: "Email, password, and role are required",
    INVALID_EMAIL_FORMAT: "Invalid email format",
    INVALID_PASSWORD_FORMAT: "Password must be at least 8 characters long and include at least one digit, one lowercase letter, one uppercase letter, and one special character.",
    INVALID_ROLE: "Role must be either user or admin",
    ADMIN_EXISTS: "Admin already exists",
    USER_EXISTS: "User already exists",
    E_P_REQUIRE: "Email and password are required",
    USER_NOT_FOUND: "User not found",
    INVALID_PASSWORD: "Invalid password",
    ERROR_OCCURED_LOGIN: "An error occurred during login",

    /**
     * Content management errors.
     */
    CONTENT_NOT_FOUND: "Content not found",
    INVALID_ID: "Invalid ID. ID must be a number",
    FAILED_RETRIEVE_CONTENT: "Failed to retrieve contents",
    DATASET_NOT_FOUND: "Dataset not found",
    UNAUTHORIZED_ACCESS_DATASET: "Unauthorized access to dataset",
    NO_FILE_UPLOADED: "No file uploaded",
    INVALID_FILE_TYPE: "Invalid file type",
    INVALID_ZIP_FILE: "Invalid zip file",
    INSUFFICIENT_TOKENS: "Insufficient tokens",
    UNAUTHORIZED: "Unauthorized",
    INTERNAL_SERVER_ERROR: "Internal server error",
    CONTENT_CREATED_SUCCESSFULLY: "Content created successfully",
    FAILED_UPDATE_CONTENT: "Failed to update content",
    FAILED_DELETE_CONTENT: "Failed to delete content",
    DATA_TYPE_REQUIRED: "data, datasetId, type and name are required",

    /**
     * Specific field validation errors.
     */
    NAME_REQUIRED: "The 'name' field is required.",
    TAGS_REQUIRED: "The 'tags' field must be an array of strings.",
    DUPLICATED_CONTENT: "Duplicate content detected in datasets with the same name for the user",
    DATASET_UPDATED: "Dataset updated",
    FAILED_UPDATE_DATASET: "Failed to update dataset",

    /**
     * Inference-related errors.
     */
    FAILED_RETRIVE_INFERENCES: "Failed to retrieve inferences",
    INFERENCES_NOT_FOUND: "Inference not found or not completed",
    INFERENCES_FETCH_FAILED: "Failed to fetch inference",
    INFERENCES_CREATION_FAILED: "Failed to create inference",
    INFERENCES_UPDATE_FAILED: "Failed to update inference",
    INFERENCES_DELETE_FAILED: "Failed to delete inference",
    DID_MID_REQUIRED: "datasetId and modelId are required",
    MODEL_ID_1_2_3: "modelId has to be 1, 2 or 3",
    ERROR_INFERENCE: "Error during inference execution",
    JOB_NOT_FOUND: "Job not found",
    ERROR_JOB_STATUS: "Error retrieving job status",

    /**
     * User management errors.
     */
    FAILED_RETRIEVE_USERS: "Failed to retrieve users",
    FAILED_FETCH_USER: "Failed to fetch user",
    FAILED_CREATE_USER: "Failed to create user",
    FAILED_UPDATE_USER: "Failed to update user",
    FAILED_DELETE_USER: "Failed to delete user",
    EMAIL_REQUIRED: "Email is required",
    TOKEN_VALUE_REQUIRED: "Token value is required",
    INVALID_USER_ID: "Invalid user ID",
    ERROR_UPDATING_TOKENS: "Error updating user tokens",
    TOKENS_UPDATED_SUCCESSFULLY: "Tokens updated successfully",
    FAILED_FETCH_USER_TOKEN: "Failed to fetch user tokens",
    FAILED_UPDATE_USER_TOKEN: "Failed to update user tokens",
    UNAUTHORIZED_ACCESS: "Unauthorized access"
} as const;
