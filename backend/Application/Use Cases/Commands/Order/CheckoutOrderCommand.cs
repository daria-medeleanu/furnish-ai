using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Command
{
    public class CheckoutOrderCommand : IRequest<ErrorOr<Guid>>
    {
        public required Guid ClientId { get; set; }
        public required Guid SellerId { get; set; }
        public required Guid ProductId { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
        public string Address { get; set;}
    }
}
