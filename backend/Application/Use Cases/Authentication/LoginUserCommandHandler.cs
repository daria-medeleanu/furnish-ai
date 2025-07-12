using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Authentication
{
    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, ErrorOr<string>>
    {
        private readonly IUserRepository userRepository;

        public LoginUserCommandHandler(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        public async Task<ErrorOr<string>> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                Email = request.Email,
                PasswordHash = request.Password
            };
            var result = await userRepository.Login(user, cancellationToken);


            if (result.IsError)
            {
                return result.Errors;
            }

            return result.Value;
        }
    }
}
