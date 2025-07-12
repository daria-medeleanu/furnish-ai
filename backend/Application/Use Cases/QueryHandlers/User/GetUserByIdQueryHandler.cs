using Application.DTOs;
using Application.Use_Cases.Queries.User;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.User
{
    public class GetUserByIdQueryHandler(IUserRepository repository, IMapper mapper) : IRequestHandler<GetUserByIdQuery, ErrorOr<UserDto>>
    {
        private readonly IUserRepository repository = repository;
        private readonly IMapper mapper = mapper;

        public async Task<ErrorOr<UserDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            return (await repository.GetByIdAsync(request.Id, cancellationToken)).Then(mapper.Map<UserDto>);
        }
    }

}
