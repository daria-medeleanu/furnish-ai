using ErrorOr;
using MediatR;
using Application.DTOs;

namespace Application.Use_Cases.Queries
{
        public class GetActiveProductsPaginatedQuery : IRequest<ErrorOr<PaginatedResultDto<ProductDto>>>
        {
            public int Page { get; set; }
            public int PageSize { get; set; }
            public string? Title { get; set; }
            public decimal? MinPrice { get; set; }
            public decimal? MaxPrice { get; set; }
            public string? City { get; set; }
            public Guid? CategoryId { get; set; } 

    }
}

