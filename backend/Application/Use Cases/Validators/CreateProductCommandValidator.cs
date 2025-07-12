using Application.Use_Cases.Commands;
using FluentValidation;

namespace Application.Use_Cases.Validators
{
    public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
    {
        public CreateProductCommandValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(50).WithMessage("Title must be at most 50 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Description must be at most 1000 characters.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0.");

            RuleFor(x => x.Condition)
                .IsInEnum().WithMessage("Invalid condition value.");

            RuleFor(x => x.Currency)
                .IsInEnum().WithMessage("Invalid currency value.");

            RuleFor(x => x.UserID)
                .NotEmpty().WithMessage("UserID is required.");

            RuleFor(x => x.imageUrls)
                .NotNull().WithMessage("ImageUrls is required.")
                .Must(urls => urls.Count <= 10)
                .WithMessage("You can upload a maximum of 10 images.");

            // CategoryID is optional so no validation required
        }
    }
}
