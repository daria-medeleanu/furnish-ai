using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class UpdateCategoryCommandHandler(ICategoryRepository repository, IMapper mapper) : IRequestHandler<UpdateCategoryCommand, ErrorOr<Updated>>
    {
        private readonly ICategoryRepository repository = repository;
        private readonly IMapper mapper = mapper;

        public async Task<ErrorOr<Updated>> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = mapper.Map<Category>(request);
            return await repository.UpdateAsync(category, cancellationToken);
        }
    
    }
}
