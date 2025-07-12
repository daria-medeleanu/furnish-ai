using Application.DTOs;
using Application.Use_Cases.Authentication;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Queries.User;
using ErrorOr;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ID_ECommerce.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController(IMediator mediator) : ControllerBase
    {
        private readonly IMediator mediator = mediator;
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserCommand command)
        {
            var result = await mediator.Send(command);
            if (result.IsError)
            {
                return BadRequest(new
                {
                    Errors = result.Errors.Select(e => new
                    {
                        e.Code,
                        e.Description
                    })
                });
            }
            return Ok(new { UserId = result });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserCommand command)
        {
            var result = await mediator.Send(command);
            
            if (result.IsError)
            {
                return BadRequest(new
                {
                    Errors = result.Errors.Select (e => new
                    {
                        e.Code, 
                        e.Description
                    })
                });
            }
            
            return Ok(new { Token = result });
        }
        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetUserById(Guid id)
        {
            var result = await mediator.Send(new GetUserByIdQuery { Id = id });

            if(result.IsError)
            {
                return BadRequest(result.Errors);
            }
            return Ok(result);
        }
        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<ActionResult> UpdateUserInfo(Guid id, [FromBody] UpdateUserInfoCommand command)
        {
            if (id != command.UserId)
            {
                return BadRequest("Route id and body UserId do not match.");
            }

            var result = await mediator.Send(command);

            if (result.IsError)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
        {

            var result = await mediator.Send(command);
            if (result.IsError)
                return BadRequest(new
                {
                    Code = result.FirstError.Code,
                    Description = result.FirstError.Description
                });

            return Ok(new { message = "If that email exists, a reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
        {
            var result = await mediator.Send(command);
            if (result.IsError)
                return BadRequest(new
                {
                    Code = result.FirstError.Code,
                    Description = result.FirstError.Description
                });

            return Ok(new { message = "Password reset successfully." });
        }
    }
}
