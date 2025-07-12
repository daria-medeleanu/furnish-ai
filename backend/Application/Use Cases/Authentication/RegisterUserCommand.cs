using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Authentication
{
    public class RegisterUserCommand : IRequest<ErrorOr<Guid>>
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Password { get; set; }
        public string? ImageUrl { get; set; }
        public string City { get; set; }      
        public string Country { get; set; }   
        public string Phone { get; set; }
    }
}
