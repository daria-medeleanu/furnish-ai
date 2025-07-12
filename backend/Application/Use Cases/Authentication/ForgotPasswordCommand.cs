using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Authentication
{
    public class ForgotPasswordCommand : IRequest<ErrorOr<Unit>>
    {
        public string Email { get; set; }
    }
}
