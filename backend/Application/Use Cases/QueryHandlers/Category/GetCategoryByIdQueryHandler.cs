using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.Category
{
    public class GetCategoryByIdQueryHandler(ICategoryRepository repository, IMapper mapper) : IRequestHandler<GetCategoryByIdQuery, ErrorOr<CategoryDto>>
    {
        private readonly ICategoryRepository repository = repository;
        private readonly IMapper mapper = mapper;

        public async Task<ErrorOr<CategoryDto>> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            return (await repository.GetByIdAsync(request.Id, cancellationToken)).Then(mapper.Map<CategoryDto>);
        }
    }
}
