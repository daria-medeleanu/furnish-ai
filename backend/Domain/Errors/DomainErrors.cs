using ErrorOr;

namespace Domain.Errors
{
    public static class DomainErrors
    {
        public static class Authentication
        {
            public static Error WeakPassword =>
                Error.Validation("Password.Weak", "Password must be at least 7 characters long and contain at least one number.");

            public static Error UserAlreadyExists =>
                Error.Conflict("User.Exists", "A user with this email already exists.");

            public static Error UserNotFound =>
                Error.NotFound("User.NotFound", "User not found.");

            public static Error InvalidCredentials =>
                Error.Validation("User.InvalidCredentials", "Invalid credentials.");
        }
    }
}