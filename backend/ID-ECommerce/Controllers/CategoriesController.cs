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
    public class CategoriesController(IMediator mediator) : ControllerBase
    {
        private readonly IMediator mediator = mediator;

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAllCategories()
        {
            var result = await mediator.Send(new GetAllCategoriesQuery { });
            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Value);
        }

        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<CategoryDto>> GetCategoryById( Guid id)
        {
            var result = await mediator.Send(new GetCategoryByIdQuery { Id = id });

            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result.Value);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Guid>> CreateCategory([FromBody] CreateCategoryCommand command)
        {
            var result = await mediator.Send(command);

            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result.Value);

        }

        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<ActionResult> UpdateCategory([FromBody] UpdateCategoryCommand command, [FromRoute] Guid id)
        {
            command.Id = id;
            var result = await mediator.Send(command);
            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }

            return StatusCode(StatusCodes.Status204NoContent);
        }
        [HttpGet("by-title/{title}")]
        [Authorize]
        public async Task<IActionResult> GetCategoriesByTitle([FromRoute] string title)
        {
            var result = await mediator.Send(new GetCategoriesByTitleQuery { Title = title }); 
            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Value);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<ActionResult> DeleteCategory([FromRoute] Guid id)
        {
            var result = await mediator.Send(new DeleteCategoryCommand { Id = id });

            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result.Value);
        }
    }
}
