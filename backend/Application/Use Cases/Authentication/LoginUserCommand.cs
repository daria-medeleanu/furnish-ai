using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Authentication
{
    public class LoginUserCommand : IRequest<ErrorOr<string>>
    {
        public string Email { get; set;}
        public string Password { get; set; }
    }
}
