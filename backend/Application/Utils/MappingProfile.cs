using Application.DTOs;
using Application.Use_Cases.Authentication;
using Application.Use_Cases.Command;
using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Utils
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<CreateProductCommand, Product>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            CreateMap<UpdateProductCommand, Product>()
                .ForMember(dest => dest.Category, opt => opt.Ignore());


            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<CreateCategoryCommand, Category>()
                    .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<UpdateCategoryCommand, Category>();

            CreateMap<User, UserDto>().ReverseMap();

            CreateMap<Order, OrderDto>().ReverseMap();
            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.ProductTitle, opt => opt.MapFrom(src => src.Product.Title));
            CreateMap<User, SellerDto>();
            CreateMap<User, ClientDto>();
            CreateMap<CheckoutOrderCommand, Order>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<UpdateOrderCommand, Order>();

            CreateMap<Favorite, FavoriteDto>().ReverseMap();

            CreateMap<UpdateUserInfoCommand, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Name, opt => opt.Ignore())
                .ForMember(dest => dest.Surname, opt => opt.Ignore())
                .ForMember(dest => dest.Email, opt => opt.Ignore())
                .ForMember(dest => dest.ImageUrl, opt => opt.Ignore());

            CreateMap<Offer, OfferDto>().ReverseMap();
            CreateMap<CreateOfferCommand, Offer>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => OfferStatus.Pending))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
            CreateMap<PaginatedResult<Product>, PaginatedResultDto<ProductDto>>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));
        }
    }
}
