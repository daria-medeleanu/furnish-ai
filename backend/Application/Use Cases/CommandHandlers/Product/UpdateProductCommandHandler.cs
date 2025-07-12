using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class UpdateProductCommandHandler(IProductRepository repository, IMapper mapper) : IRequestHandler<UpdateProductCommand, ErrorOr<Updated>>
    {
        private readonly IProductRepository repository = repository;
        private readonly IMapper mapper = mapper;

        public async Task<ErrorOr<Updated>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var product = mapper.Map<Product>(request);
            return await repository.UpdateAsync(product, cancellationToken);
        }
    }
}
