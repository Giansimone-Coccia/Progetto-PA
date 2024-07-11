class CustomError(Exception):
    """
    Custom exception class for handling specific error scenarios with a custom status code.

    Attributes:
        message (str): Error message describing the specific issue.
        status_code (int): HTTP status code associated with the error.

    Methods:
        __init__(self, message, status_code):
            Initializes the CustomError instance with the provided message and status code.
    """

    def __init__(self, message, status_code):
        """
        Initializes a new instance of CustomError.

        Args:
            message (str): Error message describing the specific issue.
            status_code (int): HTTP status code associated with the error.
        """
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)
