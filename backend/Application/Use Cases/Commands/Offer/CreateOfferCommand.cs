using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class CreateOfferCommand : IRequest<ErrorOr<Guid>>
    {
        public Guid BuyerId { get; set; }
        public string BuyerName { get; set; }
        public Guid ProductId { get; set; }
        public decimal OfferedPrice { get; set; }
        public string Currency { get; set; }
        public string? Message { get; set; }
    }
}
