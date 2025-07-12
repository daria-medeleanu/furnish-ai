using ErrorOr;
using MediatR;
using System;

namespace Application.Use_Cases.Authentication
{
    public class ResetPasswordCommand : IRequest<ErrorOr<Unit>>
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}
