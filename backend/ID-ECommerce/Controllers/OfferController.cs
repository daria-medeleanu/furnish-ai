using Application.DTOs;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ID_ECommerce.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly IMediator mediator;

        public OfferController(IMediator mediator)
        {
            this.mediator = mediator;
        }
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Guid>> CreateOffer([FromBody] CreateOfferCommand command)
        {
            var result = await mediator.Send(command);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }

        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> GetOfferById(Guid id, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetOfferByIdQuery { Id = id }, cancellationToken);

            if (result.IsError)
                return BadRequest(result.Errors);

            return Ok(result.Value);
        }

        [HttpGet("user/{userId:guid}")]
        [Authorize]
        public async Task<IActionResult> GetOffersByUser(Guid userId, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetAllOffersByUserIdQuery { UserId = userId }, cancellationToken);

            if (result.IsError)
                return BadRequest(result.Errors);

            return Ok(result.Value);
        }

        [HttpGet("product/{productId:guid}/seller/{sellerId:guid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<OfferDto>>> GetOffersByProduct(Guid productId, Guid sellerId, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetOffersByProductQuery { ProductId = productId, SellerId = sellerId }, cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }

        [HttpPut("{id:guid}/accept")]
        [Authorize]
        public async Task<ActionResult> AcceptOffer(Guid id, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new AcceptOfferCommand { OfferId = id });
            if(result.IsError)
                return BadRequest(result.Errors);
            return StatusCode(StatusCodes.Status204NoContent);
        }

        [HttpPut("{id:guid}/reject")]
        [Authorize]
        public async Task<ActionResult> RejectOffer(Guid id, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new RejectOfferCommand { OfferId = id });
            if (result.IsError)
                return BadRequest(result.Errors);
            return StatusCode(StatusCodes.Status204NoContent);
        }
        [HttpPut("{id:guid}/delete")]
        [Authorize]
        public async Task<ActionResult> DeleteOffer(Guid id, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new DeleteOfferCommand { OfferId = id });
            if (result.IsError)
                return BadRequest(result.Errors);
            return StatusCode(StatusCodes.Status204NoContent);
        }
    }
}
