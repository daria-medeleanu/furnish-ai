using Application.Use_Cases.Command;
using Domain.Entities;
using Domain.Repositories;
using ErrorOr;
using MediatR;

public class CheckoutOrderCommandHandler : IRequestHandler<CheckoutOrderCommand, ErrorOr<Guid>>
{
    private readonly IOrderRepository orderRepository;
    private readonly IProductRepository productRepository;

    public CheckoutOrderCommandHandler(IOrderRepository orderRepository, IProductRepository productRepository)
    {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public async Task<ErrorOr<Guid>> Handle(CheckoutOrderCommand request, CancellationToken cancellationToken)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            ClientId = request.ClientId,
            SellerId = request.SellerId,
            ProductId = request.ProductId,
            OrderDate = DateTime.UtcNow,
            OrderStatus = "Pending",
            Address = request.Address, 
            Price = request.Price,
            Currency = request.Currency,
        };

        var orderResult = await orderRepository.AddAsync(order, cancellationToken);
        if (orderResult.IsError)
            return orderResult.Errors;

        var productResult = await productRepository.GetByIdAsync(request.ProductId, cancellationToken);
        if (productResult.IsError)
            return productResult.Errors;

        var product = productResult.Value;
        product.IsActive = false;
        var updateResult = await productRepository.UpdateAsync(product, cancellationToken);
        if (updateResult.IsError)
            return updateResult.Errors;

        return order.Id;
    }
}