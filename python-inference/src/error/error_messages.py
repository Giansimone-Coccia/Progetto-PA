class ErrorMessages:
    """
    Class to define and manage various error messages as class attributes.

    Attributes:
        NO_JSON_DATA (str): Error message for missing JSON data.
        JSON_CONTENTS_NOT_LIST (str): Error message when JSON contents are not a list.
        INVALID_MODEL_ID (str): Error message for an invalid model ID.
        INVALID_JSON_CONTENT (str): Error message for invalid JSON content format.
        INVALID_FILE_TYPE (str): Error message for an invalid file type.
        INVALID_BUFFER (str): Error message for an invalid buffer.
        UNSUPPORTED_TYPE (str): Error message for an unsupported type.
        DATASET_REQUIREMENT (str): Error message for dataset requirements not met.
        INTERNAL_SERVER_ERROR (str): Error message for internal server errors.

    Methods:
        get_error_message(error_key):
            Retrieves the error message corresponding to the provided error key.
            If the error key is not found, returns "Unknown error".
    """

    NO_JSON_DATA = "No JSON data found"
    JSON_CONTENTS_NOT_LIST = "jsonContents must be a list"
    INVALID_MODEL_ID = "Invalid modelId provided"
    INVALID_JSON_CONTENT = "Each element in jsonContents must be a list with three elements"
    INVALID_FILE_TYPE = "The file type must be a string"
    INVALID_BUFFER = "The file must be a valid Buffer"
    UNSUPPORTED_TYPE = "Unsupported type"
    DATASET_REQUIREMENT = "The dataset must contain images with at least 12 faces"
    INTERNAL_SERVER_ERROR = "Internal Server Error"

    @staticmethod
    def get_error_message(error_key):
        """
        Retrieves the error message associated with the given error key.

        Args:
            error_key (str): The key corresponding to the desired error message.

        Returns:
            str: The error message associated with the error key. If the key is not found,
                 returns "Unknown error".
        """
        return getattr(ErrorMessages, error_key, "Unknown error")
