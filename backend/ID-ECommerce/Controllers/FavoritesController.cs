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
    public class FavoritesController : ControllerBase
    {
        private readonly IMediator mediator;
        public FavoritesController(IMediator mediator)
        {
            this.mediator = mediator;
        }
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Guid>> AddFavorite([FromBody] AddFavoriteCommand command, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(command, cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> RemoveFavorite([FromBody] DeleteFavoriteCommand command, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(command, cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);
            return NoContent();
        }
        [HttpPost("toggle")]
        [Authorize]
        public async Task<ActionResult<bool>> ToggleFavorite([FromBody] ToggleFavoriteCommand command, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(command, cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value); // true = added, false = removed
        }
        [HttpGet("is-favorite")]
        [Authorize]
        public async Task<ActionResult<bool>> IsFavorite([FromQuery] Guid userId, [FromQuery] Guid productId, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new IsFavoriteQuery { UserId = userId, ProductId = productId }, cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FavoriteDto>>> GetFavorites([FromQuery] Guid userId, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetFavoritesQuery { UserId = userId }, cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);
            return Ok(result.Value);
        }

    }
}
