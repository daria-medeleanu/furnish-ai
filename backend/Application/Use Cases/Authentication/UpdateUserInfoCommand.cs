using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Authentication
{
    public class UpdateUserInfoCommand : IRequest<ErrorOr<Updated>>
    {
        public Guid UserId { get; set; }
        public string? Phone { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
    }
}