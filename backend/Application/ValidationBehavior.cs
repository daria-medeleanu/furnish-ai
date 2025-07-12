using ErrorOr;
using FluentValidation;
using MediatR;

namespace Application
{
    public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, ErrorOr<TResponse>>
    {
        private readonly IEnumerable<IValidator<TRequest>> validators;

        public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        {
            this.validators = validators;
        }

        public async Task<ErrorOr<TResponse>> Handle(TRequest request, RequestHandlerDelegate<ErrorOr<TResponse>> next, CancellationToken cancellationToken)
        {
            var context = new ValidationContext<TRequest>(request);

            var failures = validators
                .SelectMany(r => r.Validate(context).Errors)
                .Where(f => f is not null)
                .ToList();

            if (failures.Count != 0)
            {
                var errors = failures
                    .ConvertAll(f => Error.Validation(code: f.PropertyName, description: f.ErrorMessage));

                return errors;
            }

            return await next();
        }
    }
}
