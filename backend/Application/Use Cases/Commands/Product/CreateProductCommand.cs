using Domain.Entities;
using Domain.Enums;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class CreateProductCommand : IRequest<ErrorOr<Guid>>
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public Guid? CategoryID { get; set; }
        public Condition Condition { get; set; }
        public Currency Currency { get; set; }
        public decimal Views { get; set; } = 0;
        public Guid UserID { get; set; }
        public List<string> imageUrls { get; set; }
    }
}
