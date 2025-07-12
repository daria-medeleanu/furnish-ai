using Domain.Repositories;
using ErrorOr;
using MediatR;

namespace Application.Use_Cases.Authentication
{
    public class UpdateUserInfoCommandHandler : IRequestHandler<UpdateUserInfoCommand, ErrorOr<Updated>>
    {
        private readonly IUserRepository userRepository;

        public UpdateUserInfoCommandHandler(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        public async Task<ErrorOr<Updated>> Handle(UpdateUserInfoCommand request, CancellationToken cancellationToken)
        {
            var userResult = await userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (userResult.IsError)
                return userResult.Errors;

            var user = userResult.Value;
            user.Phone = request.Phone;
            user.Country = request.Country;
            user.City = request.City;

            var updateResult = await userRepository.UpdateAsync(user, cancellationToken);
            return updateResult;
        }
    }
}