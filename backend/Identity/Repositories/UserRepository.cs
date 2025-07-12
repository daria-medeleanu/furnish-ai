using Domain.Entities;
using Domain.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using ErrorOr;
using Identity.Errors;


namespace Identity.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly UsersDbContext usersDbContext;
        private readonly IConfiguration configuration;

        public UserRepository(UsersDbContext usersDbContext, IConfiguration configuration)
        {
            this.usersDbContext = usersDbContext;
            this.configuration = configuration;
        }

        public async Task<ErrorOr<string>> Login(User user, CancellationToken cancellationToken)
        {
            var existingUser = await usersDbContext.Users.SingleOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser is null)
            {
                return Errors.AuthenticationErrors.UserNotFound;
            }
            var passwordIsValid = VerifyPassword(user.PasswordHash, existingUser.PasswordHash);

            if (!passwordIsValid)
            {
                return Errors.AuthenticationErrors.InvalidCredentials;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, existingUser.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddMinutes(240),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)

            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private bool VerifyPassword(string enteredPassword, string storedHash)
        {
            return BCrypt.Net.BCrypt.Verify(enteredPassword, storedHash);
        }

        public async Task<ErrorOr<Guid>> Register(User user, CancellationToken cancellationToken)
        {
            var existingUser = await usersDbContext.Users.SingleOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser is not null)
            {
                return Errors.AuthenticationErrors.UserAlreadyExists;
            }
            usersDbContext.Users.Add(user);
            await usersDbContext.SaveChangesAsync(cancellationToken);
            return user.Id;
        }
        public async Task<ErrorOr<User>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var user = await usersDbContext.Users.SingleOrDefaultAsync(u => u.Id == id, cancellationToken);

                return user ?? AuthenticationErrors.UserNotFound.ToErrorOr<User>();
            }
            catch (OperationCanceledException) { return AuthenticationErrors.Cancelled; }
            catch (Exception ex) { return AuthenticationErrors.Unknown(ex); }
        }
        public async Task<ErrorOr<Updated>> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            try
            {
                var existingUser = await usersDbContext.Users.SingleOrDefaultAsync(u => u.Id == user.Id, cancellationToken);
                if (existingUser is null)
                {
                    return AuthenticationErrors.UserNotFound.ToErrorOr<Updated>();
                }
                existingUser.Phone = user.Phone;
                existingUser.Country = user.Country;
                existingUser.City = user.City;
                usersDbContext.Users.Update(existingUser);
                await usersDbContext.SaveChangesAsync(cancellationToken);
                return Result.Updated;
            }
            catch (OperationCanceledException) { return AuthenticationErrors.Cancelled; }
            catch (Exception ex) { return AuthenticationErrors.Unknown(ex); }
        }
    }
}
