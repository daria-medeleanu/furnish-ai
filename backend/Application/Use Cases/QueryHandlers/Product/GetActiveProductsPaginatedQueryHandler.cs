using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetActiveProductsPaginatedQueryHandler : IRequestHandler<GetActiveProductsPaginatedQuery, ErrorOr<PaginatedResultDto<ProductDto>>>
    {
            private readonly IProductRepository repository;
            private readonly IMapper mapper;
            public GetActiveProductsPaginatedQueryHandler(IProductRepository repository, IMapper mapper)
            {
                this.repository = repository;
                this.mapper = mapper;
            }
            public async Task<ErrorOr<PaginatedResultDto<ProductDto>>> Handle(GetActiveProductsPaginatedQuery request, CancellationToken cancellationToken)
            {
                return (await repository.GetActiveProductsPaginatedAsync(request.Page,request.PageSize, request.Title, request.MinPrice, request.MaxPrice, request.City, request.CategoryId, cancellationToken))
                    .Then(mapper.Map<PaginatedResultDto<ProductDto>>);
            }
    }
}

