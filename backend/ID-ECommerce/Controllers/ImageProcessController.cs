using Application.DTOs;
using Application.Use_Cases.Commands;
using Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ID_ECommerce.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ImageProcessController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ImageProcessController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("generate")]
        [Authorize]
        public async Task<IActionResult> Generate([FromForm] GenerateMaskRequestDto request, CancellationToken cancellationToken)
        {
            var command = new GenerateMaskCommand(request);
            var result = await _mediator.Send(command, cancellationToken);

            return File(result.MaskImage, result.ContentType, "mask.png");
        }

        [HttpPost("inpaint")]
        [Authorize]
        public async Task<IActionResult> Inpaint([FromForm] InpaintImageRequestDto request, CancellationToken cancellationToken)
        {
            var command = new InpaintImageCommand(request);
            var result = await _mediator.Send(command, cancellationToken);

            if (result.IsSuccess)
            {
                return File(result.ImageData, result.ContentType, "inpainted_result.png");
            }
            else
            {
                return BadRequest(new { error = result.ErrorMessage });
            }
        }
    }
}
