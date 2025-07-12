using Domain.Repositories;
using ErrorOr;
using MediatR;
using Domain.Errors;

namespace Application.Use_Cases.Authentication
{
   
    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, ErrorOr<Unit>>
    {
        private readonly IPasswordResetTokenRepository _tokenRepository;
        private readonly IUserRepository _userRepository;

        public ResetPasswordCommandHandler(
            IPasswordResetTokenRepository tokenRepository,
            IUserRepository userRepository)
        {
            _tokenRepository = tokenRepository;
            _userRepository = userRepository;
        }

        public async Task<ErrorOr<Unit>> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.NewPassword) ||
                request.NewPassword.Length < 7 ||
                !request.NewPassword.Any(char.IsDigit))
            {
                return DomainErrors.Authentication.WeakPassword;
            }

            var tokenResult = await _tokenRepository.GetByTokenAsync(request.Token);
            if (tokenResult.IsError)
            {
                return Error.Validation("Token", "Token is invalid or expired.");
            }

            var tokenEntry = tokenResult.Value;
            if (tokenEntry.IsUsed || tokenEntry.Expiration < DateTime.UtcNow)
            {
                return Error.Validation("Token", "Token is invalid or expired.");
            }

            var userResult = await _userRepository.GetByEmailAsync(tokenEntry.Email, cancellationToken);
            if (userResult.IsError)
            {
                return Error.NotFound("User not found.");
            }

            var user = userResult.Value;
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            user.PasswordHash = hashedPassword;
            await _userRepository.UpdateAsync(user, cancellationToken);

            await _tokenRepository.MarkAsUsedAsync(tokenEntry);

            return Unit.Value;
        }
    }
}