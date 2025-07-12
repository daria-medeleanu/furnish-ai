using Domain.Entities;
using Domain.Errors;
using Domain.Repositories;
using ErrorOr;
using MediatR;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Use_Cases.Authentication
{
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, ErrorOr<Guid>>
    {
        private readonly IUserRepository repository;
        public RegisterUserCommandHandler(IUserRepository repository)
        {
            this.repository = repository;
        }
        public async Task<ErrorOr<Guid>> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Password) ||
                request.Password.Length < 7 ||
                !request.Password.Any(char.IsDigit))
            {
               return DomainErrors.Authentication.WeakPassword;
            }
            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                Surname = request.Surname,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                ImageUrl = request.ImageUrl,
                City = request.City,
                Country = request.Country,
                Phone = request.Phone
            };
            var result = await repository.Register(user, cancellationToken);

            if (result.IsError)
            {
                return result.Errors;
            }

            return result.Value;
        }
    }
}
