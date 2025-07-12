using ErrorOr;

namespace Infrastructure.Errors
{
    public static class RepositoryErrors
    {
        public static Error NotFound { get; } = Error.NotFound("Repository.NotFound");
        public static Error Cancelled { get; } = Error.Failure("Repository.OperationCancelled", "Operation was cancelled");
        public static Error Unknown(Exception ex) => Error.Failure(
            "Repository.Unknown",
            "Other error, see exception for cause",
            new Dictionary<string, object> { ["exception"] = ex });
    }
}
