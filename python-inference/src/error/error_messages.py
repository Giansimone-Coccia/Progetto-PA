class ErrorMessages:
    # Definizione dei messaggi di errore come attributi della classe
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
        # Metodo per ottenere il messaggio di errore in base alla chiave
        return getattr(ErrorMessages, error_key, "Unknown error")
