using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetAllCategoriesQueryHandler(ICategoryRepository repository, IMapper mapper) : IRequestHandler<GetAllCategoriesQuery, ErrorOr<IEnumerable<CategoryDto>>>
    {
        private readonly ICategoryRepository repository = repository;
        private readonly IMapper mapper = mapper;

        public async Task<ErrorOr<IEnumerable<CategoryDto>>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
        {
            var categories = await repository.GetAllAsync(cancellationToken);
            return (await repository.GetAllAsync(cancellationToken)).Then(mapper.Map<IEnumerable<CategoryDto>>);
        }
    }
}