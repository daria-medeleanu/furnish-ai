using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Authentication
{
    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, ErrorOr<Unit>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordResetTokenRepository _tokenRepository;
        private readonly IEmailSender _emailSender;

        public ForgotPasswordCommandHandler(
            IUserRepository userRepository,
            IPasswordResetTokenRepository tokenRepository,
            IEmailSender emailSender)
        {
            _userRepository = userRepository;
            _tokenRepository = tokenRepository;
            _emailSender = emailSender;
        }

        public async Task<ErrorOr<Unit>> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var userResult = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
            if (userResult.IsError)
            {
                return Unit.Value;
            }

            var user = userResult.Value;
            var token = Guid.NewGuid().ToString();
            var resetToken = new PasswordResetToken
            {
                Id = Guid.NewGuid(),
                Email = user.Email,
                Token = token,
                Expiration = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false
            };

            await _tokenRepository.AddAsync(resetToken);

            var resetLink = $"http://localhost:5173/reset-password?token={token}";
            var emailBody = $"Click the following link to reset your password: {resetLink}";

            await _emailSender.SendEmailAsync(user.Email, "Reset Your Password", emailBody);

            return Unit.Value;
        }

    }
}
