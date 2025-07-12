using Application.DTOs;
using Application.Use_Cases.Command;
using Application.Use_Cases.CommandHandlers;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ID_ECommerce.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IMediator mediator;
        public OrdersController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost("checkout")]
        [Authorize]
        public async Task<ActionResult<Guid>> Checkout([FromBody] CheckoutOrderCommand command)
        {
            var result = await mediator.Send(command);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
        {
            var result = await mediator.Send(new GetAllOrdersQuery { });
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }

        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<OrderDto>> GetOrderById(Guid id)
        {
            var result = await mediator.Send(new GetOrderByIdQuery { Id = id });
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<ActionResult> DeleteOrder(Guid id)
        {
            var result = await mediator.Send(new DeleteOrderCommand { Id = id });
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }

        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<ActionResult> UpdateOrder(Guid id, [FromBody] UpdateOrderCommand command)
        {
            command.Id = id;
            var result = await mediator.Send(command);
            if (result.IsError)
                return BadRequest(result.Errors);
            return NoContent();
        }

        [HttpPost("start-delivery/{orderId:guid}")]
        [Authorize]
        public async Task<ActionResult> StartDelivery([FromRoute]Guid orderId)
        {
            var result = await mediator.Send(new StartDeliveryCommand { OrderId = orderId });
            if (result.IsError)
                return BadRequest(result.Errors);
            return NoContent();
        }


        [HttpPost("mark-delivered/{orderId:guid}")]
        [Authorize]
        public async Task<ActionResult> MarkAsDelivered([FromRoute] Guid orderId)
        {
            var result = await mediator.Send(new MarkDeliveredCommand { OrderId = orderId });
            if (result.IsError)
                return BadRequest(result.Errors);
            return NoContent();
        }

        //Active Orders for Client
        [HttpGet("client-active-orders/{userId:guid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersByUserId([FromRoute] Guid userId, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetActiveOrdersByUserIdQuery { UserId = userId }, cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }
        //History Orders for Client
        [HttpGet("client-history-orders/{userId:guid}")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetHistoryOrdersByUserId([FromRoute] Guid userId, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetHistoryOrdersByUserIdQuery { UserId = userId }, cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }

        //Active Orders for Seller
        [HttpGet("seller-active-orders/{userId:guid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetActiveProductsBySellerIdQuery([FromRoute] Guid userId, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetActiveProductsBySellerIdQuery { UserId = userId }, cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }
        //History Orders for Seller
        [HttpGet("seller-history-orders/{userId:guid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetSoldProductsBySellerId([FromRoute] Guid userId, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetSoldProductsBySellerIdQuery { UserId = userId }, cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }
        

    }
}