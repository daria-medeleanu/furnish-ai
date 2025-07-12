using Application.DTOs;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Queries.User
{
    public class GetUserByIdQuery : IRequest<ErrorOr<UserDto>>
    {
        public Guid Id { get; set; }
    }
}
