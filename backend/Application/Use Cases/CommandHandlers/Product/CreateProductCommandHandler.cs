using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreateProductCommandHandler(IProductRepository repository, IMapper mapper) : IRequestHandler<CreateProductCommand, ErrorOr<Guid>>
    {
        private readonly IProductRepository repository = repository;
        private readonly IMapper mapper = mapper;

        public async Task<ErrorOr<Guid>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var product = mapper.Map<Product>(request);
            return await repository.AddAsync(product, cancellationToken);
        }
    }
}
