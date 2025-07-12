using Application.DTOs;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Queries;
using Domain.Entities;
using ErrorOr;
using Infrastructure.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ID_ECommerce.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator mediator;
        public ProductsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Guid>> CreateProduct(CreateProductCommand command)
        {
            var result = await mediator.Send(command);

            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result.Value);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts([FromQuery] Guid userId, CancellationToken cancellationToken)
        {
            var query = new GetAllProductsQuery { UserId = userId };
            var result = await mediator.Send(query, cancellationToken);

            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result.Value);
        }
        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<ProductDto>> GetProductById(Guid id)
        {
            var result = await mediator.Send(new GetProductByIdQuery { Id = id });

            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result.Value);
        }
        [HttpGet("getbyuserid/{userId:guid}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByUserId(Guid userId, CancellationToken cancellationToken)
        {
            var query = new GetProductsByUserIdQuery { UserId = userId };
            var result = await mediator.Send(query, cancellationToken);
            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result.Value);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<ActionResult> DeleteProduct(Guid id)
        {
            var result = await mediator.Send(new DeleteProductCommand { Id = id });

            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result.Value);
        }
        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<ActionResult> UpdateProducts(Guid id, UpdateProductCommand command)
        {
            command.Id = id;
            var result = await mediator.Send(command);
            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }

            return StatusCode(StatusCodes.Status204NoContent);
        }
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetActiveProducts(CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetActiveProductsQuery(), cancellationToken);
            if (result.IsError)
                return BadRequest(result.Errors);

            return Ok(result.Value);
        }

        //[HttpGet("active-paginated")]
        //public async Task<ActionResult<PaginatedResult<ProductDto>>> GetActiveProductsPaginated([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        //{
        //    var result = await mediator.Send(new GetActiveProductsPaginatedQuery { PageNumber = pageNumber, PageSize = pageSize }, cancellationToken);
        //    if (result.IsError)
        //        return BadRequest(result.Errors);

        //    return Ok(result.Value);
        //}
        [HttpGet("paginated")]
        [Authorize]
        public async Task<ActionResult> GetAllProductsPaginated(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 5, 
            string? title = null, 
            [FromQuery] decimal? minPrice = null, 
            [FromQuery] decimal? maxPrice = null, 
            [FromQuery] string? city = null, 
            [FromQuery] Guid? categoryId = null)
        {
            return (await mediator.Send(new GetActiveProductsPaginatedQuery { Page = page, PageSize = pageSize, Title = title, MinPrice = minPrice, MaxPrice = maxPrice, City = city, CategoryId = categoryId }))
                      .Match<ActionResult>(
                          productDtos => Ok(productDtos),
                          error => BadRequest(error)
                      );
        }
        [HttpGet("searchbox/{title}")]
        [Authorize]
        public async Task<IActionResult> GetProductsByTitle([FromRoute] string title, CancellationToken cancellationToken)
        {
            return (await mediator.Send(new GetProductsByTitleQuery { Title = title }, cancellationToken))
                .Match<ActionResult>(
                    productDtos => Ok(productDtos),
                    error => BadRequest(error)
                );
        } 
    }
}
