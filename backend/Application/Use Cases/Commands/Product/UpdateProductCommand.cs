using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class UpdateProductCommand : IRequest<ErrorOr<Updated>>
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public Guid? CategoryID { get; set; }
    }
}
