using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;


namespace Application.Use_Cases.QueryHandlers.Category
{
    public class GetCategoriesByTitleQueryHandler(ICategoryRepository repository, IMapper mapper) : IRequestHandler<GetCategoriesByTitleQuery, ErrorOr<IEnumerable<CategoryDto>>>
    {
        private readonly ICategoryRepository repository = repository;
        private readonly IMapper mapper = mapper;
        public async Task<ErrorOr<IEnumerable<CategoryDto>>> Handle(GetCategoriesByTitleQuery request, CancellationToken cancellationToken)
        {
            return (await repository.GetCategoriesByTitleAsync(request.Title, cancellationToken))
                .Then(mapper.Map<IEnumerable<CategoryDto>>);

        }
    }
}
