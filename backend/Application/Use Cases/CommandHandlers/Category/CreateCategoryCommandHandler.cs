using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreateCategoryCommandHandler(ICategoryRepository repository, IMapper mapper) : IRequestHandler<CreateCategoryCommand, ErrorOr<Guid>>
    {
        private readonly ICategoryRepository repository = repository;
        private readonly IMapper mapper = mapper;

        public async Task<ErrorOr<Guid>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = mapper.Map<Category>(request);
            return await repository.AddAsync(category, cancellationToken);
        }
    }
}
