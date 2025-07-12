using ErrorOr;

namespace Identity.Errors
{
    public static class AuthenticationErrors
    {
        public static Error UserNotFound { get; } = Error.NotFound("User.NotFound");
        public static Error InvalidCredentials { get; } = Error.Failure(
            "User.InvalidCredentials",
            "Invalid email or password");
        public static Error UserAlreadyExists { get; } = Error.Failure(
            "User.AlreadyExists",
            "A user with this email already exists");
        public static Error Unknown(Exception ex) => Error.Failure(
            "Repository.Unknown",
            "Other error, see exception for cause",
            new Dictionary<string, object> { ["exception"] = ex });
        public static Error Cancelled { get; } = Error.Failure("User.OperationCancelled", "Operation was cancelled");
    }
}
